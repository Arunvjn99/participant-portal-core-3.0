import { UIState } from "@/types/voice";

interface VoiceControlsProps {
  uiState: UIState;
  isTypingMode: boolean;
  textInput: string;
  onTextInputChange: (value: string) => void;
  onTextSubmit: (e: React.FormEvent) => void;
  onMicToggle: () => void;
  onGlobalCommand: (command: "repeat" | "go_back" | "cancel" | "summarize" | "switch_to_typing") => void;
  onSwitchToTyping: () => void;
  isRecording?: boolean;
  isSpeaking?: boolean;
}

/**
 * VoiceControls - Control panel for voice interaction
 * Mic toggle, text input fallback, global commands
 */
export const VoiceControls = ({
  uiState,
  isTypingMode,
  textInput,
  onTextInputChange,
  onTextSubmit,
  onMicToggle,
  onGlobalCommand,
  onSwitchToTyping,
  isRecording = false,
  isSpeaking = false,
}: VoiceControlsProps) => {
  const isListening = uiState === UIState.LISTENING || isRecording;
  // CRITICAL: Mic MUST be disabled in confirmation state
  const canUseMic =
    uiState !== UIState.CONFIRMATION_REQUIRED &&
    (uiState === UIState.IDLE ||
      uiState === UIState.AWAITING_INPUT ||
      uiState === UIState.ERROR ||
      uiState === UIState.LISTENING) &&
    !isSpeaking;
  const showTextInput = isTypingMode || uiState === UIState.AWAITING_INPUT;

  return (
    <div className="voice-controls">
      {showTextInput && (
        <form onSubmit={onTextSubmit} className="voice-controls__text-input-form">
          <input
            type="text"
            value={textInput}
            onChange={(e) => onTextInputChange(e.target.value)}
            placeholder="Type your message..."
            className="voice-controls__text-input"
            autoFocus
            disabled={uiState === UIState.THINKING || uiState === UIState.SPEAKING}
          />
          <button
            type="submit"
            disabled={!textInput.trim() || uiState === UIState.THINKING || uiState === UIState.SPEAKING}
            className="voice-controls__text-submit"
          >
            Send
          </button>
        </form>
      )}

      <div className="voice-controls__primary">
        <button
          type="button"
          onClick={onMicToggle}
          disabled={!canUseMic}
          className={`voice-controls__mic ${isListening ? "voice-controls__mic--active" : ""}`}
          aria-label={isListening ? "Stop listening" : "Start listening"}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            {isListening ? (
              <rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" />
            ) : (
              <>
                <path
                  d="M12 1C10.34 1 9 2.34 9 4V12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12V4C15 2.34 13.66 1 12 1Z"
                  fill="currentColor"
                />
                <path
                  d="M19 10V12C19 15.87 15.87 19 12 19C8.13 19 5 15.87 5 12V10H3V12C3 16.97 7.03 21 12 21C16.97 21 21 16.97 21 12V10H19Z"
                  fill="currentColor"
                />
              </>
            )}
          </svg>
        </button>
      </div>

      <div className="voice-controls__secondary">
        <button
          type="button"
          onClick={() => onGlobalCommand("repeat")}
          disabled={uiState === UIState.IDLE || uiState === UIState.THINKING}
          className="voice-controls__command"
          title="Repeat last message"
        >
          Repeat
        </button>
        <button
          type="button"
          onClick={() => onGlobalCommand("go_back")}
          disabled={uiState === UIState.IDLE || uiState === UIState.THINKING}
          className="voice-controls__command"
          title="Go back"
        >
          Go Back
        </button>
        <button
          type="button"
          onClick={() => onGlobalCommand("cancel")}
          disabled={uiState === UIState.IDLE || uiState === UIState.THINKING}
          className="voice-controls__command"
          title="Cancel"
        >
          Cancel
        </button>
        {!isTypingMode && (
          <button
            type="button"
            onClick={onSwitchToTyping}
            className="voice-controls__command"
            title="Switch to typing"
          >
            Type
          </button>
        )}
      </div>
    </div>
  );
};
