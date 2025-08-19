
import { SDKException, SDKExceptionCode } from '../exception/Exceptions.js';
import { LivenessCheckProcessor } from '../processors/LivenessCheckProcessor.js';
import { PhotoIDScanProcessor } from '../processors/PhotoIDScanProcessor.js';
import { EnrollmentProcessor } from '../processors/EnrollmentProcessor.js';
import { PhotoIDMatchProcessor } from '../processors/PhotoIDMatchProcessor.js';
import { ApiService } from '../network/ApiService.js';

export class VerificationService {
  constructor() {
    this.latestProcessor = null;
  }

  checkConditions(verification) {
    if (!verification) {
      throw new SDKException("Verification was not created", SDKExceptionCode.VERIFICATION_FETCH_FAILED);
    }
    if (new Date(verification.dueDate) < new Date()) {
      throw new SDKException("Verification is due", SDKExceptionCode.VERIFICATION_EXPIRED);
    }
  }

  async startLiveness(verification) {
    this.checkConditions(verification);

    const sessionToken = await ApiService.getSessionToken();
    console.log("Session Token:", sessionToken)
    this.latestProcessor = new LivenessCheckProcessor(sessionToken, verification);

    return true;
  }

  async startIDScan(verification) {
    this.checkConditions(verification);

    const sessionToken = await ApiService.getSessionToken();

    this.latestProcessor = new PhotoIDScanProcessor(sessionToken, verification);

    return true;
  }

  async startIDMatch(verification) {
    this.checkConditions(verification);
    const sessionToken = await ApiService.getSessionToken();
    this.latestProcessor = new PhotoIDMatchProcessor(sessionToken, verification);

    return true;
  }

  async startEnrollment(verification) {
    this.checkConditions(verification);

    const sessionToken = await ApiService.getSessionToken()

    this.latestProcessor = new EnrollmentProcessor(sessionToken, verification);

    return true;
  }
}
