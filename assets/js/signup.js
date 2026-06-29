$(document).ready(function () {
  if ($("#signupForm").length === 0) {
    return;
  }

  function setSignupLoading(isLoading) {
    if (isLoading) {
      $("#signupBtn").text("Creating Account...").prop("disabled", true);
    } else {
      $("#signupBtn").text("Create Account").prop("disabled", false);
    }
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
        return userCredential.user.updateProfile({
          displayName: name,
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
        console.log(error);

        showToast(error.message, "danger");
      })
      .finally(function () {
        setSignupLoading(false);
      });
  });
});
