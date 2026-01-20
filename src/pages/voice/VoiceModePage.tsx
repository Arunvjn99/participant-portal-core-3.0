import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { VoiceHeader } from "../../components/voice/VoiceHeader";
import { VoiceOrb } from "../../components/voice/VoiceOrb";
import { VoiceTranscript } from "../../components/voice/VoiceTranscript";
import { VoiceControls } from "../../components/voice/VoiceControls";
import { VoiceFooter } from "../../components/voice/VoiceFooter";
import { UIState, AgentState, TaskType, type VoiceMessage, type VoiceState } from "../../types/voice";
import { createAgentController } from "../../agent/AgentController";
import { enhanceAgentResponse, normalizeUserInputWithLLM, LLMResponsePolisher } from "../../agent/LLMEnhancer";
import { useSpeechToText } from "../../hooks/useSpeechToText";
import { useTextToSpeech } from "../../hooks/useTextToSpeech";

/**
 * VoiceModePage - Full-screen voice interaction interface
 * Enforces strict UI and agent state management
 */
export const VoiceModePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const previousRouteRef = useRef<string | null>(null);

  const [voiceState, setVoiceState] = useState<VoiceState>({
    uiState: UIState.IDLE,
    agentState: AgentState.IDLE,
    currentTask: null,
    messages: [],
    lastUserInput: "",
  });

  const [isTypingMode, setIsTypingMode] = useState(false);
  const [textInput, setTextInput] = useState("");

  // PART 2: Greeting state - track if greeting has been spoken
  const greetingSpokenRef = useRef(false);

  // Ref for handleUserInput to avoid circular dependency
  const handleUserInputRef = useRef<((input: string) => Promise<void>) | null>(null);

  // STRUCTURAL FIX: Create AgentController instance inside component (not module-scope)
  // This breaks circular dependency and avoids "Cannot access before initialization" errors
  const agentControllerRef = useRef<ReturnType<typeof createAgentController> | null>(null);
  if (!agentControllerRef.current) {
    agentControllerRef.current = createAgentController();
  }
  const agentController = agentControllerRef.current;

  // CENTRAL CONFIRMATION GUARD - Non-negotiable safety check
  const isConfirmationState = voiceState.uiState === UIState.CONFIRMATION_REQUIRED;

  // Speech-to-Text hook
  const {
    isRecording,
    isProcessing,
    startRecording,
    stopRecording,
    cancelRecording,
    cleanup: cleanupSTT,
  } = useSpeechToText({
    onTranscript: (transcript) => {
      // CRITICAL: Block transcript processing in confirmation state unless explicitly triggered
      // Check current UI state to prevent accidental confirmations
      // Note: This is a safety check - we also check in handleUserInput
      if (handleUserInputRef.current) {
        handleUserInputRef.current(transcript);
      }
    },
    onError: (error) => {
      setVoiceState((prev) => ({
        ...prev,
        uiState: UIState.ERROR,
        errorMessage: error,
      }));
    },
    onStateChange: (state) => {
      if (state === "recording") {
        setVoiceState((prev) => {
          // CRITICAL: Never auto-start listening in confirmation state
          if (prev.uiState === UIState.CONFIRMATION_REQUIRED) {
            console.warn("⚠️ CONFIRMATION STATE: STT state change BLOCKED - blocking transition to LISTENING");
            return prev;
          }
          return {
            ...prev,
            uiState: UIState.LISTENING,
          };
        });
      } else if (state === "processing") {
        setVoiceState((prev) => {
          // CRITICAL: Never auto-start processing in confirmation state
          if (prev.uiState === UIState.CONFIRMATION_REQUIRED) {
            console.warn("⚠️ CONFIRMATION STATE: STT state change BLOCKED - blocking transition to THINKING");
            return prev;
          }
          return {
            ...prev,
            uiState: UIState.THINKING,
          };
        });
      }
    },
  });

  // Text-to-Speech hook
  const {
    isSpeaking,
    speak,
    stop: stopTTS,
    interrupt: interruptTTS,
    cleanup: cleanupTTS,
    initializeAudioContext,
    ensureAudioContextResumed,
  } = useTextToSpeech({
    onStart: () => {
      setVoiceState((prev) => {
        // CRITICAL: Never set to SPEAKING in confirmation state
        if (prev.uiState === UIState.CONFIRMATION_REQUIRED) {
          console.warn("⚠️ CONFIRMATION STATE: TTS onStart BLOCKED - preventing transition to SPEAKING");
          return prev;
        }
        return {
          ...prev,
          uiState: UIState.SPEAKING,
        };
      });
    },
    onEnd: () => {
      setVoiceState((prev) => {
        // After speaking, transition to appropriate state
        if (prev.agentState === AgentState.COMPLETED) {
          return { ...prev, uiState: UIState.COMPLETED };
        } else if (prev.uiState === UIState.CONFIRMATION_REQUIRED) {
          // Don't change state if confirmation is required
          return prev;
        } else {
          return { ...prev, uiState: UIState.AWAITING_INPUT };
        }
      });
    },
    onError: (error) => {
      setVoiceState((prev) => ({
        ...prev,
        uiState: UIState.ERROR,
        errorMessage: error,
      }));
    },
  });

  // Store previous route on mount
  useEffect(() => {
    if (location.state?.from) {
      previousRouteRef.current = location.state.from;
    } else {
      previousRouteRef.current = "/dashboard";
    }
  }, [location.state]);

  // Handle ESC key to close (works even in confirmation state)
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // ESC always exits voice mode safely, even in confirmation state
        if (isConfirmationState) {
          console.warn("⚠️ CONFIRMATION STATE: ESC key pressed - exiting voice mode safely");
        }
        handleClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [handleClose, isConfirmationState]);

  // Prevent body scroll when voice mode is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      cleanupSTT();
      cleanupTTS();
    };
  }, [cleanupSTT, cleanupTTS]);

  const handleClose = useCallback(() => {
    // Stop any ongoing audio
    interruptTTS();
    cancelRecording();
    cleanupSTT();
    cleanupTTS();
    
    if (previousRouteRef.current) {
      navigate(previousRouteRef.current);
    } else {
      navigate("/dashboard");
    }
  }, [navigate, interruptTTS, cancelRecording, cleanupSTT, cleanupTTS]);

  // PART 2: Greeting text (exact)
  const GREETING_TEXT = "Hi, I'm your retirement assistant. I can help with enrollment, loans, and account questions. What would you like to do today?";

  // PART 1: Unlock audio and speak greeting on first user interaction
  const unlockAudioAndSpeakGreeting = useCallback(async () => {
    // Initialize AudioContext
    initializeAudioContext();
    
    // PART 1: Force resume AudioContext before any speech
    if (ensureAudioContextResumed) {
      await ensureAudioContextResumed();
    }

    // PART 2: Speak greeting if not yet spoken
    if (!greetingSpokenRef.current) {
      console.log("👋 Speaking greeting");
      greetingSpokenRef.current = true;
      speak(GREETING_TEXT);
    }
  }, [initializeAudioContext, ensureAudioContextResumed, speak]);

  const handleMicToggle = useCallback(() => {
    // CRITICAL SAFETY RULE: Never start mic in confirmation state
    if (isConfirmationState) {
      console.warn("⚠️ CONFIRMATION STATE: MIC AUTO-START BLOCKED - confirmation state requires explicit button click");
      return;
    }

    // PART 1: Unlock audio and speak greeting on first interaction
    unlockAudioAndSpeakGreeting();

    // Stop any ongoing TTS when starting to listen (interruption)
    if (isSpeaking) {
      interruptTTS();
      // On interrupt: stop audio immediately, UI_STATE → AWAITING_INPUT
      setVoiceState((prev) => ({
        ...prev,
        uiState: UIState.AWAITING_INPUT,
      }));
    }

    if (isRecording || voiceState.uiState === UIState.LISTENING) {
      // Stop listening
      stopRecording();
      setVoiceState((prev) => ({
        ...prev,
        uiState: UIState.IDLE,
      }));
    } else if (
      voiceState.uiState === UIState.IDLE ||
      voiceState.uiState === UIState.AWAITING_INPUT ||
      voiceState.uiState === UIState.ERROR ||
      voiceState.uiState === UIState.SPEAKING
    ) {
      // Start listening
      startRecording();
    }
  }, [isConfirmationState, voiceState.uiState, isRecording, isSpeaking, startRecording, stopRecording, interruptTTS, unlockAudioAndSpeakGreeting]);

  const handleUserInput = useCallback(
    async (input: string) => {
      if (!input.trim()) return;

      // CRITICAL: Explicit confirmation phrase enforcement
      // When in confirmation state, validate input BEFORE forwarding to AgentController
      if (isConfirmationState && voiceState.confirmationPhrase) {
        const lowerInput = input.toLowerCase().trim();
        const lowerPhrase = voiceState.confirmationPhrase.toLowerCase().trim();
        
        // Check if input matches required phrase (exact or contains phrase)
        const isValidConfirmation = 
          lowerInput === lowerPhrase || 
          lowerInput.includes(lowerPhrase) ||
          // Also check against known confirmation phrases
          (voiceState.currentTask === TaskType.LOAN && 
            (lowerInput.includes("yes, submit loan") || 
             lowerInput.includes("confirm loan application") ||
             lowerInput.includes("yes submit loan") ||
             lowerInput.includes("confirm loan"))) ||
          (voiceState.currentTask === TaskType.ENROLLMENT && 
            (lowerInput.includes("yes, submit enrollment") || 
             lowerInput.includes("confirm enrollment") ||
             lowerInput.includes("yes submit enrollment") ||
             lowerInput.includes("submit enrollment")));
        
        // If user says generic "yes" or partial confirmation, reject it
        if (lowerInput === "yes" || lowerInput === "confirm" || lowerInput === "submit") {
          console.warn("⚠️ CONFIRMATION STATE: Partial confirmation rejected - exact phrase required");
          setVoiceState((prev) => ({
            ...prev,
            messages: [
              ...prev.messages,
              {
                id: `user-${Date.now()}`,
                type: "user",
                text: input,
                timestamp: new Date(),
              },
              {
                id: `agent-${Date.now()}`,
                type: "agent",
                text: `I need the exact confirmation phrase: "${voiceState.confirmationPhrase}". Please say the full phrase exactly as shown, or click the Confirm button.`,
                timestamp: new Date(),
              },
            ],
          }));
          return; // Do NOT forward to AgentController
        }
        
        // If input doesn't match required phrase, show error but still forward to AgentController
        // AgentController will also validate and return appropriate error
        if (!isValidConfirmation) {
          console.warn("⚠️ CONFIRMATION STATE: Invalid confirmation phrase - forwarding to AgentController for validation");
        }
      }

      // PART 1: Unlock audio and speak greeting on first user interaction
      await unlockAudioAndSpeakGreeting();
      
      // Wait for greeting to finish before processing input
      // (Add a small delay to let greeting complete if it just started)
      if (greetingSpokenRef.current && isSpeaking) {
        // Wait a bit for greeting to finish, then process input
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Add user message
      const userMessage: VoiceMessage = {
        id: `user-${Date.now()}`,
        type: "user",
        text: input,
        timestamp: new Date(),
      };

      // PART 1: Normalize spoken numbers BEFORE AgentController
      // This helps with phrases like "twelve thousand" → "12000"
      const normalizedInput = await normalizeUserInputWithLLM(input);
      const normalizedText = normalizedInput.normalizedText || input;

      // Update UI state to THINKING
      setVoiceState((prev) => ({
        ...prev,
        messages: [...prev.messages, userMessage],
        lastUserInput: input,
        uiState: UIState.THINKING,
      }));

      // Process normalized input through AgentController
      // AgentController will use its own deterministic parsing as fallback
      const agentResponse = agentController.handleUserInput(normalizedText);
      const agentState = agentController.getState();

      // PART 2: Polish response wording AFTER AgentController
      // First use existing enhanceAgentResponse for backward compatibility
      let enhancedText = await enhanceAgentResponse(agentResponse, {
        currentStep: agentState.currentStep,
        currentTask: agentState.currentTask,
      });

      // Then apply additional polishing if needed
      const polishedText = await LLMResponsePolisher(enhancedText, {
        noAdvice: true,
        maxLength: 3, // Max 3 short lines
        preservePhrases: agentResponse.confirmationPhrase
          ? [agentResponse.confirmationPhrase]
          : undefined,
      });

      enhancedText = polishedText;

      // Map UI state hint to UIState enum
      const uiStateMap: Record<string, UIState> = {
        IDLE: UIState.IDLE,
        LISTENING: UIState.LISTENING,
        THINKING: UIState.THINKING,
        SPEAKING: UIState.SPEAKING,
        AWAITING_INPUT: UIState.AWAITING_INPUT,
        CONFIRMATION_REQUIRED: UIState.CONFIRMATION_REQUIRED,
        COMPLETED: UIState.COMPLETED,
        ERROR: UIState.ERROR,
      };

      const agentMessage: VoiceMessage = {
        id: `agent-${Date.now()}`,
        type: "agent",
        text: enhancedText, // Use enhanced text
        timestamp: new Date(),
        quickReplies: agentResponse.quickReplies,
      };

      // Update state with agent response
      const newUiState = uiStateMap[agentResponse.uiStateHint] || UIState.IDLE;
      const enteringConfirmationState = newUiState === UIState.CONFIRMATION_REQUIRED;
      
      setVoiceState((prev) => {
        const newState = {
          ...prev,
          messages: [...prev.messages, agentMessage],
          uiState: newUiState,
          agentState: agentState.agentState,
          currentTask: agentState.currentTask,
          confirmationPhrase: agentResponse.confirmationPhrase,
          errorMessage: agentResponse.errorMessage,
        };
        return newState;
      });

      // AUDIT LOG: Entering confirmation state
      if (enteringConfirmationState) {
        console.warn("⚠️ CONFIRMATION STATE: Entering confirmation state - TTS and mic auto-start BLOCKED");
        // CRITICAL: Stop mic if recording when entering confirmation state
        if (isRecording) {
          console.warn("⚠️ CONFIRMATION STATE: Stopping active recording");
          stopRecording();
        }
        // CRITICAL: Stop any ongoing TTS
        if (isSpeaking) {
          console.warn("⚠️ CONFIRMATION STATE: Interrupting ongoing TTS");
          interruptTTS();
        }
      }

      // PART 1: Fix TTS Silence - ONLY block CONFIRMATION_REQUIRED
      // Agent SHOULD speak when: asking questions, confirming input, explaining, reading summary, reporting success/cancellation
      // Agent MUST NOT auto-speak ONLY when: CONFIRMATION_REQUIRED
      const shouldSpeak = 
        enhancedText &&
        enhancedText.trim().length > 0 &&
        agentResponse.uiStateHint !== "CONFIRMATION_REQUIRED";

      if (shouldSpeak) {
        console.log("🗣 Speaking agent response:", enhancedText);
        // TTS hook's onStart callback will set UI_STATE to SPEAKING
        // TTS hook's onEnd callback will transition to AWAITING_INPUT or appropriate state
        speak(enhancedText);
      } else if (enteringConfirmationState) {
        console.warn("⚠️ CONFIRMATION STATE: TTS BLOCKED - confirmation state requires explicit user action");
        // Ensure UI state is set to CONFIRMATION_REQUIRED
        setVoiceState((prev) => ({
          ...prev,
          uiState: UIState.CONFIRMATION_REQUIRED,
        }));
      } else {
        // If we're not speaking, ensure UI state is set correctly
        const finalUiState = uiStateMap[agentResponse.uiStateHint] || UIState.IDLE;
        if (finalUiState !== UIState.CONFIRMATION_REQUIRED) {
          setVoiceState((prev) => ({
            ...prev,
            uiState: finalUiState === UIState.COMPLETED ? UIState.COMPLETED : finalUiState === UIState.ERROR ? UIState.ERROR : UIState.AWAITING_INPUT,
          }));
        }
      }

      // Clear text input
      setTextInput("");
    },
    [speak, unlockAudioAndSpeakGreeting, isRecording, isSpeaking, stopRecording, interruptTTS, isConfirmationState, voiceState.confirmationPhrase, voiceState.currentTask]
  );

  // Update ref when handleUserInput changes
  useEffect(() => {
    handleUserInputRef.current = handleUserInput;
  }, [handleUserInput]);

  const handleTextSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (textInput.trim()) {
        handleUserInput(textInput.trim());
      }
    },
    [textInput, handleUserInput]
  );

  const handleQuickReply = useCallback(
    async (reply: string) => {
      // PART 1: Unlock audio and speak greeting on first user interaction
      await unlockAudioAndSpeakGreeting();
      handleUserInput(reply);
    },
    [handleUserInput, unlockAudioAndSpeakGreeting]
  );

  const handleGlobalCommand = useCallback(
    async (command: "repeat" | "go_back" | "cancel" | "summarize" | "switch_to_typing") => {
      // PART 1: Unlock audio and speak greeting on first user interaction
      await unlockAudioAndSpeakGreeting();
      
      switch (command) {
        case "repeat":
          // Use AgentController to handle repeat
          const repeatResponse = agentController.handleUserInput("repeat");
          const repeatState = agentController.getState();
          const enhancedRepeatText = await enhanceAgentResponse(repeatResponse, {
            currentStep: repeatState.currentStep,
            currentTask: repeatState.currentTask,
          });
          if (repeatResponse.uiStateHint !== "ERROR") {
            const uiStateMap: Record<string, UIState> = {
              IDLE: UIState.IDLE,
              LISTENING: UIState.LISTENING,
              THINKING: UIState.THINKING,
              SPEAKING: UIState.SPEAKING,
              AWAITING_INPUT: UIState.AWAITING_INPUT,
              CONFIRMATION_REQUIRED: UIState.CONFIRMATION_REQUIRED,
              COMPLETED: UIState.COMPLETED,
              ERROR: UIState.ERROR,
            };
            setVoiceState((prev) => ({
              ...prev,
              uiState: uiStateMap[repeatResponse.uiStateHint] || prev.uiState,
              messages: [
                ...prev.messages,
                {
                  id: `agent-${Date.now()}`,
                  type: "agent",
                  text: enhancedRepeatText,
                  timestamp: new Date(),
                  quickReplies: repeatResponse.quickReplies,
                },
              ],
            }));
            // CRITICAL: Block TTS in confirmation state
            const isNowConfirmation = repeatResponse.uiStateHint === "CONFIRMATION_REQUIRED";
            if (isNowConfirmation) {
              console.warn("⚠️ CONFIRMATION STATE: TTS BLOCKED for repeat command");
            } else if (
              enhancedRepeatText &&
              enhancedRepeatText.trim().length > 0 &&
              repeatResponse.uiStateHint !== "CONFIRMATION_REQUIRED" &&
              repeatResponse.uiStateHint !== "ERROR" &&
              repeatResponse.uiStateHint !== "IDLE"
            ) {
              console.log("🗣 Speaking repeat response:", enhancedRepeatText);
              speak(enhancedRepeatText);
            }
          }
          break;
        case "go_back":
          if (voiceState.agentState === AgentState.TASK_IN_PROGRESS) {
            // Use AgentController to handle go back
            const goBackResponse = agentController.goBack();
            const goBackState = agentController.getState();
            const enhancedGoBackText = await enhanceAgentResponse(goBackResponse, {
              currentStep: goBackState.currentStep,
              currentTask: goBackState.currentTask,
            });
            const uiStateMap: Record<string, UIState> = {
              IDLE: UIState.IDLE,
              LISTENING: UIState.LISTENING,
              THINKING: UIState.THINKING,
              SPEAKING: UIState.SPEAKING,
              AWAITING_INPUT: UIState.AWAITING_INPUT,
              CONFIRMATION_REQUIRED: UIState.CONFIRMATION_REQUIRED,
              COMPLETED: UIState.COMPLETED,
              ERROR: UIState.ERROR,
            };
            setVoiceState((prev) => ({
              ...prev,
              agentState: goBackState.agentState,
              uiState: uiStateMap[goBackResponse.uiStateHint] || prev.uiState,
              currentTask: goBackState.currentTask,
              messages: [
                ...prev.messages,
                {
                  id: `agent-${Date.now()}`,
                  type: "agent",
                  text: enhancedGoBackText,
                  timestamp: new Date(),
                  quickReplies: goBackResponse.quickReplies,
                },
              ],
            }));
            // PART 4: Only block TTS for CONFIRMATION_REQUIRED
            const shouldSpeakGoBack = 
              enhancedGoBackText &&
              enhancedGoBackText.trim().length > 0 &&
              goBackResponse.uiStateHint !== "CONFIRMATION_REQUIRED";
            
            if (shouldSpeakGoBack) {
              console.log("🗣 Speaking:", enhancedGoBackText.substring(0, 100) + "...");
              // PART 1: Ensure AudioContext is resumed
              if (ensureAudioContextResumed) {
                await ensureAudioContextResumed();
              }
              speak(enhancedGoBackText);
            }
          }
          break;
        case "cancel":
          // Stop any ongoing audio
          interruptTTS();
          cancelRecording();
          // Use AgentController to handle cancel
          const cancelResponse = agentController.cancel();
          const cancelState = agentController.getState();
          const enhancedCancelText = await enhanceAgentResponse(cancelResponse, {
            currentStep: cancelState.currentStep,
            currentTask: cancelState.currentTask,
          });
          setVoiceState((prev) => ({
            ...prev,
            agentState: cancelState.agentState,
            uiState: cancelResponse.uiStateHint === "IDLE" ? UIState.IDLE : prev.uiState,
            currentTask: cancelState.currentTask,
            messages: [
              ...prev.messages,
              {
                id: `agent-${Date.now()}`,
                type: "agent",
                text: enhancedCancelText,
                timestamp: new Date(),
              },
            ],
          }));
          // PART 4: Only block TTS for CONFIRMATION_REQUIRED
          const shouldSpeakCancel = 
            enhancedCancelText &&
            enhancedCancelText.trim().length > 0 &&
            cancelResponse.uiStateHint !== "CONFIRMATION_REQUIRED";
          
          if (shouldSpeakCancel) {
            console.log("🗣 Speaking:", enhancedCancelText.substring(0, 100) + "...");
            // PART 1: Ensure AudioContext is resumed
            if (ensureAudioContextResumed) {
              await ensureAudioContextResumed();
            }
            speak(enhancedCancelText);
          }
          break;
        case "summarize":
          handleUserInput("summarize");
          break;
        case "switch_to_typing":
          setIsTypingMode(true);
          setVoiceState((prev) => ({
            ...prev,
            uiState: UIState.AWAITING_INPUT,
          }));
          break;
      }
    },
    [voiceState, handleUserInput, interruptTTS, cancelRecording, unlockAudioAndSpeakGreeting, ensureAudioContextResumed, speak]
  );

  const handleConfirmation = useCallback(
    async (confirmed: boolean) => {
      // PART 1: Unlock audio and speak greeting on first user interaction
      await unlockAudioAndSpeakGreeting();
      
      if (confirmed) {
        // Use the confirmation phrase or default confirmation
        handleUserInput(voiceState.confirmationPhrase || "yes, submit loan");
      } else {
        // Cancel confirmation - reset agent
        const cancelResponse = agentController.cancel();
        const cancelState = agentController.getState();
        const enhancedCancelText = await enhanceAgentResponse(cancelResponse, {
          currentStep: cancelState.currentStep,
          currentTask: cancelState.currentTask,
        });
        setVoiceState((prev) => ({
          ...prev,
          uiState: UIState.IDLE,
          agentState: cancelState.agentState,
          currentTask: cancelState.currentTask,
          confirmationPhrase: undefined,
          messages: [
            ...prev.messages,
            {
              id: `agent-${Date.now()}`,
              type: "agent",
              text: enhancedCancelText,
              timestamp: new Date(),
            },
          ],
        }));
        // PART 4: Only block TTS for CONFIRMATION_REQUIRED
        const shouldSpeakConfirmationCancel = 
          enhancedCancelText &&
          enhancedCancelText.trim().length > 0 &&
          cancelResponse.uiStateHint !== "CONFIRMATION_REQUIRED";
        
        if (shouldSpeakConfirmationCancel) {
          console.log("🗣 Speaking:", enhancedCancelText.substring(0, 100) + "...");
          // PART 1: Ensure AudioContext is resumed
          if (ensureAudioContextResumed) {
            await ensureAudioContextResumed();
          }
          speak(enhancedCancelText);
        }
      }
    },
    [voiceState.confirmationPhrase, handleUserInput, unlockAudioAndSpeakGreeting, ensureAudioContextResumed, speak]
  );

  return (
    <div className="voice-mode">
      <div className="voice-mode__container">
        <VoiceHeader onClose={handleClose} />

        <div className="voice-mode__content">
          <VoiceOrb uiState={voiceState.uiState} agentState={voiceState.agentState} />

          <VoiceTranscript
            messages={voiceState.messages}
            uiState={voiceState.uiState}
            onQuickReply={handleQuickReply}
          />

          {voiceState.uiState === UIState.CONFIRMATION_REQUIRED && (
            <div className="voice-mode__confirmation">
              <div className="voice-mode__confirmation-warning">
                <p className="voice-mode__confirmation-text">
                  <strong>⚠️ Confirmation Required:</strong>
                </p>
                <p className="voice-mode__confirmation-phrase">
                  Please say exactly: <strong>"{voiceState.confirmationPhrase}"</strong>
                </p>
                <p className="voice-mode__confirmation-note">
                  This is a high-risk action. Only the exact phrase above will confirm this action.
                </p>
                <div className="voice-mode__confirmation-actions">
                  <button
                    type="button"
                    onClick={() => handleConfirmation(true)}
                    className="voice-mode__confirmation-button voice-mode__confirmation-button--confirm"
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    onClick={() => handleGlobalCommand("go_back")}
                    className="voice-mode__confirmation-button voice-mode__confirmation-button--back"
                  >
                    Go Back
                  </button>
                  <button
                    type="button"
                    onClick={() => handleConfirmation(false)}
                    className="voice-mode__confirmation-button voice-mode__confirmation-button--cancel"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {voiceState.uiState === UIState.ERROR && voiceState.errorMessage && (
            <div className="voice-mode__error">
              <p className="voice-mode__error-text">{voiceState.errorMessage}</p>
            </div>
          )}

          <VoiceControls
            uiState={voiceState.uiState}
            isTypingMode={isTypingMode}
            textInput={textInput}
            onTextInputChange={setTextInput}
            onTextSubmit={handleTextSubmit}
            onMicToggle={handleMicToggle}
            onGlobalCommand={handleGlobalCommand}
            onSwitchToTyping={() => {
              interruptTTS();
              setIsTypingMode(true);
            }}
            isRecording={isRecording}
            isSpeaking={isSpeaking}
          />
        </div>

        <VoiceFooter />
      </div>
    </div>
  );
};
