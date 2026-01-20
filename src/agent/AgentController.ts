/**
 * AgentController
 * Central controller for agent state and logic
 * NEVER touches UI or audio directly
 */

import { AgentState as GlobalAgentState, TaskType } from "../types/voice";
import type { AgentState, AgentResponse, Intent, RequiredInput } from "./agentTypes";
import { classifyIntent, extractNumber, extractYesNo } from "./intentClassifier";
import { getTaskSteps, getFirstStep } from "./taskDefinitions";

/**
 * AgentController - Manages agent state and logic
 */
export class AgentController {
  private state: AgentState;

  constructor() {
    this.state = {
      agentState: GlobalAgentState.IDLE,
      currentTask: null,
      currentStep: null,
      requiredInput: "NONE",
      collectedData: {},
      lastAgentMessage: null,
      taskHistory: [],
    };
  }

  /**
   * Get current agent state
   */
  getState(): AgentState {
    return { ...this.state };
  }

  /**
   * Handle user input (transcript)
   */
  handleUserInput(transcript: string): AgentResponse {
    // Handle silence / no input
    if (!transcript || transcript.trim().length === 0) {
      if (this.state.currentTask && this.state.currentStep) {
        // Inside a task - provide context-aware help
        return {
          text: "I didn't catch that. You can repeat your answer, say 'go back' to return to the previous step, or say 'cancel' to exit. What would you like to do?",
          uiStateHint: "AWAITING_INPUT",
          requiresConfirmation: false,
          quickReplies: ["Repeat", "Go back", "Cancel"],
        };
      }
      return {
        text: "I didn't catch that. Could you please repeat?",
        uiStateHint: "AWAITING_INPUT",
        requiresConfirmation: false,
      };
    }
    
    // Check for unclear/unintelligible input (very short or only punctuation)
    const trimmed = transcript.trim();
    if (trimmed.length < 2 || /^[^\w\s]+$/.test(trimmed)) {
      if (this.state.currentTask && this.state.currentStep) {
        return {
          text: "I didn't understand that. Please provide a clear answer, or say 'go back' or 'cancel' if you need help.",
          uiStateHint: "AWAITING_INPUT",
          requiresConfirmation: false,
          quickReplies: ["Go back", "Cancel"],
        };
      }
      return {
        text: "I didn't understand that. Could you please repeat?",
        uiStateHint: "AWAITING_INPUT",
        requiresConfirmation: false,
      };
    }

    // Classify intent
    const intent = classifyIntent(transcript, {
      requiredInput: this.state.requiredInput,
      currentTask: this.state.currentTask,
    });

    // Handle global commands first
    if (intent === "CANCEL") {
      return this.handleCancel();
    }

    if (intent === "GO_BACK") {
      return this.handleGoBack();
    }

    if (intent === "REPEAT") {
      return this.handleRepeat();
    }

    // Handle task-specific intents
    if (this.state.currentTask === null) {
      // No active task - handle task start or general question
      if (intent === "START_LOAN") {
        return this.startTask(TaskType.LOAN);
      }
      if (intent === "START_ENROLLMENT") {
        return this.startTask(TaskType.ENROLLMENT);
      }
      if (intent === "GENERAL_QUESTION") {
        return this.handleGeneralQuestion(transcript);
      }
      return this.createErrorResponse("I can help you with enrollment, loans, or general questions. What would you like to do?");
    }

    // Task is active - handle task progression
    
    // Check for mid-flow change requests (user wants to modify something)
    if (this.detectChangeRequest(transcript)) {
      return this.handleChangeRequest(transcript);
    }
    
    if (intent === "ANSWER_INPUT") {
      return this.handleAnswerInput(transcript);
    }

    if (intent === "CONFIRM" && this.state.requiredInput === "CONFIRMATION") {
      return this.handleConfirmation(transcript);
    }

    // Unknown or invalid intent
    return this.createClarificationResponse();
  }

