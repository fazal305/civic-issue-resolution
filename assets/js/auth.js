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
        setTimeout(function () {
          window.location.href = "login.html";
        }, 900);
      })
      .catch(function (error) {
        console.log(error);

        showToast("Could not log out. Please try again.", "danger");
      });
  }
  $("#logoutBtn").click(function () {
    logoutUser();
  });
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

  function requireLogin() {
    firebaseAuth.onAuthStateChanged(function (user) {
      if (user) {
        return;
      }

      sessionStorage.setItem(
        "civicRedirectAfterLogin",
        window.location.pathname + window.location.search,
      );

      showToast("Please login to continue.", "warning");

      setTimeout(function () {
        window.location.href = "login.html";
      }, 900);
    });
  }

  function requireAdmin() {
    firebaseAuth.onAuthStateChanged(function (user) {
      if (!user) {
        showToast("Please login first.", "warning");

        setTimeout(function () {
          window.location.href = "login.html";
        }, 900);

        return;
      }

      firestoreDatabase
        .collection("users")
        .doc(user.uid)
        .get()
        .then(function (document) {
          if (!document.exists) {
            showToast("User profile not found.", "danger");

            window.location.href = "complaints.html";

            return;
          }

          let userData = document.data();

          if (userData.role !== "admin") {
            showToast("Administrator access required.", "danger");

            setTimeout(function () {
              window.location.href = "complaints.html";
            }, 900);
          }
        })
        .catch(function (error) {
          console.log(error);

          showToast("Unable to verify permissions.", "danger");

          window.location.href = "complaints.html";
        });
    });
  }

  window.civicAuth = {
    getCurrentUser: getCurrentUser,
    isUserLoggedIn: isUserLoggedIn,
    logoutUser: logoutUser,
    requireLogin: requireLogin,
    requireAdmin: requireAdmin,
  };

  watchAuthState();
});
