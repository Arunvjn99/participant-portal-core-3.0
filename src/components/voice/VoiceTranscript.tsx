import { useEffect, useRef } from "react";
import { UIState, type VoiceMessage } from "@/types/voice";

interface VoiceTranscriptProps {
  messages: VoiceMessage[];
  uiState: UIState;
  onQuickReply: (reply: string) => void;
}

/**
 * VoiceTranscript - Displays conversation history
 * Shows agent and user messages with quick replies
 */
export const VoiceTranscript = ({ messages, uiState, onQuickReply }: VoiceTranscriptProps) => {
  const transcriptRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [messages]);

  if (messages.length === 0 && uiState === UIState.IDLE) {
    return (
      <div className="voice-transcript voice-transcript--empty">
        <p className="voice-transcript__empty-text">
          Click the microphone to start. You can ask about enrollment, loans, or get help with your account.
        </p>
      </div>
    );
  }

  return (
    <div ref={transcriptRef} className="voice-transcript">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`voice-transcript__message voice-transcript__message--${message.type}`}
        >
          <div className="voice-transcript__message-content">
            <p className="voice-transcript__message-text">{message.text}</p>
            {message.type === "agent" && message.quickReplies && message.quickReplies.length > 0 && (
              <div className="voice-transcript__quick-replies">
                {message.quickReplies.map((reply, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onQuickReply(reply)}
                    className="voice-transcript__quick-reply"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}
          </div>
          <span className="voice-transcript__message-time">
            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
      ))}
      {uiState === UIState.THINKING && (
        <div className="voice-transcript__message voice-transcript__message--agent">
          <div className="voice-transcript__message-content">
            <div className="voice-transcript__thinking">
              <span className="voice-transcript__thinking-dot" />
              <span className="voice-transcript__thinking-dot" style={{ animationDelay: "0.2s" }} />
              <span className="voice-transcript__thinking-dot" style={{ animationDelay: "0.4s" }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