  /**
   * Start a new task - ensures re-entry safety (fresh start)
   */
  private startTask(taskType: TaskType): AgentResponse {
    if (this.state.currentTask !== null) {
      return this.createErrorResponse("A task is already in progress. Please cancel it first.");
    }

    const firstStep = getFirstStep(taskType);
    if (!firstStep) {
      return this.createErrorResponse("Unable to start this task. Please try again.");
    }

    // Complete reset for re-entry safety - no reused data from previous attempts
    this.state = {
      agentState: GlobalAgentState.TASK_IN_PROGRESS,
      currentTask: taskType,
      currentStep: firstStep,
      requiredInput: "NONE",
      collectedData: {}, // Fresh data - no reuse
      lastAgentMessage: null,
      taskHistory: [], // Initialize empty - first step will be added when we advance
    };

    return this.processCurrentStep();
  }

  /**
   * Process current step and return response
   */
  private processCurrentStep(): AgentResponse {
    if (!this.state.currentTask || !this.state.currentStep) {
      return this.createErrorResponse("No active task or step.");
    }

    const steps = getTaskSteps(this.state.currentTask);
    const step = steps[this.state.currentStep];

    if (!step) {
      return this.createErrorResponse("Invalid step in task.");
    }

    const prompt = step.getPrompt(this.state.collectedData);
    this.state.lastAgentMessage = prompt;
    this.state.requiredInput = step.requiredInput;

    // Determine next step
    const nextStep = step.getNextStep ? step.getNextStep(this.state.collectedData) : null;

    // Check if task is complete
    if (nextStep === null && this.state.requiredInput === "CONFIRMATION") {
      // Waiting for final confirmation
      return {
        text: prompt,
        uiStateHint: "CONFIRMATION_REQUIRED",
        requiresConfirmation: true,
        confirmationPhrase: "yes, submit loan",
        quickReplies: ["Yes, submit loan", "Cancel"],
      };
    }

    if (nextStep === null && this.state.requiredInput === "NONE") {
      // Task complete
      this.state.agentState = GlobalAgentState.COMPLETED;
      return {
        text: prompt,
        uiStateHint: "COMPLETED",
        requiresConfirmation: false,
        quickReplies: ["Exit voice mode", "Start new task"],
      };
    }

    return {
      text: prompt,
      uiStateHint: this.state.requiredInput === "NONE" ? "SPEAKING" : "AWAITING_INPUT",
      requiresConfirmation: false,
      quickReplies: this.getQuickRepliesForStep(),
    };
  }

