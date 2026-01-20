import { UIState, AgentState, TaskType, type VoiceState } from "../types/voice";

interface AgentResponse {
  text: string;
  uiState: UIState;
  agentState: AgentState;
  currentTask?: TaskType | null;
  quickReplies?: string[];
  confirmationPhrase?: string;
  errorMessage?: string;
}

/**
 * Voice Agent - Mock agent logic for voice interactions
 * Handles intent detection, task management, and state transitions
 */
class VoiceAgent {
  /**
   * Process user input and generate agent response
   */
  async processInput(input: string, currentState: VoiceState): Promise<AgentResponse> {
    const lowerInput = input.toLowerCase().trim();

    // Handle global commands first
    if (this.isGlobalCommand(lowerInput)) {
      return this.handleGlobalCommand(lowerInput, currentState);
    }

    // Handle confirmation states
    if (currentState.uiState === UIState.CONFIRMATION_REQUIRED) {
      return this.handleConfirmation(input, currentState);
    }

    // Detect task intent
    const taskType = this.detectTaskType(lowerInput);

    // Handle task-specific logic
    if (taskType) {
      return this.handleTaskStart(taskType, currentState);
    }

    // Handle task in progress
    if (currentState.currentTask) {
      return this.handleTaskProgress(input, currentState);
    }

    // Default: General Q&A
    return this.handleGeneralQA(input, currentState);
  }

  private isGlobalCommand(input: string): boolean {
    const commands = ["repeat", "go back", "cancel", "summarize", "switch to typing"];
    return commands.some((cmd) => input.includes(cmd));
  }

  private handleGlobalCommand(input: string, state: VoiceState): AgentResponse {
    if (input.includes("repeat")) {
      const lastAgentMessage = [...state.messages]
        .reverse()
        .find((m) => m.type === "agent");
      return {
        text: lastAgentMessage?.text || "I didn't catch that. How can I help?",
        uiState: UIState.SPEAKING,
        agentState: state.agentState,
        currentTask: state.currentTask,
        quickReplies: ["Continue", "Go back", "Cancel"],
      };
    }

    if (input.includes("go back")) {
      return {
        text: "Going back to the previous step.",
        uiState: UIState.SPEAKING,
        agentState: AgentState.TASK_SELECTION,
        currentTask: null,
        quickReplies: ["Start over", "Cancel"],
      };
    }

    if (input.includes("cancel")) {
      return {
        text: "Cancelled. How can I help you?",
        uiState: UIState.IDLE,
        agentState: AgentState.IDLE,
        currentTask: null,
      };
    }

    if (input.includes("summarize")) {
      return {
        text: this.generateSummary(state),
        uiState: UIState.SPEAKING,
        agentState: state.agentState,
        currentTask: state.currentTask,
      };
    }

    return {
      text: "I can help with enrollment, loans, or general questions. What would you like to do?",
      uiState: UIState.AWAITING_INPUT,
      agentState: AgentState.TASK_SELECTION,
    };
  }

  private detectTaskType(input: string): TaskType | null {
    if (input.includes("enroll") || input.includes("enrollment")) {
      return TaskType.ENROLLMENT;
    }
    if (input.includes("loan") || input.includes("borrow")) {
      return TaskType.LOAN;
    }
    if (input.includes("help") || input.includes("question") || input.includes("how")) {
      return TaskType.POST_ENROLLMENT_HELP;
    }
    return null;
  }

  private handleTaskStart(taskType: TaskType, state: VoiceState): AgentResponse {
    switch (taskType) {
      case TaskType.ENROLLMENT:
        return {
          text: "I can help you with enrollment. Are you looking to enroll in a new plan or modify your existing enrollment?",
          uiState: UIState.AWAITING_INPUT,
          agentState: AgentState.TASK_SELECTION,
          currentTask: TaskType.ENROLLMENT,
          quickReplies: ["New enrollment", "Modify enrollment", "Cancel"],
        };

      case TaskType.LOAN:
        return {
          text: "I can help you with a loan. Would you like to check your eligibility, apply for a loan, or get information about loan terms?",
          uiState: UIState.AWAITING_INPUT,
          agentState: AgentState.TASK_SELECTION,
          currentTask: TaskType.LOAN,
          quickReplies: ["Check eligibility", "Apply for loan", "Loan information", "Cancel"],
        };

      case TaskType.POST_ENROLLMENT_HELP:
        return {
          text: "I can help answer questions about your account, contributions, investments, or beneficiaries. What would you like to know?",
          uiState: UIState.AWAITING_INPUT,
          agentState: AgentState.TASK_SELECTION,
          currentTask: TaskType.POST_ENROLLMENT_HELP,
          quickReplies: ["Contributions", "Investments", "Beneficiaries", "Cancel"],
        };

      default:
        return {
          text: "I can help with enrollment, loans, or general questions. What would you like to do?",
          uiState: UIState.AWAITING_INPUT,
          agentState: AgentState.TASK_SELECTION,
        };
    }
  }

