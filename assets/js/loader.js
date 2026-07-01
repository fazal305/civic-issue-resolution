$(document).ready(function () {
  let loaderElement = document.getElementById("pageLoader");

  let loaderHidden = false;

  function hideLoader() {
    if (loaderHidden) {
      return;
    }

    loaderHidden = true;

    if (!loaderElement) {
      return;
    }

    loaderElement.classList.add("loader-hidden");

    setTimeout(function () {
      if (loaderElement && loaderElement.parentNode) {
        loaderElement.parentNode.removeChild(loaderElement);
      }
    }, 450);
  }

  function initializeLoader() {
    /*
      Hide shortly after DOM is ready.
      This prevents the loader getting stuck forever if
      another script crashes.
    */

    setTimeout(function () {
      hideLoader();
    }, 1200);

    /*
      Hide immediately once everything has loaded.
    */

    $(window).on("load", function () {
      hideLoader();
    });

    /*
      Safety timeout.
      Even if a CDN, Firebase or image hangs forever,
      never leave the user staring at the loader.
    */

    setTimeout(function () {
      hideLoader();
    }, 5000);
  }

  initializeLoader();
});