  /**
   * Handle answer input
   */
  private handleAnswerInput(transcript: string): AgentResponse {
    if (!this.state.currentStep || !this.state.currentTask) {
      return this.createErrorResponse("No active step to process input.");
    }

    const steps = getTaskSteps(this.state.currentTask);
    const step = steps[this.state.currentStep];

    if (!step) {
      return this.createErrorResponse("Invalid step.");
    }

    // Extract and validate input based on required input type
    let inputValue: unknown = null;
    let isValid = false;
    let validationErrorType: string | null = null;

    if (this.state.requiredInput === "NUMBER") {
      const number = extractNumber(transcript);
      if (number === null) {
        // Check for ambiguous phrases
        const lowerTranscript = transcript.toLowerCase().trim();
        const ambiguousPhrases = ["around", "about", "approximately", "maybe", "perhaps", "roughly", "somewhere"];
        if (ambiguousPhrases.some(phrase => lowerTranscript.includes(phrase))) {
          validationErrorType = "ambiguous";
        } else {
          validationErrorType = "invalid";
        }
      } else {
        inputValue = number;
        
        // PART 3 & 4: Fix fallback behavior - validate loan amount without resetting step
        if (this.state.currentStep === "LOAN_AMOUNT") {
          if (number <= 0) {
            validationErrorType = "zero_or_negative";
          } else if (number > 50000) {
            validationErrorType = "over_max";
          } else if (number > (100000 * 0.5)) {
            validationErrorType = "over_balance";
          } else {
            // Number is valid - validate through step validation
            isValid = step.validateInput ? step.validateInput(transcript, this.state.collectedData) : true;
            // PART 2: If parsed successfully, confirm the amount (don't re-run eligibility)
            // This is already handled by staying in LOAN_AMOUNT step
          }
        } else if (this.state.currentStep === "LOAN_TERM") {
          const lowerTranscript = transcript.toLowerCase().trim();
          if (lowerTranscript.includes("month") || lowerTranscript.includes("mo")) {
            validationErrorType = "months";
          } else if (number < 1 || number > 5 || number % 1 !== 0) {
            validationErrorType = "out_of_range";
          } else {
            isValid = step.validateInput ? step.validateInput(transcript, this.state.collectedData) : true;
          }
        } else if (this.state.currentStep === "CONTRIBUTION") {
          // Enrollment contribution validation
          const lowerTranscript = transcript.toLowerCase().trim();
          const ambiguousPhrases = ["around", "about", "approximately", "maybe", "perhaps", "roughly", "somewhere", "suggest", "recommend", "advise"];
          if (ambiguousPhrases.some(phrase => lowerTranscript.includes(phrase))) {
            validationErrorType = "ambiguous";
          } else if (number < 1 || number > 100) {
            validationErrorType = "out_of_range";
          } else {
            isValid = step.validateInput ? step.validateInput(transcript, this.state.collectedData) : true;
          }
        } else {
          isValid = step.validateInput ? step.validateInput(transcript, this.state.collectedData) : true;
        }
      }
    } else if (this.state.requiredInput === "YES_NO") {
      const yesNo = extractYesNo(transcript);
      if (yesNo !== null) {
        inputValue = yesNo;
        isValid = true;
      } else {
        validationErrorType = "invalid";
      }
    } else if (this.state.requiredInput === "TEXT" || this.state.requiredInput === "CONFIRMATION") {
      inputValue = transcript;
      
      // Special handling for enrollment plan selection
      if (this.state.currentStep === "PLAN_SELECTION") {
        isValid = step.validateInput ? step.validateInput(transcript, this.state.collectedData) : true;
        if (isValid) {
          // Extract and normalize plan ID
          inputValue = this.extractPlanId(transcript);
        } else {
          validationErrorType = "invalid";
        }
      } else if (this.state.currentStep === "INVESTMENTS") {
        isValid = step.validateInput ? step.validateInput(transcript, this.state.collectedData) : true;
        if (isValid) {
          // Normalize investment approach
          inputValue = this.extractInvestmentApproach(transcript);
          
          // Check if user said "continue" after manual allocation
          const lowerTranscript = transcript.toLowerCase().trim();
          if (lowerTranscript.includes("continue") && inputValue === "manual_allocation") {
            this.state.collectedData.manualAllocationComplete = true;
          }
        } else {
          validationErrorType = "invalid";
        }
      } else {
        isValid = step.validateInput ? step.validateInput(transcript, this.state.collectedData) : true;
        if (!isValid && this.state.requiredInput === "CONFIRMATION") {
          validationErrorType = "invalid";
        }
      }
    }

    // If validation failed, store error type and return clarification
    if (!isValid || inputValue === null) {
      if (validationErrorType) {
        // Store error type for step-specific error messages
        const errorKey = `_${this.state.currentStep.toLowerCase()}Error`;
        this.state.collectedData[errorKey] = validationErrorType;
      }
      return this.createClarificationResponse();
    }

    // Validation passed - clear any previous error for this step
    const errorKey = `_${this.state.currentStep.toLowerCase()}Error`;
    delete this.state.collectedData[errorKey];

    // Store collected data
    const dataKey = this.getDataKeyForStep(this.state.currentStep);
    this.state.collectedData[dataKey] = inputValue;

    // Check if user declined (for YES_NO inputs)
    if (this.state.requiredInput === "YES_NO" && inputValue === false) {
      // User declined - cancel task
      this.state.agentState = GlobalAgentState.CANCELLED;
      this.state.currentTask = null;
      this.state.currentStep = null;
      this.state.requiredInput = "NONE";
      return {
        text: "Loan application cancelled. Is there anything else I can help you with?",
        uiStateHint: "IDLE",
        requiresConfirmation: false,
      };
    }

    // Move to next step
    const nextStep = step.getNextStep ? step.getNextStep(this.state.collectedData) : null;

    if (nextStep) {
      // Push current step to history BEFORE moving to next step
      if (this.state.currentStep) {
        this.state.taskHistory.push(this.state.currentStep);
      }
      this.state.currentStep = nextStep;
      return this.processCurrentStep();
    }

    // No next step - task may be complete
    this.state.agentState = GlobalAgentState.COMPLETED;
    return this.processCurrentStep();
  }

