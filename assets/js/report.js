let currentStep = 1;

let selectedComplaintImages = [];

let MAX_COMPLAINT_IMAGES = 3;

let MAX_IMAGE_SIZE_MB = 3;

let MIN_COMPLAINT_LENGTH = 20;

let TOTAL_WIZARD_STEPS = 4;

function initializeCopyButton() {
  $(".copy-btn").click(function () {
    let complaint = $("#resultText").text();

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
  $(".authority-btn").click(function () {
    showToast("Feature coming soon.", "info");
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
