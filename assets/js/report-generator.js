function generateComplaint(category, complaintText, language) {
  let generatedComplaint = "";

  if (language === "English") {
    generatedComplaint =
      "To the concerned authorities,\n\n" +
      "I would like to report a " +
      category +
      " issue in my area. " +
      complaintText +
      ". This issue is affecting local residents and requires immediate attention.\n\n" +
      "I request the concerned department to take prompt action.\n\n" +
      "Thank you.";
  } else if (language === "Roman Urdu") {
    generatedComplaint =
      "Mutalliqah idaray ke naam,\n\n" +
      "Main apne ilaqay mein " +
      category +
      " ka masla report karna chahta hoon. " +
      complaintText +
      ". Yeh masla ilaqay ke logon ko mutasir kar raha hai aur is par fori tawajjoh ki zaroorat hai.\n\n" +
      "Barah-e-karam is maslay par jald az jald action liya jaye.\n\n" +
      "Shukriya.";
  } else {
    generatedComplaint =
      "متعلقہ ادارے کے نام،\n\n" +
      "میں اپنے علاقے میں " +
      category +
      " کا مسئلہ رپورٹ کرنا چاہتا ہوں۔ " +
      complaintText +
      "۔ یہ مسئلہ مقامی رہائشیوں کو متاثر کر رہا ہے اور اس پر فوری توجہ کی ضرورت ہے۔\n\n" +
      "براہِ کرم اس مسئلے پر جلد از جلد کارروائی کی جائے۔\n\n" +
      "شکریہ۔";
  }

  return generatedComplaint;
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

  let generatedComplaint = generateComplaint(category, complaintText, language);

  goToStep(4);

  $("#resultLoading").show();

  $("#resultCard").hide();

  setWizardSubmitting(true);

  saveComplaint(category, complaintText, language, generatedComplaint)
    .then(function () {
      showResult(category, generatedComplaint);
    })
    .catch(function () {
      $("#resultLoading").hide();

      showToast("Could not save the complaint. Please try again.", "danger");

      goToStep(3);
    })
    .then(function () {
      setWizardSubmitting(false);

      updateNavigation(currentStep);
    });
}