  /**
   * Handle confirmation - strict validation required
   */
  private handleConfirmation(transcript: string): AgentResponse {
    if (this.state.currentTask === TaskType.LOAN && this.state.currentStep === "CONFIRM_SUBMIT") {
      // Strict confirmation gate: Only accept exact phrases
      const lowerTranscript = transcript.toLowerCase().trim();
      const exactPhrases = [
        "yes, submit loan",
        "confirm loan application",
        "yes submit loan",
        "confirm loan",
      ];
      
      const isValidConfirmation = exactPhrases.some(phrase => 
        lowerTranscript === phrase || lowerTranscript.includes(phrase)
      );
      
      if (!isValidConfirmation) {
        // Store error and return clarification
        this.state.collectedData._confirmationError = true;
        return this.createClarificationResponse();
      }
      
      // Loan submission confirmed - strict validation passed
      this.state.agentState = GlobalAgentState.COMPLETED;
      return {
        text: "Your loan application has been submitted. You'll receive a confirmation email shortly. Is there anything else I can help you with?",
        uiStateHint: "COMPLETED",
        requiresConfirmation: false,
        quickReplies: ["Exit voice mode", "Start new task"],
      };
    }

    if (this.state.currentTask === TaskType.ENROLLMENT && this.state.currentStep === "CONFIRM_SUBMIT") {
      // Strict confirmation gate for enrollment: Only accept exact phrases
      const lowerTranscript = transcript.toLowerCase().trim();
      const exactPhrases = [
        "yes, submit enrollment",
        "confirm enrollment",
        "yes submit enrollment",
        "submit enrollment",
      ];
      
      const isValidConfirmation = exactPhrases.some(phrase => 
        lowerTranscript === phrase || lowerTranscript.includes(phrase)
      );
      
      if (!isValidConfirmation) {
        // Store error and return clarification
        this.state.collectedData._confirmationError = true;
        return this.createClarificationResponse();
      }
      
      // Enrollment submission confirmed - strict validation passed (mock submission)
      this.state.agentState = GlobalAgentState.COMPLETED;
      return {
        text: "Your enrollment has been submitted. You'll receive a confirmation email shortly. Is there anything else I can help you with?",
        uiStateHint: "COMPLETED",
        requiresConfirmation: false,
        quickReplies: ["Exit voice mode", "Start new task"],
      };
    }

    // Generic confirmation handling
    return this.handleAnswerInput(transcript);
  }

  /**
   * Handle cancel - must reset everything completely
   */
  private handleCancel(): AgentResponse {
    // Complete reset: task, step history, and collected data
    this.state = {
      agentState: GlobalAgentState.IDLE,
      currentTask: null,
      currentStep: null,
      requiredInput: "NONE",
      collectedData: {},
      lastAgentMessage: null,
      taskHistory: [],
    };
    return {
      text: "Cancelled. How can I help you?",
      uiStateHint: "IDLE",
      requiresConfirmation: false,
      quickReplies: ["Enrollment", "Loan", "General question"],
    };
  }

