function generateComplaint(category, complaintText, language) {
  let deferred = $.Deferred();

  if (
    typeof generateComplaintWithAi === "function" &&
    typeof puter !== "undefined" &&
    puter.ai
  ) {
    generateComplaintWithAi(category, complaintText, language)
      .then(function (aiComplaint) {
        deferred.resolve(aiComplaint);
      })
      .catch(function () {
        deferred.resolve(
          generateComplaintFallback(category, complaintText, language)
        );
      });
  } else {
    deferred.resolve(
      generateComplaintFallback(category, complaintText, language)
    );
  }

  return deferred.promise();
}

function generateComplaintFallback(category, complaintText, language) {
  let issueDescription = cleanComplaintText(
    complaintText,
    category,
    language
  );

  let categoryTranslations = {
    English: {
      Garbage: "Garbage Collection",
      Electricity: "Electricity",
      Water: "Water Supply",
      Gas: "Gas Supply",
      "Road Damage": "Road Damage"
    },

    "Roman Urdu": {
      Garbage: "Kachra",
      Electricity: "Bijli",
      Water: "Pani",
      Gas: "Gas",
      "Road Damage": "Sadak"
    },

    Urdu: {
      Garbage: "کچرا",
      Electricity: "بجلی",
      Water: "پانی",
      Gas: "گیس",
      "Road Damage": "سڑک"
    }
  };

  let translatedCategory =
    categoryTranslations[language][category] || category;

  if (language === "English") {
    return (
      "To: Concerned Department\n\n" +
      "Subject: Formal Complaint Regarding " +
      translatedCategory +
      "\n\n" +
      "Respected Sir/Madam,\n\n" +
      "I would like to formally report a civic issue regarding " +
      translatedCategory +
      " in my area.\n\n" +
      "Issue Details:\n" +
      issueDescription +
      "\n\n" +
      "This issue requires immediate attention. I kindly request your department to investigate and resolve the matter as soon as possible.\n\n" +
      "Thank you.\n\n" +
      "Yours faithfully,\nCitizen"
    );
  }

  if (language === "Roman Urdu") {
    return (
      "Mutaliqa Afsar Sahab,\n\n" +
      "Subject: " +
      translatedCategory +
      " ki Shikayat\n\n" +
      "Adaab,\n\n" +
      "Main apne ilaqay mein " +
      translatedCategory +
      " se mutaliq aik shikayat darj karwana chahta hoon.\n\n" +
      "Maslay ki Tafseel:\n" +
      issueDescription +
      "\n\n" +
      "Barah-e-karam is maslay ko jald az jald hal karne ke liye zaroori iqdamat kiye jayen.\n\n" +
      "Shukriya.\n\n" +
      "Darkhwast Guzar"
    );
  }

  return (
    "متعلقہ افسر صاحب،\n\n" +
    "موضوع: " +
    translatedCategory +
    " سے متعلق شکایت\n\n" +
    "السلام علیکم،\n\n" +
    "میں اپنے علاقے میں " +
    translatedCategory +
    " سے متعلق ایک شکایت درج کروانا چاہتا ہوں۔\n\n" +
    "مسئلے کی تفصیل:\n" +
    issueDescription +
    "\n\n" +
    "براہ کرم اس مسئلے کو جلد از جلد حل کرنے کے لیے مناسب کارروائی کی جائے۔\n\n" +
    "شکریہ۔\n\n" +
    "درخواست گزار"
  );
}

function saveComplaint(category, complaintText, language, generatedComplaint) {
  let currentUser = firebaseAuth.currentUser;

  if (!currentUser) {
    showToast("Please login before submitting a complaint.", "warning");

    return $.Deferred().reject().promise();
  }

  return uploadComplaintImages().then(function (imageUrls) {
    let complaintData = {
      uid: currentUser.uid,
      userEmail: currentUser.email,
      userName: currentUser.displayName || "Citizen",
      category: category,
      complaintText: complaintText,
      language: language,
      generatedComplaint: generatedComplaint,
      imageUrls: imageUrls,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      status: "Pending",
      location: $("#complaintLocation").val() || "Karachi",
      latitude: $("#complaintLatitude").val(),
      longitude: $("#complaintLongitude").val()
    };

    return civicFirestoreService.createComplaint(complaintData);
  });
}

function resetImageUploadState() {
  selectedComplaintImages = [];

  $("#imagePreviewGrid").html("");

  $("#complaintImages").val("");
}

function showResult(category, generatedComplaint) {
  $("#resultLoading").hide();

  $("#resultTitle").text("Complaint Saved Successfully ✅");

  $("#resultText").text(generatedComplaint);

  showDepartmentGuide(category);

  $("#resultCard").fadeIn(400);

  resetImageUploadState();
}

function setWizardSubmitting(isSubmitting) {
  $("#wizardNextBtn").prop("disabled", isSubmitting);

  $("#wizardPrevBtn").prop("disabled", isSubmitting);
}

function generateAndSaveComplaint() {
  let category = $("#complaintCategory").val();

  let complaintText = $("#complaintText").val().trim();

  let language = $("#reportWizard .active-language").data("language");

  goToStep(4);

  $("#resultLoading").show();

  $("#resultCard").hide();

  setWizardSubmitting(true);

  generateComplaint(category, complaintText, language)
    .then(function (generatedComplaint) {
      return saveComplaint(
        category,
        complaintText,
        language,
        generatedComplaint
      ).then(function () {
        showResult(category, generatedComplaint);
      });
    })
    .catch(function () {
      $("#resultLoading").hide();

      showToast("Could not generate or save the complaint.", "danger");

      goToStep(3);
    })
    .then(function () {
      setWizardSubmitting(false);

      updateNavigation(currentStep);
    });
}