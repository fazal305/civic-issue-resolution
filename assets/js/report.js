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
function initializeAiImproveButton() {
  $("#aiImproveBtn")
    .off("click")
    .on("click", function () {
      let category = $("#complaintCategory").val();

      let complaintText = $("#complaintText").val().trim();

      let language = $("#reportWizard .active-language").data("language");

      $("#aiImproveBtn")
        .prop("disabled", true)
        .text("🤖 AI is improving your complaint...");

      showToast("Analyzing complaint...", "info");

      setTimeout(function () {
        let aiResult = improveComplaintWithLocalAi(
          category,
          complaintText,
          language,
        );

        $("#resultText").text(aiResult.complaint);

        let analysis = aiResult.analysis;
        $("#aiDepartment").text(analysis.department);

        $("#aiUrgency").text(analysis.urgency);

        $("#aiWritingQuality").text(analysis.writingQuality);

        $("#aiConfidence").text(analysis.confidence);
        $("#aiCategorySuggestion").text(analysis.categorySuggestion);
        $("#aiWritingSuggestion").text(analysis.writingSuggestion);
        if (
          analysis.detectedCategory &&
          analysis.detectedCategory !== category
        ) {
          $("#aiApplyCategoryBtn")
            .show()
            .data("category", analysis.detectedCategory);
        } else {
          $("#aiApplyCategoryBtn").hide();
        }
        $("#aiAnalysisCard").hide().fadeIn(500);

        $("#resultText").hide().text(aiResult.complaint).fadeIn(500);

        $("#aiImproveBtn").prop("disabled", false).text("✨ Improve Complaint");

        showToast("AI analysis completed successfully.", "success");
      }, 1500);
    });
}
function initializeAiApplyCategoryButton() {
  $("#aiApplyCategoryBtn")
    .off("click")
    .on("click", function () {
      let suggestedCategory = $(this).data("category");

      if (!suggestedCategory) {
        return;
      }

      let categoryCard = $(
        '#reportWizard .category-card[data-category="' +
          suggestedCategory +
          '"]',
      );

      if (categoryCard.length) {
        selectCategory(categoryCard);

        showToast("Suggested category applied.", "success");
      }
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
  initializeAiImproveButton();
  initializeAiApplyCategoryButton();
  initializeWizard();

  initializeKeyboardNavigation();

  initializeComplaintMap();

  initializeImageUpload();

  applyCategoryFromUrl();
});
