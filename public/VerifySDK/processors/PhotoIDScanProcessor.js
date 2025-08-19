import { VerifySDK } from '../VerifySDK.js';

export class PhotoIDScanProcessor {
  constructor(sessionToken, verification) {
    this.verification = verification;
    this.success = false;
    this.latestIDScanResult = null;
    this.cancelledDueToNetworkError = false;

    window.FaceTecSDK.FaceTecCustomization.setIDScanUploadMessageOverrides(
      "Uploading<br/>Encrypted<br/>ID Scan",
      "Still Uploading...<br/>Slow Connection",
      "Upload Complete",
      "Processing<br/>ID Scan",
      "Uploading<br/>Encrypted<br/>Back of ID",
      "Still Uploading...<br/>Slow Connection",
      "Upload Complete",
      "Processing<br/>Back of ID",
      "Uploading<br/>Your Confirmed Info",
      "Still Uploading...<br/>Slow Connection",
      "Info Saved",
      "Processing"
    );

    new window.FaceTecSDK.FaceTecSession(this, sessionToken);
  }

  processIDScanResultWhileFaceTecSDKWaits = async (idScanResult, idScanResultCallback) => {
    this.latestIDScanResult = idScanResult;

    if (idScanResult.status !== window.FaceTecSDK.FaceTecIDScanStatus.Success) {
      idScanResultCallback.cancel();
      return;
    }
    console.log("Id da veri: ", await this.verification.getVerificationId())
    const url = `${VerifySDK.InitialConfigurations.BaseURL}/api/v1/verifications/${this.verification.getVerificationId()}/products/identity-verification/id-scan`;

    const payload = {
      idScan: idScanResult.idScan,
      ...(idScanResult.frontImages?.[0] && { idScanFrontImage: idScanResult.frontImages[0] }),
      ...(idScanResult.backImages?.[0] && { idScanBackImage: idScanResult.backImages[0] }),
      verificationId: this.verification.getVerificationId(),
      workflowId: this.verification.getWorkflowId()

    };

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => {
        idScanResultCallback.uploadMessageOverride("Still Uploading...");
      }, 6000);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Device-Key": VerifySDK.InitialConfigurations.DeviceKeyIdentifier,
          "tenantId": VerifySDK.InitialConfigurations.TenantId,
          'apiKey': VerifySDK.InitialConfigurations.ApiKey,
          "User-Agent": window.FaceTecSDK.createFaceTecAPIUserAgentString(idScanResult.sessionId),
          "X-User-Agent": window.FaceTecSDK.createFaceTecAPIUserAgentString(idScanResult.sessionId)
        },
        body: JSON.stringify(payload)
      });

      clearTimeout(timeout);

      const json = await response.json();
      console.log("Resposta: ", JSON.stringify(json));
      if (json.wasProcessed === true && json.error === false) {
        window.FaceTecSDK.FaceTecCustomization.setIDScanResultScreenMessageOverrides(
          "Front Scan Complete",
          "Front of ID<br/>Scanned",
          "ID Scan Complete",
          "Passport Scan Complete",
          "Photo ID Scan<br/>Complete",
          "ID Photo Capture<br/>Complete",
          "Face Didn't Match<br/>Highly Enough",
          "ID Document<br/>Not Fully Visible",
          "ID Text Not Legible",
          "ID Type Mismatch<br/>Please Try Again"
        );
        idScanResultCallback.proceedToNextStep(json.scanResultBlob);
      } else {
        this.cancelDueToNetworkError(json.errorMessage || "Unexpected API response", idScanResultCallback);
      }
    } catch (error) {
      this.cancelDueToNetworkError(error.message || "Network error", idScanResultCallback);
    }
  };

  onFaceTecSDKCompletelyDone = () => {
    this.success = this.latestIDScanResult.isCompletelyDone;
    if (this.success) {
      console.log("IDScanResult Complete");
    }
  };

  cancelDueToNetworkError = (message, callback) => {
    if (!this.cancelledDueToNetworkError) {
      console.error(message);
      this.cancelledDueToNetworkError = true;
      callback.cancel();
    }
  };

  isSuccess = () => this.success;
}
