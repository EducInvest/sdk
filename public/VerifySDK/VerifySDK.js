import { Initialization } from './initialization/Initialization.js';
import { VerificationManager } from './manager/VerificationManager.js';
import { SDKException, SDKExceptionCode } from './exception/Exceptions.js';
import { VerificationService } from './service/VerificationService.js';
import { CustomizationService } from './service/CustomizationService.js';

export class VerifySDK {
  static apiKey = "";
  static verificationManager = null;
  static isSDKInitialized = false;
  static verificationService = null;
  static customizationService = null;

  static InitialConfigurations = {
    TenantId: '',
    DeviceKeyIdentifier: '',
    PublicFaceScanEncryptionKey: '',
    BaseURL: '',
    ApiKey: ''
  };

  /**
   * Inicializa o SDK com a apiKey
   */
  
  static async initialize(apiKey) {
    try {
      await Initialization.initializeSDK(apiKey);
      this.isSDKInitialized = true;
      this.apiKey = apiKey;
      this.verificationManager = new VerificationManager(apiKey);
      this.verificationService = new VerificationService();
      this.customizationService = new CustomizationService();
      return true;
    } catch (error) {
      throw new SDKException("Failed to initialize the SDK.", SDKExceptionCode.NOT_INITIALIZED);
    }
  }

  /**
   * Retorna o VerificationManager já configurado
   */
  static async getVerificationManager(workflowID, thirdPartyRef) {
    if (!this.isSDKInitialized) {
      throw new SDKException("SDK not initialized.", SDKExceptionCode.NOT_INITIALIZED);
    }
    return this.verificationManager.setup(workflowID, thirdPartyRef);
  }


  static getVerificationService() {
    if (!this.isSDKInitialized) {
      throw new Error("SDK not initialized.");
    }
    return this.verificationService;
  }

  static getCustomizationService() {
    if (!this.isSDKInitialized) {
      throw new Error("SDK not initialized.");
    }
    return this.customizationService;
  }
}