  /**
   * Handle go back
   */
  private handleGoBack(): AgentResponse {
    // If agent is NOT inside a task, respond with idle help message
    if (this.state.currentTask === null) {
      return {
        text: "I can help you with enrollment, loans, or general questions. What would you like to do?",
        uiStateHint: "IDLE",
        requiresConfirmation: false,
        quickReplies: ["Enrollment", "Loan", "General question"],
      };
    }

    // If stepHistory has entries, pop the last step and go back
    if (this.state.taskHistory.length > 0) {
      const previousStep = this.state.taskHistory.pop()!;

      // Remove data collected in current step
      const currentDataKey = this.getDataKeyForStep(this.state.currentStep || "");
      delete this.state.collectedData[currentDataKey];

      this.state.currentStep = previousStep;
      return this.processCurrentStep();
    }

    // If stepHistory is empty but task exists, we're at the first step
    // Reset to entry step and ask if user wants to continue
    const firstStep = getFirstStep(this.state.currentTask);
    if (firstStep) {
      // Do NOT clear collected data - preserve it per requirements
      this.state.currentStep = firstStep;
      const steps = getTaskSteps(this.state.currentTask);
      const step = steps[firstStep];
      
      if (step) {
        const prompt = step.getPrompt(this.state.collectedData);
        this.state.lastAgentMessage = prompt;
        this.state.requiredInput = step.requiredInput;
        
        // We're at the first step - ask if they want to continue
        return {
          text: `Okay, going back. ${prompt} Would you like to continue?`,
          uiStateHint: "AWAITING_INPUT",
          requiresConfirmation: false,
          quickReplies: ["Yes, continue", "Cancel"],
        };
      }
    }

    // Fallback - should not happen
    return this.createErrorResponse("Unable to go back. Please try again.");
  }

  /**
   * Handle repeat
   */
  private handleRepeat(): AgentResponse {
    if (this.state.lastAgentMessage) {
      return {
        text: this.state.lastAgentMessage,
        uiStateHint: "SPEAKING",
        requiresConfirmation: false,
        quickReplies: this.getQuickRepliesForStep(),
      };
    }
    return this.createErrorResponse("Nothing to repeat.");
  }

  /**
   * Handle general question
   */
  private handleGeneralQuestion(transcript: string): AgentResponse {
    const lowerText = transcript.toLowerCase();

    if (lowerText.includes("contribution") || lowerText.includes("contribute")) {
      return {
        text: "Your contributions are the amount you save from each paycheck. You can view and manage your contribution settings in the Enrollment section. Would you like me to take you there?",
        uiStateHint: "SPEAKING",
        requiresConfirmation: false,
        quickReplies: ["Yes, take me there", "No, thanks"],
      };
    }

    if (lowerText.includes("investment") || lowerText.includes("portfolio")) {
      return {
        text: "Your investment allocation determines how your contributions are invested. You can view and manage your investments in the Investments section. Would you like me to take you there?",
        uiStateHint: "SPEAKING",
        requiresConfirmation: false,
        quickReplies: ["Yes, take me there", "No, thanks"],
      };
    }

    if (lowerText.includes("beneficiary") || lowerText.includes("beneficiaries")) {
      return {
        text: "Beneficiaries are the people who will receive your retirement plan benefits. You can manage beneficiaries in your Profile. Would you like me to take you there?",
        uiStateHint: "SPEAKING",
        requiresConfirmation: false,
        quickReplies: ["Yes, take me there", "No, thanks"],
      };
    }

    return {
      text: "I can help you with enrollment, loans, contributions, investments, or beneficiaries. What would you like to know?",
      uiStateHint: "AWAITING_INPUT",
      requiresConfirmation: false,
      quickReplies: ["Enrollment", "Loan", "Contributions", "Investments"],
    };
  }

  /**
   * Extract plan ID from transcript
   */
  private extractPlanId(transcript: string): string {
    const lowerTranscript = transcript.toLowerCase().trim();
    
    if (lowerTranscript.includes("traditional 401k") || lowerTranscript.includes("traditional")) {
      return "traditional_401k";
    }
    if (lowerTranscript.includes("roth 401k") || (lowerTranscript.includes("roth") && !lowerTranscript.includes("ira"))) {
      return "roth_401k";
    }
    if (lowerTranscript.includes("roth ira") || lowerTranscript.includes("roth ira")) {
      return "roth_ira";
    }
    
    // Fallback - return as-is if it's already a valid ID
    return transcript;
  }

  /**
   * Extract investment approach from transcript
   */
  private extractInvestmentApproach(transcript: string): string {
    const lowerTranscript = transcript.toLowerCase().trim();
    
    if (lowerTranscript.includes("plan default") || lowerTranscript.includes("default")) {
      return "plan_default";
    }
    if (lowerTranscript.includes("manual")) {
      return "manual_allocation";
    }
    if (lowerTranscript.includes("advisor")) {
      return "advisor_managed";
    }
    
    return transcript;
  }

