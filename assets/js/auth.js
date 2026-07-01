$(document).ready(function () {
  if (typeof firebaseAuth === "undefined") {
    return;
  }

  function getCurrentUser() {
    return firebaseAuth.currentUser;
  }

  function isUserLoggedIn() {
    return getCurrentUser() !== null;
  }

  function getPageBasePath() {
    let currentPath = window.location.pathname.toLowerCase();

    if (currentPath.indexOf("/pages/") !== -1) {
      return "";
    }

    return "pages/";
  }

  function redirectToLogin() {
    window.location.href = getPageBasePath() + "login.html";
  }

  function redirectToDashboard() {
    window.location.href = getPageBasePath() + "complaints.html";
  }

  function logoutUser() {
    firebaseAuth
      .signOut()
      .then(function () {
        showToast("Logged out successfully.", "success");

        setTimeout(function () {
          redirectToLogin();
        }, 900);
      })
      .catch(function (error) {
        console.log(error);

        showToast("Could not log out. Please try again.", "danger");
      });
  }

  function watchAuthState() {
    firebaseAuth.onAuthStateChanged(function (user) {
      let currentPage = window.location.pathname.toLowerCase();

      if (
        user &&
        (currentPage.indexOf("login.html") !== -1 ||
          currentPage.indexOf("signup.html") !== -1)
      ) {
        redirectToDashboard();
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
        redirectToLogin();
      }, 900);
    });
  }

  function requireAdmin() {
    firebaseAuth.onAuthStateChanged(function (user) {
      if (!user) {
        showToast("Please login first.", "warning");

        setTimeout(function () {
          redirectToLogin();
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

            redirectToDashboard();

            return;
          }

          let userData = document.data();

          if (userData.role !== "admin") {
            showToast("Administrator access required.", "danger");

            setTimeout(function () {
              redirectToDashboard();
            }, 900);
          }
        })
        .catch(function (error) {
          console.log(error);

          showToast("Unable to verify permissions.", "danger");

          redirectToDashboard();
        });
    });
  }

  $("#logoutBtn").click(function () {
    logoutUser();
  });

  window.civicAuth = {
    getCurrentUser: getCurrentUser,
    isUserLoggedIn: isUserLoggedIn,
    logoutUser: logoutUser,
    requireLogin: requireLogin,
    requireAdmin: requireAdmin,
  };

  watchAuthState();
});
