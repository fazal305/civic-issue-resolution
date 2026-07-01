function updateProgressIndicator(step, previousStep) {
  let fillPercent = ((step - 1) / (TOTAL_WIZARD_STEPS - 1)) * 100;

  $("#progressTrackFill").css("width", fillPercent + "%");

  $(".progress-step").each(function () {
    let stepNumber = $(this).data("progress-step");
    let $label = $(this).find(".step-number-label");

    $(this)
      .removeClass("active-step completed-step just-completed")
      .removeAttr("aria-current");

    if (stepNumber < step) {
      $(this).addClass("completed-step");
      $label.text("✓");
      $(this).attr("aria-label", "Step " + stepNumber + " completed");
    } else if (stepNumber === step) {
      $(this).addClass("active-step");
      $label.text(stepNumber);

      $(this)
        .attr("aria-current", "step")
        .attr("aria-label", "Current step " + stepNumber);
    } else {
      $label.text(stepNumber);
      $(this).attr("aria-label", "Step " + stepNumber + " not completed");
    }
  });

  if (previousStep && step > previousStep) {
    let $completedStep = $("#progressStep" + previousStep);

    $completedStep.addClass("just-completed");

    setTimeout(function () {
      $completedStep.removeClass("just-completed");
    }, 650);
  }

  $("#currentStepNumber").text(step);
}

function updateNavigation(step) {
  $("#wizardPrevBtn").prop("disabled", step === 1);

  if (step === 3) {
    $("#wizardNextBtn").text("Generate Complaint");
  } else if (step === 4) {
    $("#wizardNextBtn").text("Report Another");
  } else {
    $("#wizardNextBtn").text("Next →");
  }
}

function goToStep(step) {
  let previousStep = currentStep;
  let $container = $("#wizardPanelsContainer");
  let $currentPanel = $("#wizardStep" + previousStep);
  let $nextPanel = $("#wizardStep" + step);

  if (previousStep === step) {
    return;
  }

  currentStep = step;

  if (!$container.hasClass("wizard-animate")) {
    $container.addClass("wizard-animate");
  }

  $container
    .removeClass("wizard-forward wizard-backward")
    .addClass(step > previousStep ? "wizard-forward" : "wizard-backward");

  $currentPanel.removeClass("active-wizard-panel");
  $nextPanel.addClass("active-wizard-panel");

  updateProgressIndicator(step, previousStep);
  updateNavigation(step);
  updateNextButtonState();

  setTimeout(function () {
    focusCurrentStepPanel();
  }, 420);

  $("html, body").animate(
    {
      scrollTop: $("#reportWizard").offset().top - 80,
    },
    400,
  );
}

function clearStepErrors(step) {
  if (!step || step === 1) {
    $("#categoryError").removeClass("visible").text("");
    $("#categoryGrid").removeClass("wizard-shake");
  }

  if (!step || step === 2) {
    $("#complaintTextError").removeClass("visible").text("");
    $("#complaintText").removeClass("is-invalid");
  }
}

function showStepError(step, message) {
  if (step === 1) {
    $("#categoryError").text(message).addClass("visible");
    $("#categoryGrid").addClass("wizard-shake");

    setTimeout(function () {
      $("#categoryGrid").removeClass("wizard-shake");
    }, 500);
  }

  if (step === 2) {
    $("#complaintTextError").text(message).addClass("visible");
    $("#complaintText").addClass("is-invalid").focus();
  }
}

function isStepValid(step) {
  if (step === 1) {
    return $("#complaintCategory").val() !== "";
  }

  if (step === 2) {
    let complaintText = $("#complaintText").val().trim();

    return complaintText.length >= MIN_COMPLAINT_LENGTH;
  }

  return true;
}

function updateNextButtonState() {
  if (currentStep === 4) {
    $("#wizardNextBtn").prop("disabled", false);

    return;
  }

  $("#wizardNextBtn").prop("disabled", !isStepValid(currentStep));
}

