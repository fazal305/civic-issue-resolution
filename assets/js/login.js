$(document).ready(function () {
  if ($("#loginForm").length === 0) {
    return;
  }

  function setLoginLoading(isLoading) {
    if (isLoading) {
      $("#loginBtn").text("Logging In...").prop("disabled", true);
    } else {
      $("#loginBtn").text("Login").prop("disabled", false);
    }
  }

  function validateLoginForm(email, password) {
    if (email === "" || password === "") {
      showToast("Please enter your email and password.", "warning");

      return false;
    }

    return true;
  }

  $("#loginForm").submit(function (event) {
    event.preventDefault();

    let email = $("#loginEmail").val().trim();

    let password = $("#loginPassword").val();

    if (!validateLoginForm(email, password)) {
      return;
    }

    setLoginLoading(true);

    firebaseAuth
      .signInWithEmailAndPassword(email, password)
      .then(function () {
        showToast("Logged in successfully.", "success");

        setTimeout(function () {
          window.location.href = "complaints.html";
        }, 900);
      })
      .catch(function (error) {
        console.log(error);

        showToast(error.message, "danger");
      })
      .finally(function () {
        setLoginLoading(false);
      });
  });
});
