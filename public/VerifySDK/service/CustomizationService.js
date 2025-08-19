export class CustomizationService {
  constructor() {
    this.outerBackgroundColor = "#ffffff";
    this.frameColor = "#ffffff";
    this.borderColor = "#417FB2";
    this.ovalColor = "#FF0000";
    this.dualSpinnerColor = "#417FB2";
    this.textColor = "#417FB2";
    this.buttonAndFeedbackBarColor = "#417FB2";
    this.buttonAndFeedbackBarTextColor = "#ffffff";
    this.buttonColorHighlight = "#396E99";
    this.buttonColorDisabled = "#B9CCDE";
    this.frameCornerRadius = 20;
    this.yourAppLogoImage = null; // Set with setYourAppLogoImage()

    this.currentCustomization = this._retrieveCustomization();
    this.currentLowLightCustomization = this._retrieveCustomization();
    this.currentDynamicDimmingCustomization = this._retrieveCustomization();
  }

  // --- Fluent Setters ---
  setOuterBackgroundColor(color) {
    this.outerBackgroundColor = color;
    return this;
  }
  setFrameColor(color) {
    this.frameColor = color;
    return this;
  }
  setBorderColor(color) {
    this.borderColor = color;
    return this;
  }
  setOvalColor(color) {
    this.ovalColor = color;
    return this;
  }
  setDualSpinnerColor(color) {
    this.dualSpinnerColor = color;
    return this;
  }
  setTextColor(color) {
    this.textColor = color;
    return this;
  }
  setButtonAndFeedbackBarColor(color) {
    this.buttonAndFeedbackBarColor = color;
    return this;
  }
  setButtonAndFeedbackBarTextColor(color) {
    this.buttonAndFeedbackBarTextColor = color;
    return this;
  }
  setButtonColorHighlight(color) {
    this.buttonColorHighlight = color;
    return this;
  }
  setButtonColorDisabled(color) {
    this.buttonColorDisabled = color;
    return this;
  }
  setFrameCornerRadius(radius) {
    this.frameCornerRadius = radius;
    return this;
  }
  setYourAppLogoImage(img) {
    this.yourAppLogoImage = img;
    return this;
  }

  getOvalColor() {
    return this.ovalColor;
  }

  applyCustomization() {
    this.currentCustomization = this._retrieveCustomization();
    window.FaceTecSDK.setCustomization(this.currentCustomization);
    return this;
  }

  getCurrentCustomization() {
    return this.currentCustomization;
  }

  getCurrentLowLightCustomization() {
    return this.currentLowLightCustomization;
  }

  getCurrentDynamicDimmingCustomization() {
    return this.currentDynamicDimmingCustomization;
  }

  _retrieveCustomization() {
    const c = new window.FaceTecSDK.FaceTecCustomization();

    // Frame
    c.frameCustomization.cornerRadius = this.frameCornerRadius;
    c.frameCustomization.backgroundColor = this.frameColor;
    c.frameCustomization.borderColor = this.borderColor;

    // Overlay
    c.overlayCustomization.backgroundColor = this.outerBackgroundColor;
    if (this.yourAppLogoImage) c.overlayCustomization.brandingImage = this.yourAppLogoImage;

    // Guidance
    c.guidanceCustomization.backgroundColors = this.frameColor;
    c.guidanceCustomization.foregroundColor = this.textColor;
    c.guidanceCustomization.buttonBackgroundNormalColor = this.buttonAndFeedbackBarColor;
    c.guidanceCustomization.buttonBackgroundDisabledColor = this.buttonColorDisabled;
    c.guidanceCustomization.buttonBackgroundHighlightColor = this.buttonColorHighlight;
    c.guidanceCustomization.buttonTextNormalColor = this.buttonAndFeedbackBarTextColor;
    c.guidanceCustomization.buttonTextDisabledColor = this.buttonAndFeedbackBarTextColor;
    c.guidanceCustomization.buttonTextHighlightColor = this.buttonAndFeedbackBarTextColor;
    c.guidanceCustomization.retryScreenImageBorderColor = this.borderColor;
    c.guidanceCustomization.retryScreenOvalStrokeColor = this.borderColor;

    // Oval
    c.ovalCustomization.strokeColor = this.ovalColor;
    c.ovalCustomization.progressColor1 = this.dualSpinnerColor;
    c.ovalCustomization.progressColor2 = this.dualSpinnerColor;

    // Feedback
    c.feedbackCustomization.backgroundColors = this.buttonAndFeedbackBarColor;
    c.feedbackCustomization.textColor = this.buttonAndFeedbackBarTextColor;

    // Cancel
    c.cancelButtonCustomization.location = "topLeft";

    // Result
    c.resultScreenCustomization.backgroundColors = this.frameColor;
    c.resultScreenCustomization.foregroundColor = this.textColor;
    c.resultScreenCustomization.activityIndicatorColor = this.buttonAndFeedbackBarColor;
    c.resultScreenCustomization.resultAnimationBackgroundColor = this.buttonAndFeedbackBarColor;
    c.resultScreenCustomization.resultAnimationForegroundColor = this.buttonAndFeedbackBarTextColor;
    c.resultScreenCustomization.uploadProgressFillColor = this.buttonAndFeedbackBarColor;

    // Watermark
    c.securityWatermarkImage = "FaceTec_zoom";

    // ID Scan
    c.idScanCustomization.selectionScreenBackgroundColors = this.frameColor;
    c.idScanCustomization.selectionScreenForegroundColor = this.textColor;
    c.idScanCustomization.reviewScreenBackgroundColors = this.frameColor;
    c.idScanCustomization.reviewScreenForegroundColor = this.buttonAndFeedbackBarTextColor;
    c.idScanCustomization.reviewScreenTextBackgroundColor = this.buttonAndFeedbackBarColor;
    c.idScanCustomization.captureScreenForegroundColor = this.buttonAndFeedbackBarTextColor;
    c.idScanCustomization.captureScreenTextBackgroundColor = this.buttonAndFeedbackBarColor;
    c.idScanCustomization.buttonBackgroundNormalColor = this.buttonAndFeedbackBarColor;
    c.idScanCustomization.buttonBackgroundDisabledColor = this.buttonColorDisabled;
    c.idScanCustomization.buttonBackgroundHighlightColor = this.buttonColorHighlight;
    c.idScanCustomization.buttonTextNormalColor = this.buttonAndFeedbackBarTextColor;
    c.idScanCustomization.buttonTextDisabledColor = this.buttonAndFeedbackBarTextColor;
    c.idScanCustomization.buttonTextHighlightColor = this.buttonAndFeedbackBarTextColor;
    c.idScanCustomization.captureScreenBackgroundColor = this.frameColor;
    c.idScanCustomization.captureFrameStrokeColor = this.borderColor;

    return c;
  }
}