  private handleTaskProgress(input: string, state: VoiceState): AgentResponse {
    if (!state.currentTask) {
      return this.handleGeneralQA(input, state);
    }

    // Check for completion intent
    if (input.includes("submit") || input.includes("confirm") || input.includes("complete")) {
      return this.handleTaskCompletion(state);
    }

    // Continue task flow
    switch (state.currentTask) {
      case TaskType.ENROLLMENT:
        return {
          text: "I'll guide you through the enrollment process. Let me take you to the enrollment page where you can complete this.",
          uiState: UIState.CONFIRMATION_REQUIRED,
          agentState: AgentState.CONFIRMATION,
          currentTask: TaskType.ENROLLMENT,
          confirmationPhrase: "Navigate to enrollment page",
          quickReplies: ["Yes, take me there", "No, cancel"],
        };

      case TaskType.LOAN:
        return {
          text: "I can help you start a loan application. This will take you to the loan application form. Would you like to proceed?",
          uiState: UIState.CONFIRMATION_REQUIRED,
          agentState: AgentState.CONFIRMATION,
          currentTask: TaskType.LOAN,
          confirmationPhrase: "Start loan application",
          quickReplies: ["Yes, start application", "No, cancel"],
        };

      case TaskType.POST_ENROLLMENT_HELP:
        return {
          text: this.answerPostEnrollmentQuestion(input),
          uiState: UIState.SPEAKING,
          agentState: AgentState.TASK_IN_PROGRESS,
          currentTask: TaskType.POST_ENROLLMENT_HELP,
          quickReplies: ["More help", "Done"],
        };

      default:
        return {
          text: "I'm here to help. What would you like to know?",
          uiState: UIState.AWAITING_INPUT,
          agentState: AgentState.TASK_IN_PROGRESS,
          currentTask: state.currentTask,
        };
    }
  }

  private handleTaskCompletion(state: VoiceState): AgentResponse {
    return {
      text: "I understand you want to complete this action. For security, I'll need to take you to the appropriate page where you can review and confirm. Is that okay?",
      uiState: UIState.CONFIRMATION_REQUIRED,
      agentState: AgentState.CONFIRMATION,
      currentTask: state.currentTask,
      confirmationPhrase: "Navigate to confirmation page",
      quickReplies: ["Yes", "No, cancel"],
    };
  }

  private handleConfirmation(input: string, state: VoiceState): AgentResponse {
    const lowerInput = input.toLowerCase();
    const confirmed = lowerInput.includes("yes") || lowerInput.includes("confirm") || lowerInput.includes("proceed");

    if (confirmed) {
      return {
        text: "I'll navigate you to the appropriate page now. You can complete the action there.",
        uiState: UIState.COMPLETED,
        agentState: AgentState.COMPLETED,
        currentTask: state.currentTask,
        quickReplies: ["Exit voice mode", "Stay here"],
      };
    }

    return {
      text: "Understood. I've cancelled that action. How else can I help?",
      uiState: UIState.IDLE,
      agentState: AgentState.IDLE,
      currentTask: null,
    };
  }

  private handleGeneralQA(input: string, state: VoiceState): AgentResponse {
    // Simple keyword-based responses for mock
    if (input.includes("contribution") || input.includes("contribute")) {
      return {
        text: "Your contributions are the amount you save from each paycheck. You can view and manage your contribution settings in the Enrollment section. Would you like me to take you there?",
        uiState: UIState.SPEAKING,
        agentState: AgentState.TASK_IN_PROGRESS,
        quickReplies: ["Yes, take me there", "No, thanks"],
      };
    }

    if (input.includes("investment") || input.includes("portfolio")) {
      return {
        text: "Your investment allocation determines how your contributions are invested. You can view and manage your investments in the Investments section. Would you like me to take you there?",
        uiState: UIState.SPEAKING,
        agentState: AgentState.TASK_IN_PROGRESS,
        quickReplies: ["Yes, take me there", "No, thanks"],
      };
    }

    if (input.includes("beneficiary") || input.includes("beneficiaries")) {
      return {
        text: "Beneficiaries are the people who will receive your retirement plan benefits. You can manage beneficiaries in your Profile. Would you like me to take you there?",
        uiState: UIState.SPEAKING,
        agentState: AgentState.TASK_IN_PROGRESS,
        quickReplies: ["Yes, take me there", "No, thanks"],
      };
    }

    return {
      text: "I can help you with enrollment, loans, contributions, investments, or beneficiaries. What would you like to know?",
      uiState: UIState.AWAITING_INPUT,
      agentState: AgentState.TASK_SELECTION,
      quickReplies: ["Enrollment", "Loan", "Contributions", "Investments"],
    };
  }

  private answerPostEnrollmentQuestion(input: string): string {
    if (input.includes("contribution")) {
      return "Your contributions are deducted from each paycheck. You can change your contribution amount or source allocation anytime in the Enrollment section.";
    }
    if (input.includes("investment")) {
      return "Your investments are allocated across different funds based on your strategy. You can view and adjust your allocation in the Investments section.";
    }
    if (input.includes("beneficiary")) {
      return "Your beneficiaries are designated in your Profile. You can add, remove, or update beneficiaries at any time.";
    }
    return "I can help answer questions about your account. What specifically would you like to know?";
  }

  private generateSummary(state: VoiceState): string {
    if (state.currentTask) {
      return `We're working on ${state.currentTask.toLowerCase().replace("_", " ")}. ${state.messages.length} messages exchanged.`;
    }
    return `We've exchanged ${state.messages.length} messages. How can I help you?`;
  }
}

/**
 * Factory function to create VoiceAgent instance
 * Must be called inside React component/hook to avoid module-scope initialization
 */
export function createVoiceAgent(): VoiceAgent {
  return new VoiceAgent();
}
