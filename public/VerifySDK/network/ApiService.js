import { SDKException, SDKExceptionCode } from "../exception/Exceptions.js";
import { VerifySDK } from '../VerifySDK.js';

export class ApiService {
  static async verifyApiKey(apiKey) {
    const url = `${VerifySDK.InitialConfigurations.BaseURL}/api/v1/apikeys/validate`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'tenantId': VerifySDK.InitialConfigurations.TenantId,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });

      if (!response.ok) {
        throw new SDKException(`HTTP ${response.status}`, SDKExceptionCode.SERVER_ERROR);
      }

      const responseBody = await response.text();
      console.log('server response:', responseBody);
      return true;
    } catch (e) {
      throw new SDKException(`Network error: ${e.message}`, SDKExceptionCode.NETWORK_ERROR);
    }
  }

  static async createVerification(workflowId, thirdPartyReference, apiKey) {
    const url = `${VerifySDK.InitialConfigurations.BaseURL}/api/v1/verifications`;

    const body = {
      workflowId,
      thirdPartyReference,
      tenantId: VerifySDK.InitialConfigurations.TenantId
    };

    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'tenantId': VerifySDK.InitialConfigurations.TenantId
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      });

      const responseText = await response.text();

      if (!response.ok) {
        throw new SDKException(`HTTP error: ${response.status}`, SDKExceptionCode.SERVER_ERROR);
      }

      const json = JSON.parse(responseText);
      console.log("Response: ", json);
      return json.verificationId;

    } catch (e) {
      throw new SDKException(`Network error: ${e.message}`, SDKExceptionCode.NETWORK_ERROR);
    }
  }

  static async getVerification(verificationId, apiKey) {
    const url = `${VerifySDK.InitialConfigurations.BaseURL}/api/v1/verifications/${verificationId}`;

    const headers = {
      'x-api-key': apiKey,
      'tenantId': VerifySDK.InitialConfigurations.TenantId
    };

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers
      });

      const body = await response.text();

      if (!response.ok) {
        throw new SDKException(`HTTP error: ${response.status}`, SDKExceptionCode.SERVER_ERROR);
      }

      const json = JSON.parse(body);
      console.log("Response: ", json);
      return json;

    } catch (e) {
      throw new SDKException(`Network error: ${e.message}`, SDKExceptionCode.NETWORK_ERROR);
    }
  }

  static async getSessionToken() {
    const url = `${VerifySDK.InitialConfigurations.BaseURL}/api/v1/session-token`;

    const headers = {
      "Content-Type": "application/json",
      'x-device-key': VerifySDK.InitialConfigurations.DeviceKeyIdentifier,
      'user-agent': window.FaceTecSDK.createFaceTecAPIUserAgentString(""),
      'x-user-agent': window.FaceTecSDK.createFaceTecAPIUserAgentString("")

    };

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers
      });

      const responseText = await response.text();
      const responseJSON = JSON.parse(responseText);

      if (!responseJSON.sessionToken) {
        throw new SDKException("Session Token NOT found in the response.", SDKExceptionCode.SERVER_ERROR);
      }

      return responseJSON.sessionToken;

    } catch (e) {
      throw new SDKException(`Error getting the Session Token: ${e.message}`, SDKExceptionCode.NETWORK_ERROR);
    }
  }

  static async getFaceTecKeys(apiKey){
    const url =  `${VerifySDK.InitialConfigurations.BaseURL}/api/v1/biometrics/web/productionkey`
    const headers = {
      'x-api-key': apiKey,
      'tenantId': VerifySDK.InitialConfigurations.TenantId
    }

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers
      });

      const ResponseBody = await response.text();
      const responseJSON = JSON.parse(ResponseBody);

      if (!response.ok) {
        throw new SDKException(`HTTP error: ${response.status}`, SDKExceptionCode.SERVER_ERROR);
      }

      return responseJSON;

    } catch (e) {
      throw new SDKException(`Network error: ${e.message}`, SDKExceptionCode.NETWORK_ERROR);
    }
  }
}