  /**
   * Get data key for step
   */
  private getDataKeyForStep(stepId: string): string {
    const keyMap: Record<string, string> = {
      LOAN_AMOUNT: "loanAmount",
      LOAN_TERM: "loanTerm",
      REPAYMENT_REVIEW: "acceptRepayment",
      PLAN_SELECTION: "selectedPlan",
      CONTRIBUTION: "contributionPercentage",
      INVESTMENTS: "investmentApproach",
    };
    return keyMap[stepId] || stepId.toLowerCase();
  }

  /**
   * Get quick replies for current step
   */
  private getQuickRepliesForStep(): string[] {
    if (this.state.requiredInput === "YES_NO") {
      return ["Yes", "No"];
    }
    if (this.state.requiredInput === "CONFIRMATION") {
      if (this.state.currentTask === TaskType.ENROLLMENT) {
        return ["Yes, submit enrollment", "Cancel"];
      }
      return ["Yes, submit loan", "Cancel"];
    }
    return [];
  }

  /**
   * Create error response
   */
  private createErrorResponse(message: string): AgentResponse {
    return {
      text: message,
      uiStateHint: "ERROR",
      requiresConfirmation: false,
      errorMessage: message,
    };
  }

  /**
   * Create clarification response - uses step-specific error messages
   */
  private createClarificationResponse(): AgentResponse {
    const step = this.state.currentStep
      ? getTaskSteps(this.state.currentTask || "")[this.state.currentStep]
      : null;

    if (step) {
      // Get prompt which will include error messages if validation failed
      const prompt = step.getPrompt(this.state.collectedData);
      
      // Check if prompt contains an error message (from stored error keys)
      // If it does, use it directly; otherwise prepend clarification
      const hasError = Object.keys(this.state.collectedData).some(key => key.startsWith("_") && key.endsWith("Error"));
      
      return {
        text: hasError ? prompt : `I didn't understand that. ${prompt}`,
        uiStateHint: "AWAITING_INPUT",
        requiresConfirmation: false,
        quickReplies: this.getQuickRepliesForStep(),
      };
    }

    return {
      text: "I didn't understand that. Could you please repeat or rephrase?",
      uiStateHint: "AWAITING_INPUT",
      requiresConfirmation: false,
    };
  }

  /**
   * Detect if user wants to change something mid-flow
   */
  private detectChangeRequest(transcript: string): boolean {
    if (!this.state.currentTask || !this.state.currentStep) {
      return false;
    }
    
    const lowerTranscript = transcript.toLowerCase().trim();
    const changePhrases = [
      "change",
      "modify",
      "update",
      "different",
      "instead",
      "actually",
      "want to change",
      "need to change",
    ];
    
    return changePhrases.some(phrase => lowerTranscript.includes(phrase));
  }

