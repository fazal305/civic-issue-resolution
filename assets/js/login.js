$(document).ready(function () {
  if ($("#loginForm").length === 0) {
    return;
  }

  if (typeof firebaseAuth === "undefined") {
    showToast("Authentication service is unavailable.", "danger");

    return;
  }

  function validateLoginForm(email, password) {
    if (email === "" || password === "") {
      showToast("Please enter your email and password.", "warning");

      return false;
    }

    return true;
  }

  function getLoginErrorMessage(errorCode) {
    switch (errorCode) {
      case "auth/user-not-found":
      case "auth/wrong-password":
      case "auth/invalid-credential":
        return "Incorrect email or password.";

      case "auth/invalid-email":
        return "Please enter a valid email address.";

      case "auth/too-many-requests":
        return "Too many login attempts. Please try again later.";

      case "auth/network-request-failed":
        return "Network error. Please check your internet connection.";

      default:
        return "Unable to sign in. Please try again.";
    }
  }

  $("#loginForm").submit(function (event) {
    event.preventDefault();

    let email = $("#loginEmail").val().trim();

    let password = $("#loginPassword").val();

    if (!validateLoginForm(email, password)) {
      return;
    }

    showLoading($("#loginBtn"), "Logging In...");

    firebaseAuth
      .signInWithEmailAndPassword(email, password)
      .then(function () {
        showToast("Logged in successfully.", "success");

        setTimeout(function () {
          let redirectPage = sessionStorage.getItem("civicRedirectAfterLogin");

          if (redirectPage) {
            sessionStorage.removeItem("civicRedirectAfterLogin");

            window.location.href = redirectPage;
          } else {
            window.location.href = "complaints.html";
          }
        }, 900);
      })
      .catch(function (error) {
        showToast(getLoginErrorMessage(error.code), "danger");
      })
      .then(function () {
        hideLoading($("#loginBtn"));
      });
  });
});
