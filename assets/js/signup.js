$(document).ready(function () {
  if ($("#signupForm").length === 0) {
    return;
  }

  if (typeof firebaseAuth === "undefined") {
    showToast("Authentication service is unavailable.", "danger");

    return;
  }

  function setSignupLoading(isLoading) {
    $("#signupBtn")
      .prop("disabled", isLoading)
      .text(isLoading ? "Creating Account..." : "Create Account");
  }

  function validateSignupForm(name, email, password) {
    if (name === "" || email === "" || password === "") {
      showToast("Please fill in all fields.", "warning");

      return false;
    }

    if (password.length < 6) {
      showToast("Password must be at least 6 characters.", "warning");

      return false;
    }

    return true;
  }

  function getSignupErrorMessage(errorCode) {
    switch (errorCode) {
      case "auth/email-already-in-use":
        return "An account with this email already exists.";

      case "auth/invalid-email":
        return "Please enter a valid email address.";

      case "auth/weak-password":
        return "Password must be at least 6 characters long.";

      case "auth/network-request-failed":
        return "Network error. Please check your internet connection.";

      default:
        return "Unable to create your account. Please try again.";
    }
  }

  $("#signupForm").submit(function (event) {
    event.preventDefault();

    let name = $("#signupName").val().trim();

    let email = $("#signupEmail").val().trim();

    let password = $("#signupPassword").val();

    if (!validateSignupForm(name, email, password)) {
      return;
    }

    setSignupLoading(true);

    firebaseAuth
      .createUserWithEmailAndPassword(email, password)
      .then(function (userCredential) {
        let newUser = userCredential.user;

        return newUser
          .updateProfile({
            displayName: name,
          })
          .then(function () {
            return firestoreDatabase.collection("users").doc(newUser.uid).set({
              name: name,

              email: email,

              role: "citizen",

              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            });
          });
      })
      .then(function () {
        showToast("Account created successfully. Please login.", "success");

        $("#signupForm")[0].reset();

        setTimeout(function () {
          window.location.href = "login.html";
        }, 1200);
      })
      .catch(function (error) {
        showToast(getSignupErrorMessage(error.code), "danger");
      })
      .then(function () {
        setSignupLoading(false);
      });
  });
});