function validateStep(step) {
  clearStepErrors(step);

  if (step === 1) {
    if (!isStepValid(1)) {
      showStepError(1, "Please select an issue category to continue.");

      return false;
    }
  }

  if (step === 2) {
    let complaintText = $("#complaintText").val().trim();

    if (complaintText === "") {
      showStepError(2, "Please describe your issue before continuing.");

      return false;
    }

    if (complaintText.length < MIN_COMPLAINT_LENGTH) {
      showStepError(
        2,
        "Please add more detail — at least " +
          MIN_COMPLAINT_LENGTH +
          " characters required.",
      );

      return false;
    }
  }

  return true;
}

function resetWizard() {
  $("#complaintCategory").val("");
  $("#complaintText").val("");
  $("#characterCount").text("0");
  $("#characterMinHint").text("");
  $("#selectedCategoryLabel").text("—");

  $("#reportWizard .category-card")
    .removeClass("selected-category")
    .attr("aria-pressed", "false");

  $("#reportWizard .language-btn").removeClass("active-language");

  $('#reportWizard .language-btn[data-language="English"]').addClass(
    "active-language",
  );

  $("#complaintText").attr(
    "placeholder",
    "Example: Garbage has not been collected in my area for the last 3 days.",
  );

  $("#resultLoading").hide();
  $("#resultCard").hide();

  clearStepErrors();
  goToStep(1);
}

function selectCategory($card) {
  let selectedCategory = $card.data("category");

  $("#reportWizard .category-card")
    .removeClass("selected-category")
    .attr("aria-pressed", "false");

  $card.addClass("selected-category").attr("aria-pressed", "true");

  $("#complaintCategory").val(selectedCategory);
  $("#selectedCategoryLabel").text(selectedCategory);

  clearStepErrors(1);
  updateNextButtonState();
}

function selectLanguage($button) {
  $("#reportWizard .language-btn").removeClass("active-language");

  $button.addClass("active-language");

  updateLanguagePlaceholder($button.data("language"));
}

function focusCurrentStepPanel() {
  let $panel = $("#wizardStep" + currentStep);

  if (currentStep === 1) {
    let $selected = $panel.find(".category-card.selected-category");

    if ($selected.length) {
      $selected.focus();

      return;
    }

    $panel.find(".category-card").first().focus();

    return;
  }

  if (currentStep === 2) {
    $("#complaintText").focus();

    return;
  }

  if (currentStep === 3) {
    $panel.find(".active-language").focus();

    return;
  }

  if (currentStep === 4) {
    $("#wizardNextBtn").focus();
  }
}

function advanceWizard() {
  if (currentStep === 4) {
    resetWizard();

    return;
  }

  if (!validateStep(currentStep)) {
    return;
  }

  if (currentStep === 3) {
    if (!validateStep(1)) {
      goToStep(1);
      updateNextButtonState();

      return;
    }

    if (!validateStep(2)) {
      goToStep(2);
      updateNextButtonState();

      return;
    }

    generateAndSaveComplaint();

    return;
  }

  clearStepErrors(currentStep);
  goToStep(currentStep + 1);
}

function goBackWizard() {
  if (currentStep > 1) {
    clearStepErrors(currentStep);
    goToStep(currentStep - 1);
  }
}

function initializeCategorySelection() {
  $("#reportWizard .category-card").each(function () {
    let $card = $(this);
    let label = $card.find("h4").text().trim();

    $card
      .attr("role", "button")
      .attr("tabindex", "0")
      .attr("aria-pressed", "false")
      .attr("aria-label", label);
  });

  $("#reportWizard .category-card").click(function () {
    selectCategory($(this));
  });
}

function updateCharacterCounterHint() {
  let length = $("#complaintText").val().length;
  let $hint = $("#characterMinHint");

  if (length > 0 && length < MIN_COMPLAINT_LENGTH) {
    let remaining = MIN_COMPLAINT_LENGTH - length;

    $hint.text(" — " + remaining + " more needed");
  } else {
    $hint.text("");
  }
}

