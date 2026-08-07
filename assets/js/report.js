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

function showDepartmentGuide(category) {
  if (typeof getDepartmentGuide === "undefined") {
    return;
  }

  let guide = getDepartmentGuide(category);

  $("#guideDepartmentName").text(guide.department);

  $("#guideDepartmentNote").text(guide.note);

  $("#guideHelpline").text(guide.helpline);

  $("#guideWebsite")
    .attr("href", guide.website);

  $("#guidePortalBtn")
    .attr("href", guide.website);

  $("#departmentGuideCard").fadeIn(300);
}

function initializeCopyButton() {
  $(".copy-btn")
    .off("click")
    .on("click", function () {
      let complaint = $("#resultText").text();

      if (!complaint) {
        showToast("No complaint text available.", "warning");
        return;
      }

      navigator.clipboard
        .writeText(complaint)
        .then(function () {
          showToast("Complaint copied successfully.", "success");
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
      $("html, body").animate(
        {
          scrollTop: $("#departmentGuideCard").offset().top - 80,
        },
        500
      );
    });
}

function initializeAiImproveButton() {
  $("#aiImproveBtn")
    .off("click")
    .on("click", function () {
      let category = $("#complaintCategory").val();

      let complaintText = $("#complaintText").val().trim();

      let language = $("#reportWizard .active-language").data("language");

      if (!complaintText) {
        showToast("Please write your complaint first.", "warning");
        return;
      }

      $("#aiImproveBtn")
        .prop("disabled", true)
        .html(civicIcon("robot", "civic-icon-sm") + " Civic AI is analyzing your complaint...");

      showToast("Analyzing complaint...", "info");

      setTimeout(function () {
        let aiResult = {
          complaint: "",
          analysis: buildAiAnalysis(category, complaintText)
        };

        generateComplaint(category, complaintText, language)
          .then(function (aiComplaint) {
            aiResult.complaint = aiComplaint;

            let analysis = aiResult.analysis;

            $("#resultText").hide().text(aiResult.complaint).fadeIn(500);

            $("#aiDepartment").text(analysis.department);
            $("#aiUrgency").text(analysis.urgency);
            $("#aiWritingQuality").text(analysis.writingQuality);
            $("#aiConfidence").text(analysis.confidence);
            $("#aiCategorySuggestion").text(analysis.categorySuggestion);
            $("#aiWritingSuggestion").text(analysis.writingSuggestion);

            if (analysis.detectedCategory && analysis.detectedCategory !== category) {
              $("#aiApplyCategoryBtn")
                .show()
                .data("category", analysis.detectedCategory);
            } else {
              $("#aiApplyCategoryBtn").hide();
            }

            $("#aiAnalysisCard").hide().fadeIn(500);

            showDepartmentGuide(analysis.detectedCategory || category);

            $("#aiImproveBtn")
              .prop("disabled", false)
              .html(civicIcon("robot", "civic-icon-sm") + " Analyze & Improve");

            showToast(
              "Civic AI analyzed your complaint successfully.",
              "success"
            );
          })
          .catch(function () {
            $("#aiImproveBtn")
              .prop("disabled", false)
              .html(civicIcon("robot", "civic-icon-sm") + " Analyze & Improve");

            showToast("AI improvement failed. Please try again.", "danger");
          });
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

      let card = $(
        '#reportWizard .category-card[data-category="' +
        suggestedCategory +
        '"]'
      );

      if (card.length) {
        selectCategory(card);

        showDepartmentGuide(suggestedCategory);

        showToast(
          "Suggested category applied.",
          "success"
        );
      }
    });
}

function initializeReportAnotherButton() {
  $("#guideReportAnotherBtn")
    .off("click")
    .on("click", function () {
      location.reload();
    });
}

$(document).ready(function () {
  if ($("#reportWizard").length === 0) {
    return;
  }

  $("#departmentGuideCard").hide();

  initializeCategorySelection();

  initializeCharacterCounter();

  initializeLanguageSelection();

  initializeCopyButton();

  initializeAuthorityButton();

  initializeAiImproveButton();

  initializeAiApplyCategoryButton();

  initializeReportAnotherButton();

  initializeWizard();

  initializeKeyboardNavigation();

  initializeComplaintMap();

  initializeImageUpload();

  applyCategoryFromUrl();
});