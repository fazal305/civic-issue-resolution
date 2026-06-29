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
      if (user) {
        console.log("Logged in:", user.email);
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
