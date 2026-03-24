import { UIState, AgentState } from "@/types/voice";

interface VoiceOrbProps {
  uiState: UIState;
  agentState: AgentState;
}

/**
 * VoiceOrb - Visual state indicator
 * Changes appearance based on UI state
 */
export const VoiceOrb = ({ uiState, agentState }: VoiceOrbProps) => {
  const getOrbClass = () => {
    const baseClass = "voice-orb";
    const stateClass = `voice-orb--${uiState.toLowerCase()}`;
    return `${baseClass} ${stateClass}`;
  };

  const getOrbIcon = () => {
    switch (uiState) {
      case UIState.LISTENING:
        return (
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 1C10.34 1 9 2.34 9 4V12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12V4C15 2.34 13.66 1 12 1Z"
              fill="currentColor"
            />
            <path
              d="M19 10V12C19 15.87 15.87 19 12 19C8.13 19 5 15.87 5 12V10H3V12C3 16.97 7.03 21 12 21C16.97 21 21 16.97 21 12V10H19Z"
              fill="currentColor"
            />
          </svg>
        );
      case UIState.THINKING:
        return (
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
            <circle cx="8" cy="12" r="1.5" fill="currentColor" className="voice-orb__pulse" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" className="voice-orb__pulse" style={{ animationDelay: "0.2s" }} />
            <circle cx="16" cy="12" r="1.5" fill="currentColor" className="voice-orb__pulse" style={{ animationDelay: "0.4s" }} />
          </svg>
        );
      case UIState.SPEAKING:
        return (
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M3 9V15H7L12 20V4L7 9H3Z"
              fill="currentColor"
            />
            <path
              d="M16.5 12C16.5 10.23 15.5 8.71 14 7.97V16.03C15.5 15.29 16.5 13.77 16.5 12Z"
              fill="currentColor"
            />
            <path
              d="M19 8.5C19 6.07 16.39 4 13.25 4V5.5C15.64 5.5 17.5 7.05 17.5 9C17.5 10.95 15.64 12.5 13.25 12.5V14C16.39 14 19 11.93 19 9.5V8.5Z"
              fill="currentColor"
            />
          </svg>
        );
      case UIState.ERROR:
        return (
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M12 8V12M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      case UIState.COMPLETED:
        return (
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      default:
        return (
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
            <circle cx="12" cy="12" r="3" fill="currentColor" />
          </svg>
        );
    }
  };

  return (
    <div className={getOrbClass()}>
      <div className="voice-orb__inner">{getOrbIcon()}</div>
      {uiState === UIState.LISTENING && (
        <div className="voice-orb__ripple voice-orb__ripple--1" />
      )}
      {uiState === UIState.LISTENING && (
        <div className="voice-orb__ripple voice-orb__ripple--2" />
      )}
    </div>
  );
};
