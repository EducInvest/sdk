import { ApiService } from '../network/ApiService.js';
import { SDKException, SDKExceptionCode } from '../exception/Exceptions.js';
import { Verification } from '../model/Verification.js';

export class VerificationManager {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.workflowID = null;
    this.thirdPartyRef = null;
    this.verification = null;
  }

  // Prepara a configuração da verificação
  setup(workflowID, thirdPartyRef) {
    this.workflowID = workflowID;
    this.thirdPartyRef = thirdPartyRef;
    return this; // Retorna a própria instância
  }

  // Cria uma verificação nova — retorna Promise<string> com verificationId
  async createVerification(workflowID, thirdPartyRef) {
    if (!workflowID || !thirdPartyRef) {
      throw new SDKException("workflowID ou thirdPartyRef não foram definidos.", SDKExceptionCode.MISSING_REQUIRED_FIELDS);
    }

    const verificationId = await ApiService.createVerification(workflowID, thirdPartyRef, this.apiKey);
    console.log(`Verificação criada com ID: ${verificationId}`);
    return verificationId;
  }

  // Busca uma verificação pelo ID — retorna Promise<verification>
  async getVerification(verificationId) {
    if (!verificationId) {
      throw new SDKException("verificationId não foi fornecido.", SDKExceptionCode.MISSING_REQUIRED_FIELDS);
    }

    const json = await ApiService.getVerification(verificationId, this.apiKey);
    console.log("Verificação obtida:", json);
    this.verification = Verification.fromJson(json.verification);
    return this.verification;
  }
}
