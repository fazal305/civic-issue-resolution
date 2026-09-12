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

  let sessionExpiredNotified = false;

  function isSessionExpiredErrorCode(errorCode) {
    switch (errorCode) {
      case "auth/user-token-expired":
      case "auth/requires-recent-login":
      case "auth/invalid-user-token":
      case "auth/user-disabled":
        return true;

      default:
        return false;
    }
  }

  function handleSessionExpired() {
    if (sessionExpiredNotified) {
      return;
    }

    sessionExpiredNotified = true;

    sessionStorage.removeItem("civicWasAuthenticated");

    showToast("Your session has expired — please log in again.", "danger");

    setTimeout(function () {
      redirectToLogin();
    }, 900);
  }

  function logoutUser() {
    sessionStorage.removeItem("civicWasAuthenticated");

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

  function updateAuthOnlyNav(user) {
    if (!user) {
      $(".nav-auth-only").addClass("d-none");

      $(".nav-admin-only").addClass("d-none");

      $(".nav-guest-only").removeClass("d-none");

      return;
    }

    $(".nav-auth-only").removeClass("d-none");

    $(".nav-guest-only").addClass("d-none");

    firestoreDatabase
      .collection("users")
      .doc(user.uid)
      .get()
      .then(function (document) {
        if (document.exists && document.data().role === "admin") {
          $(".nav-admin-only").removeClass("d-none");
        } else {
          $(".nav-admin-only").addClass("d-none");
        }
      })
      .catch(function () {
        $(".nav-admin-only").addClass("d-none");
      });
  }

  function watchAuthState() {
    firebaseAuth.onAuthStateChanged(function (user) {
      updateAuthOnlyNav(user);

      let currentPage = window.location.pathname.toLowerCase();

      let onAuthOnlyPage =
        currentPage.indexOf("login.html") !== -1 ||
        currentPage.indexOf("signup.html") !== -1;

      if (user) {
        sessionExpiredNotified = false;

        sessionStorage.setItem("civicWasAuthenticated", "1");

        if (onAuthOnlyPage) {
          redirectToDashboard();
        }

        return;
      }

      if (
        sessionStorage.getItem("civicWasAuthenticated") === "1" &&
        !onAuthOnlyPage
      ) {
        handleSessionExpired();
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

      if (
        sessionExpiredNotified ||
        sessionStorage.getItem("civicWasAuthenticated") === "1"
      ) {
        handleSessionExpired();

        return;
      }

      showToast("Please login to continue.", "warning");

      setTimeout(function () {
        redirectToLogin();
      }, 900);
    });
  }

  function requireAdmin() {
    firebaseAuth.onAuthStateChanged(function (user) {
      if (!user) {
        if (
          sessionExpiredNotified ||
          sessionStorage.getItem("civicWasAuthenticated") === "1"
        ) {
          handleSessionExpired();

          return;
        }

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
    isSessionExpiredErrorCode: isSessionExpiredErrorCode,
    handleSessionExpired: handleSessionExpired,
  };

  watchAuthState();
});
