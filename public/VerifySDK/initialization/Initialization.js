import { ApiService } from '../network/ApiService.js';
import { SDKException, SDKExceptionCode } from '../exception/Exceptions.js';
import { SDKLogger } from '../utils/SDKLogger.js';
import { VerifySDK } from '../VerifySDK.js';

export class Initialization {

  static async initializeSDK(apiKey) {
    try {
      const isValid = await ApiService.verifyApiKey(apiKey);

      if (!isValid) {
        throw new SDKException(SDKExceptionCode.INVALID_API_KEY);
      }

      SDKLogger.i("API Key validated SUCCESSFULLY.");

     

      const keys = await ApiService.getFaceTecKeys(apiKey);
      const initializationSuccessful = await new Promise((resolve) => {
        window.FaceTecSDK.setResourceDirectory("https://educinvest.github.io/sdk/public/core-sdk/FaceTecSDK.js/resources");
        window.FaceTecSDK.setImagesDirectory("https://educinvest.github.io/sdk/public/core-sdk/FaceTec_images");
        window.FaceTecSDK.initializeInProductionMode(
          keys.sdkproductionkey,
         VerifySDK.InitialConfigurations.DeviceKeyIdentifier,
          VerifySDK.InitialConfigurations.PublicFaceScanEncryptionKey,
          (success) => {
            if (success) {
              console.log("FaceTec SDK initialized SUCCESSFULLY.");
            } else {
              console.log("FaceTec SDK initialization FAILED.");
            }
            resolve(success);
          }
        );
      });

      if (!initializationSuccessful) {
        throw new SDKException(SDKExceptionCode.INITIALIZATION_FAILED);
      }

      return initializationSuccessful;

    } catch (error) {
      SDKLogger.e(error.message);
      throw error;
    }
  }
}
