import { VerifySDK } from '../VerifySDK.js';

export class EnrollmentProcessor {
  constructor(sessionToken, verification) {
    this.success = false;
    this.verification = verification;
    this.latestSessionResult = null;
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
    // Part 1: Iniciar a sessão FaceTec
    new window.FaceTecSDK.FaceTecSession(this, sessionToken);
  }

  processSessionResultWhileFaceTecSDKWaits = async (sessionResult, faceScanResultCallback) => {
    this.latestSessionResult = sessionResult;

    if (sessionResult.status !== window.FaceTecSDK.FaceTecSessionStatus.SessionCompletedSuccessfully) {
      faceScanResultCallback.cancel();
      return;
    }

    const url = `${VerifySDK.InitialConfigurations.BaseURL}/api/v1/verifications/${this.verification.getVerificationId()}/products/identity-verification/enrollment`;

    const payload = {
      faceScan: sessionResult.faceScan,
      auditTrailImage: sessionResult.auditTrail[0],
      lowQualityAuditTrailImage: sessionResult.lowQualityAuditTrail[0],
      externalDatabaseRefID: this.verification.getThirdPartyReference(),
      workflowId: this.verification.getWorkflowId()
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Device-Key': VerifySDK.InitialConfigurations.DeviceKeyIdentifier,
          'tenantId': VerifySDK.InitialConfigurations.TenantId,
          'apiKey': VerifySDK.InitialConfigurations.ApiKey,
          'User-Agent': window.FaceTecSDK.createFaceTecAPIUserAgentString(sessionResult.sessionId),
          'X-User-Agent': window.FaceTecSDK.createFaceTecAPIUserAgentString(sessionResult.sessionId),
        },
        body: JSON.stringify(payload)
      });

      const responseJSON = await response.json();

      if (responseJSON.wasProcessed === true && responseJSON.error === false) {
        window.FaceTecSDK.FaceTecCustomization.setOverrideResultScreenSuccessMessage("Face Scanned\n3D Liveness Proven");
        faceScanResultCallback.proceedToNextStep(responseJSON.scanResultBlob);
      } else {
        this.cancelDueToNetworkError(
          "Erro de API: " + (responseJSON.errorMessage || "Desconhecido"),
          faceScanResultCallback
        );
      }
    } catch (error) {
      this.cancelDueToNetworkError("Erro de rede ou parsing: " + error.message, faceScanResultCallback);
    }

    // Part 9: Mensagem se o upload demorar muito

    const json = JSON.stringify(payload);
    const totalBytes = new TextEncoder().encode(json).length;
    let uploadedBytes = 0;
    setTimeout(() => {
      if (uploadedBytes < totalBytes) {
        faceScanResultCallback.uploadMessageOverride("Ainda enviando...");
      }
    }, 6000);
  };


  onFaceTecSDKCompletelyDone = () => {
    this.success = this.latestSessionResult.isCompletelyDone;
    if (this.success) {
      console.log("Enrollment Confirmado");
    }
  };

  cancelDueToNetworkError = (message, faceScanResultCallback) => {
    if (!this.cancelledDueToNetworkError) {
      console.error(message);
      this.cancelledDueToNetworkError = true;
      faceScanResultCallback.cancel();
    }
  };

  isSuccess = () => {
    return this.success;
  };
}
