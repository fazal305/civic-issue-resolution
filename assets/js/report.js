let currentStep = 1;

let selectedComplaintImages = [];

let REPORT_CONFIG = {
  maxComplaintImages: 3,
  maxImageSizeMb: 3,
  minComplaintLength: 20,
  totalWizardSteps: 4,
};

let MAX_COMPLAINT_IMAGES = REPORT_CONFIG.maxComplaintImages;

let MAX_IMAGE_SIZE_MB = REPORT_CONFIG.maxImageSizeMb;

let MIN_COMPLAINT_LENGTH = REPORT_CONFIG.minComplaintLength;

let TOTAL_WIZARD_STEPS = REPORT_CONFIG.totalWizardSteps;

function initializeCopyButton() {
  $(".copy-btn")
    .off("click")
    .on("click", function () {
      let complaint = $("#resultText").text();

      if (!complaint) {
        showToast("No complaint text available to copy.", "warning");

        return;
      }

      if (!navigator.clipboard) {
        showToast("Clipboard is not supported in this browser.", "danger");

        return;
      }

      navigator.clipboard
        .writeText(complaint)
        .then(function () {
          showToast("Complaint copied to clipboard!", "success");
        })
        .catch(function () {
          showToast("Unable to copy complaint.", "danger");
        });
    });
}

function initializeAuthorityButton() {
  $(".authority-btn")
    .off("click")
    .on("click", function () {
      showToast("Submission guidance is coming soon.", "info");
    });
}

$(document).ready(function () {
  if ($("#reportWizard").length === 0) {
    return;
  }

  initializeCategorySelection();

  initializeCharacterCounter();

  initializeLanguageSelection();

  initializeCopyButton();

  initializeAuthorityButton();

  initializeWizard();

  initializeKeyboardNavigation();

  initializeComplaintMap();

  initializeImageUpload();

  applyCategoryFromUrl();
});
