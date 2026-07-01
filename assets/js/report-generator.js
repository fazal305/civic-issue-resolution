function generateComplaint(category, complaintText, language) {
  let generatedComplaint = "";

  if (language === "English") {
    generatedComplaint =
      "To the concerned authorities, I would like to report a " +
      category +
      " issue in my area. " +
      complaintText +
      ". This issue has been affecting the residents and requires immediate attention. I request prompt action. Thank you.";
  } else if (language === "Roman Urdu") {
    generatedComplaint =
      "Mutalliqah Adhikariyon ko, Main apne ilaake mein " +
      category +
      " ki masla report karna chahta hoon. " +
      complaintText +
      ". Yeh masla rehne walon ko affect kar raha hai aur fori tawajjoh ki zaroorat hai. Kripya jaldi action lein. Shukriya.";
  } else {
    generatedComplaint =
      "متعلقہ حکام کو، میں اپنے علاقے میں " +
      category +
      " کی مشکل رپورٹ کرنا چاہتا ہوں۔ " +
      complaintText +
      "۔ یہ مسئلہ مقامی لوگوں کو متاثر کر رہا ہے اور فوری توجہ کی ضرورت ہے۔ برائے کرم فوری اقدام کریں۔ شکریہ۔";
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
    return complaintsCollection.add({
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
    });
  });
}

function showResult(category, generatedComplaint) {
  $("#resultLoading").hide();

  $("#resultTitle").text("Complaint Saved Successfully ✅");

  $("#resultText").text(generatedComplaint);

  $("#resultCard").fadeIn(400);

  selectedComplaintImages = [];

  $("#imagePreviewGrid").html("");

  $("#complaintImages").val("");
}

function generateAndSaveComplaint() {
  let category = $("#complaintCategory").val();

  let complaintText = $("#complaintText").val().trim();

  let language = $("#reportWizard .active-language").data("language");

  let generatedComplaint = generateComplaint(category, complaintText, language);

  goToStep(4);

  $("#resultLoading").show();

  $("#resultCard").hide();

  $("#wizardNextBtn").prop("disabled", true);

  $("#wizardPrevBtn").prop("disabled", true);

  saveComplaint(category, complaintText, language, generatedComplaint)
    .then(function () {
      showResult(category, generatedComplaint);
    })
    .catch(function (error) {
      console.log(error);

      $("#resultLoading").hide();

      showToast("Could not save the complaint. Please try again.", "danger");

      goToStep(3);
    })
    .finally(function () {
      $("#wizardNextBtn").prop("disabled", false);

      $("#wizardPrevBtn").prop("disabled", false);

      updateNavigation(currentStep);
    });
}
