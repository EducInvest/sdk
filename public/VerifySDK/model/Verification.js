export class Verification {
  constructor({
                verificationId = '',
                workflowId = '',
                thirdPartyReference = '',
                isComplete = false,
                hasError = false,
                errorDetails = '',
                priority = '',
                status = '',
                dueDate = null
              } = {}) {
    this.verificationId = verificationId;
    this.workflowId = workflowId;
    this.thirdPartyReference = thirdPartyReference;
    this.isComplete = isComplete;
    this.hasError = hasError;
    this.errorDetails = errorDetails;
    this.priority = priority;
    this.status = status;
    this.dueDate = dueDate ? new Date(dueDate) : null;
  }

  static fromJson(json) {
    let parsed;

    if (typeof json === 'string') {
      try {
        parsed = JSON.parse(json);
      } catch (e) {
        console.error('Erro ao fazer parse do JSON:', e);
        return null;
      }
    } else {
      parsed = json;
    }

    try {
      return new Verification(parsed);
    } catch (e) {
      console.error('Erro ao criar Verification:', e);
      return null;
    }
  }

  getVerificationId() {
    return this.verificationId;
  }
  getStatus() {
    return this.status;
  }

  getWorkflowId() {
    return this.workflowId;
  }
  getThirdPartyReference() {
    return this.thirdPartyReference;
  }
  getIsComplete() {
    return this.isComplete;
  }
  getErrorDetails() {
    return this.errorDetails;
  }

  getPriority() {
    return this.priority;
  }
  getHasError() {
    return this.hasError;
  }


}