  /**
   * Handle mid-flow change request
   */
  private handleChangeRequest(transcript: string): AgentResponse {
    if (!this.state.currentTask || !this.state.currentStep) {
      return this.createClarificationResponse();
    }
    
    // Determine what they want to change
    const lowerTranscript = transcript.toLowerCase().trim();
    
    // Check if they want to change loan amount
    if (lowerTranscript.includes("amount") || lowerTranscript.includes("loan amount")) {
      // Go back to LOAN_AMOUNT step
      const steps = getTaskSteps(this.state.currentTask);
      if (steps["LOAN_AMOUNT"]) {
        // Remove loan amount data
        delete this.state.collectedData.loanAmount;
        // Remove subsequent data that depends on amount
        delete this.state.collectedData.loanTerm;
        delete this.state.collectedData.acceptRepayment;
        
        // Find LOAN_AMOUNT in history or set it directly
        const amountIndex = this.state.taskHistory.indexOf("LOAN_AMOUNT");
        if (amountIndex >= 0) {
          // Truncate history to before LOAN_AMOUNT
          this.state.taskHistory = this.state.taskHistory.slice(0, amountIndex);
        }
        this.state.currentStep = "LOAN_AMOUNT";
        return this.processCurrentStep();
      }
    }
    
    // Check if they want to change loan term
    if (lowerTranscript.includes("term") || lowerTranscript.includes("years") || lowerTranscript.includes("repayment term")) {
      // Go back to LOAN_TERM step
      const steps = getTaskSteps(this.state.currentTask);
      if (steps["LOAN_TERM"]) {
        // Remove loan term data
        delete this.state.collectedData.loanTerm;
        delete this.state.collectedData.acceptRepayment;
        
        // Find LOAN_TERM in history or set it directly
        const termIndex = this.state.taskHistory.indexOf("LOAN_TERM");
        if (termIndex >= 0) {
          // Truncate history to before LOAN_TERM
          this.state.taskHistory = this.state.taskHistory.slice(0, termIndex);
        }
        this.state.currentStep = "LOAN_TERM";
        return this.processCurrentStep();
      }
    }
    
    // Enrollment change requests
    if (this.state.currentTask === TaskType.ENROLLMENT) {
      // Check if they want to change plan
      if (lowerTranscript.includes("plan") && !lowerTranscript.includes("default")) {
        const steps = getTaskSteps(this.state.currentTask);
        if (steps["PLAN_SELECTION"]) {
          // Remove plan and subsequent data
          delete this.state.collectedData.selectedPlan;
          delete this.state.collectedData.contributionPercentage;
          delete this.state.collectedData.investmentApproach;
          
          const planIndex = this.state.taskHistory.indexOf("PLAN_SELECTION");
          if (planIndex >= 0) {
            this.state.taskHistory = this.state.taskHistory.slice(0, planIndex);
          }
          this.state.currentStep = "PLAN_SELECTION";
          return this.processCurrentStep();
        }
      }
      
      // Check if they want to change contribution
      if (lowerTranscript.includes("contribution") || lowerTranscript.includes("percentage")) {
        const steps = getTaskSteps(this.state.currentTask);
        if (steps["CONTRIBUTION"]) {
          // Remove contribution and subsequent data
          delete this.state.collectedData.contributionPercentage;
          delete this.state.collectedData.investmentApproach;
          
          const contributionIndex = this.state.taskHistory.indexOf("CONTRIBUTION");
          if (contributionIndex >= 0) {
            this.state.taskHistory = this.state.taskHistory.slice(0, contributionIndex);
          }
          this.state.currentStep = "CONTRIBUTION";
          return this.processCurrentStep();
        }
      }
      
      // Check if they want to change investments
      if (lowerTranscript.includes("investment") || lowerTranscript.includes("allocation")) {
        const steps = getTaskSteps(this.state.currentTask);
        if (steps["INVESTMENTS"]) {
          // Remove investment data
          delete this.state.collectedData.investmentApproach;
          delete this.state.collectedData.manualAllocationComplete;
          
          const investmentIndex = this.state.taskHistory.indexOf("INVESTMENTS");
          if (investmentIndex >= 0) {
            this.state.taskHistory = this.state.taskHistory.slice(0, investmentIndex);
          }
          this.state.currentStep = "INVESTMENTS";
          return this.processCurrentStep();
        }
      }
    }
    
    // Generic change request - go back one step
    return this.handleGoBack();
  }

  /**
   * Reset agent state - ensures re-entry safety
   */
  reset(): void {
    this.state = {
      agentState: GlobalAgentState.IDLE,
      currentTask: null,
      currentStep: null,
      requiredInput: "NONE",
      collectedData: {},
      lastAgentMessage: null,
      taskHistory: [],
    };
  }

  /**
   * Cancel current task
   */
  cancel(): AgentResponse {
    return this.handleCancel();
  }

  /**
   * Go back one step
   */
  goBack(): AgentResponse {
    return this.handleGoBack();
  }
}

/**
 * Factory function to create AgentController instance
 * Must be called inside React component/hook to avoid module-scope initialization
 */
export function createAgentController(): AgentController {
  return new AgentController();
}
