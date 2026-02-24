import { useState, useEffect } from "react";
import { ParticipantState, initialState } from "../agent/participantState";
import { handleUserInput } from "../agent/conversationController";
import { generateSystemMessage } from "../agent/messageGenerator";

type Message = {
  role: "system" | "user";
  text: string;
};

export default function Chat() {
  const [state, setState] = useState<ParticipantState>(initialState);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Generate initial GREETING message on mount
  useEffect(() => {
    const loadInitialMessage = async () => {
      setIsLoading(true);
      try {
        const message = await generateSystemMessage("GREETING");
        setMessages([{ role: "system", text: message }]);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to load initial message";
        setMessages([{ role: "system", text: `Error: ${errorMessage}` }]);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialMessage();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || isLoading) {
      return;
    }

    // Normalize enum-like inputs to lowercase before processing
    let normalizedInput = trimmedInput;
    if (
      state.currentStep === "CONTRIBUTION_TYPE" ||
      state.currentStep === "INVESTMENT_MODE"
    ) {
      normalizedInput = trimmedInput.toLowerCase();
    }

    // Append user message
    const userMessage: Message = { role: "user", text: trimmedInput };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Call handleUserInput
      const result = handleUserInput(state, normalizedInput);

      if (result.error) {
        // Append fallback system message when validation fails
        setMessages((prev) => [
          ...prev,
          { role: "system", text: "I didn't understand that. Please try again." },
        ]);
        setIsLoading(false);
        return;
      }

      // Update state
      setState(result.updatedState);

      // Generate next system message
      const nextMessage = await generateSystemMessage(
        result.updatedState.currentStep
      );
      setMessages((prev) => [
        ...prev,
        { role: "system", text: nextMessage },
      ]);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to process input";
      setMessages((prev) => [
        ...prev,
        { role: "system", text: `Error: ${errorMessage}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "var(--surface-1)", color: "var(--text-primary)" }}>
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              alignSelf: message.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "70%",
              padding: "0.5rem 1rem",
              borderRadius: "0.5rem",
              backgroundColor:
                message.role === "user" ? "rgb(var(--color-primary-rgb) / 0.1)" : "var(--surface-2)",
            }}
          >
            {message.text}
          </div>
        ))}
        {isLoading && (
          <div
            style={{
              alignSelf: "flex-start",
              padding: "0.5rem 1rem",
              color: "var(--text-secondary)",
            }}
          >
            Loading...
          </div>
        )}
      </div>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          padding: "1rem",
          borderTop: "1px solid var(--border-subtle)",
        }}
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
          style={{
            flex: 1,
            padding: "0.5rem",
            borderRadius: "0.25rem",
            border: "1px solid var(--border-subtle)",
            background: "var(--surface-1)",
            color: "var(--text-primary)",
            marginRight: "0.5rem",
          }}
        />
        <button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "0.25rem",
            border: "none",
            backgroundColor: "var(--brand-primary)",
            color: "var(--color-text-inverse)",
            cursor: isLoading || !inputValue.trim() ? "not-allowed" : "pointer",
            opacity: isLoading || !inputValue.trim() ? 0.5 : 1,
          }}
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}
