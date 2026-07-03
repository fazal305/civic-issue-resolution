function generateComplaint(category, complaintText, language) {
  let deferred = $.Deferred();

  let categoryTranslations = {
    English: {
      Garbage: "Garbage Collection",
      Electricity: "Electricity",
      Water: "Water Supply",
      Gas: "Gas Supply",
      "Road Damage": "Road Damage",
    },

    "Roman Urdu": {
      Garbage: "Kachra",
      Electricity: "Bijli",
      Water: "Pani",
      Gas: "Gas",
      "Road Damage": "Sadak",
    },

    Urdu: {
      Garbage: "کچرا",
      Electricity: "بجلی",
      Water: "پانی",
      Gas: "گیس",
      "Road Damage": "سڑک",
    },
  };

  let translatedCategory =
    (categoryTranslations[language] &&
      categoryTranslations[language][category]) ||
    category;

  let issueDescription = cleanComplaintText(
    complaintText,
    category,
    language,
  );

  let complaint = "";

  if (language === "English") {
    complaint =
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
      "This issue has caused considerable inconvenience to local residents and requires immediate attention. I kindly request your department to investigate the matter and take appropriate action as soon as possible.\n\n" +
      "Thank you for your time and cooperation.\n\n" +
      "Yours faithfully,\n\n" +
      "Citizen";
  }

  else if (language === "Roman Urdu") {
    complaint =
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
      "Yeh masla ilaqay ke rehne walon ke liye rozana mushkilat paida kar raha hai. Barah-e-karam is maslay ko jald az jald hal karne ke liye zaroori iqdamat kiye jayen.\n\n" +
      "Aap ke taawun ka shukriya.\n\n" +
      "Darkhwast Guzar";
  }

  else {
    complaint =
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
      "یہ مسئلہ علاقے کے رہائشیوں کے لیے شدید پریشانی کا باعث بن رہا ہے۔ براہ کرم جلد از جلد مناسب کارروائی کرتے ہوئے اس مسئلے کو حل کیا جائے۔\n\n" +
      "آپ کے تعاون کا شکریہ۔\n\n" +
      "درخواست گزار";
  }

  deferred.resolve(complaint);

  return deferred.promise();
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
      longitude: $("#complaintLongitude").val(),
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

  $("#wizardNextBtn").prop("disabled", true);

  $("#wizardPrevBtn").prop("disabled", true);

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
    .catch(function (error) {
      console.log(error);

      $("#resultLoading").hide();

      showToast(
        "Unable to generate the complaint. Please try again.",
        "danger"
      );

      goToStep(3);
    })
    .finally(function () {
      $("#wizardNextBtn").prop("disabled", false);

      $("#wizardPrevBtn").prop("disabled", false);

      updateNavigation(currentStep);
    });
}