$(document).ready(function () {
  if (typeof firebaseAuth === "undefined") {
    console.log("Firebase Auth is not loaded on this page.");

    return;
  }

  function getCurrentUser() {
    return firebaseAuth.currentUser;
  }

  function isUserLoggedIn() {
    return getCurrentUser() !== null;
  }

  function logoutUser() {
    firebaseAuth
      .signOut()
      .then(function () {
        showToast("Logged out successfully.", "success");
      })
      .catch(function (error) {
        console.log(error);

        showToast("Could not log out. Please try again.", "danger");
      });
  }

  function watchAuthState() {
    firebaseAuth.onAuthStateChanged(function (user) {
      let currentPage = window.location.pathname.toLowerCase();

      if (user) {
        console.log("Logged in:", user.email);

        if (
          currentPage.indexOf("login.html") !== -1 ||
          currentPage.indexOf("signup.html") !== -1
        ) {
          window.location.href = "complaints.html";
        }
      } else {
        console.log("No user logged in.");
      }
    });
  }

  window.civicAuth = {
    getCurrentUser: getCurrentUser,
    isUserLoggedIn: isUserLoggedIn,
    logoutUser: logoutUser,
  };

  watchAuthState();
});