function initializeCharacterCounter() {
  $("#complaintText").on("input", function () {
    $("#characterCount").text($(this).val().length);

    updateCharacterCounterHint();
    clearStepErrors(2);
    updateNextButtonState();
  });
}

function updateLanguagePlaceholder(language) {
  if (language === "English") {
    $("#complaintText").attr(
      "placeholder",
      "Example: Garbage has not been collected in my area for the last 3 days.",
    );
  } else if (language === "Roman Urdu") {
    $("#complaintText").attr(
      "placeholder",
      "Example: Mere area mein 3 din se kachra nahi uthaya gaya.",
    );
  } else {
    $("#complaintText").attr(
      "placeholder",
      "مثال: میرے علاقے میں 3 دن سے کچرا نہیں اٹھایا گیا۔",
    );
  }
}

function initializeLanguageSelection() {
  $("#reportWizard .language-btn").click(function () {
    selectLanguage($(this));
  });
}

function initializeKeyboardNavigation() {
  $("#reportWizard").on("keydown", function (event) {
    let key = event.key;
    let $target = $(event.target);
    let isTextarea = $target.is("#complaintText");

    if (isTextarea && key === "Enter" && event.ctrlKey) {
      event.preventDefault();
      advanceWizard();

      return;
    }

    if (isTextarea) {
      return;
    }

    if (key === "Escape" && currentStep > 1) {
      event.preventDefault();
      goBackWizard();

      return;
    }

    if (event.altKey && key === "ArrowLeft") {
      event.preventDefault();
      goBackWizard();

      return;
    }

    if (event.altKey && key === "ArrowRight") {
      event.preventDefault();
      advanceWizard();

      return;
    }

    if (
      key === "Enter" &&
      !$target.is("button") &&
      !$target.closest(".category-card").length
    ) {
      event.preventDefault();
      advanceWizard();
    }
  });

  $("#reportWizard .category-card").on("keydown", function (event) {
    let $cards = $("#reportWizard .category-card");
    let index = $cards.index(this);
    let key = event.key;

    if (key === "Enter" || key === " ") {
      event.preventDefault();
      selectCategory($(this));
      $("#wizardNextBtn").focus();

      return;
    }

    if (key === "ArrowRight" || key === "ArrowDown") {
      event.preventDefault();
      $cards.eq((index + 1) % $cards.length).focus();

      return;
    }

    if (key === "ArrowLeft" || key === "ArrowUp") {
      event.preventDefault();
      $cards.eq((index - 1 + $cards.length) % $cards.length).focus();

      return;
    }

    event.stopPropagation();
  });

  $("#reportWizard .language-btn").on("keydown", function (event) {
    let $buttons = $("#reportWizard .language-btn");
    let index = $buttons.index(this);
    let key = event.key;

    if (key === "ArrowRight" || key === "ArrowDown") {
      event.preventDefault();

      $buttons
        .eq((index + 1) % $buttons.length)
        .focus()
        .trigger("click");

      return;
    }

    if (key === "ArrowLeft" || key === "ArrowUp") {
      event.preventDefault();

      $buttons
        .eq((index - 1 + $buttons.length) % $buttons.length)
        .focus()
        .trigger("click");
    }
  });
}

function initializeWizard() {
  $("#wizardNextBtn")
    .off("click")
    .on("click", function () {
      advanceWizard();
    });

  $("#wizardPrevBtn")
    .off("click")
    .on("click", function () {
      goBackWizard();
    });

  updateProgressIndicator(1);
  updateNavigation(1);
  updateNextButtonState();
}

function applyCategoryFromUrl() {
  let urlParams = new URLSearchParams(window.location.search);

  let category = urlParams.get("category");

  if (!category) {
    return;
  }

  let safeCategory = category.replace(/"/g, '\\"');

  let categoryCard = $(
    '#reportWizard .category-card[data-category="' + safeCategory + '"]',
  );

  if (categoryCard.length) {
    selectCategory(categoryCard);
    updateNextButtonState();
  }
}
