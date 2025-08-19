export const SDKLogger = {
  TAG: 'VerifySDK',
  enabled: true,

  enableLogging(isEnabled) {
    this.enabled = isEnabled;
  },

  d(message) {
    if (this.enabled) console.debug(`[${this.TAG}] DEBUG: ${message}`);
  },

  e(message) {
    if (this.enabled) console.error(`[${this.TAG}] ERROR: ${message}`);
  },

  i(message) {
    if (this.enabled) console.info(`[${this.TAG}] INFO: ${message}`);
  },

  w(message) {
    if (this.enabled) console.warn(`[${this.TAG}] WARN: ${message}`);
  }
};
