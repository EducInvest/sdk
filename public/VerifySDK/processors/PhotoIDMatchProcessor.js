import { VerifySDK } from '../VerifySDK.js';

export class PhotoIDMatchProcessor {
  constructor(sessionToken, verification) {
    this.verification = verification;
    this.success = false;
    this.latestSessionResult = null;
    this.latestIDScanResult = null;
    this.cancelledDueToNetworkError = false;

    new window.FaceTecSDK.FaceTecSession(this, sessionToken);
  }

  processSessionResultWhileFaceTecSDKWaits = async (sessionResult, faceScanResultCallback) => {
    this.latestSessionResult = sessionResult;

    if (sessionResult.status !== window.FaceTecSDK.FaceTecSessionStatus.SessionCompletedSuccessfully) {
      faceScanResultCallback.cancel();
      return;
    }

    console.log("External data base ref: ", this.verification.getThirdPartyReference());

    const parameters = {
      faceScan: sessionResult.faceScan,
      auditTrailImage: sessionResult.auditTrail[0],
      lowQualityAuditTrailImage: sessionResult.lowQualityAuditTrail[0],
      sessionId: sessionResult.sessionId,
      externalDatabaseRefID: this.verification.getThirdPartyReference(),
      workflowId: this.verification.getWorkflowId()
    };

    const url = `${VerifySDK.InitialConfigurations.BaseURL}/api/v1/verifications/${this.verification.getVerificationId()}/products/identity-verification/enrollment`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

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
        body: JSON.stringify(parameters)
      });

      clearTimeout(timeoutId);

      const json = await response.json();
      const scanResultBlob = json.scanResultBlob;

      if (json.wasProcessed === true && json.error === false) {
        window.FaceTecSDK.FaceTecCustomization.overrideResultScreenSuccessMessage = "Documento capturado\ncom sucesso";
        faceScanResultCallback.proceedToNextStep(scanResultBlob);
      } else {
        this.cancelDueToNetworkError(json.errorMessage || "Resposta inesperada da API", faceScanResultCallback);
      }
    } catch (error) {
      this.cancelDueToNetworkError(error.message || "Erro de rede", faceScanResultCallback);
    }
  };

  processIDScanResultWhileFaceTecSDKWaits = async (idScanResult, idScanResultCallback) => {
    this.latestIDScanResult = idScanResult;

    if (idScanResult.status !== window.FaceTecSDK.FaceTecIDScanStatus.Success) {
      idScanResultCallback.cancel();
      return;
    }

    const MinMatchLevel = 3;

    const parameters = {
      idScan: idScanResult.idScan,
      externalDatabaseRefID: this.verification.getThirdPartyReference(),
      minMatchLevel: MinMatchLevel,
      sessionId: idScanResult.sessionId,
      idScanFrontImage: idScanResult.frontImages?.[0] || null,
      idScanBackImage: idScanResult.backImages?.[0] || null,
      workflowId: this.verification.getWorkflowId()
    };

    const url = `${VerifySDK.InitialConfigurations.BaseURL}/api/v1/verifications/${this.verification.getVerificationId()}/products/identity-verification/photo-id-match`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Device-Key': VerifySDK.InitialConfigurations.DeviceKeyIdentifier,
          'tenantId': VerifySDK.InitialConfigurations.TenantId,
          'apiKey': VerifySDK.InitialConfigurations.ApiKey,
          'User-Agent': window.FaceTecSDK.createFaceTecAPIUserAgentString(idScanResult.sessionId),
          'X-User-Agent': window.FaceTecSDK.createFaceTecAPIUserAgentString(idScanResult.sessionId),
        },
        body: JSON.stringify(parameters),
      });

      clearTimeout(timeoutId);

      const json = await response.json();
      const scanResultBlob = json.scanResultBlob;

      if (json.wasProcessed === true && json.error === false) {
        window.FaceTecSDK.FaceTecCustomization.setIDScanResultScreenMessageOverrides(
          "Frente digitalizada", "Frente do documento<br/>capturada",
          "Documento digitalizado", "Passaporte digitalizado",
          "Documento completo", "Documento pendente de revisão",
          "Face não correspondeu", "Documento mal visível",
          "Texto não legível", "Tipo de documento incompatível"
        );

        idScanResultCallback.proceedToNextStep(scanResultBlob);
      } else {
        this.cancelDueToNetworkError(json.errorMessage || "Erro inesperado da API", idScanResultCallback);
      }
    } catch (error) {
      this.cancelDueToNetworkError(error.message || "Erro de rede", idScanResultCallback);
    }
  };

  cancelDueToNetworkError = (message, callback) => {
    if (!this.cancelledDueToNetworkError) {
      console.error(message);
      this.cancelledDueToNetworkError = true;
      callback.cancel();
    }
  };

  onFaceTecSDKCompletelyDone = () => {
    this.success = this.latestIDScanResult?.isCompletelyDone || false;
    if (this.success) {
      console.log("Verificação de documento concluída com sucesso.");
    }
  };

  isSuccess = () => this.success;
}
