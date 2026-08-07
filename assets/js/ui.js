//
// Escape HTML
//

function escapeToastHtml(text) {
  if (!text) {
    return "";
  }

  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

//
// Toast Notifications
//

function showToast(message, type) {
  let toastType = type || "info";

  let toastData = {
    icon: "info-circle",
    title: "Information",
  };

  if (toastType === "success") {
    toastData.icon = "check-circle";
    toastData.title = "Success";
  } else if (toastType === "warning") {
    toastData.icon = "alert-triangle";
    toastData.title = "Warning";
  } else if (toastType === "danger") {
    toastData.icon = "x-circle";
    toastData.title = "Error";
  }

  if ($("#toastContainer").length === 0 || typeof bootstrap === "undefined") {
    return;
  }

  let toastId = "toast-" + Date.now();

  let toastHtml = `

    <div
      id="${toastId}"
      class="toast civic-toast ${toastType}"
      role="alert"
      data-bs-delay="4000">

      <div class="toast-header">

        <span class="toast-icon toast-${toastType}">

          ${civicIcon(toastData.icon)}

        </span>

        <strong class="me-auto">

          ${toastData.title}

        </strong>

        <small>

          Just now

        </small>

        <button
          type="button"
          class="btn-close btn-close-white"
          data-bs-dismiss="toast">

        </button>

      </div>

      <div class="toast-body">

        ${escapeToastHtml(message)}

      </div>

    </div>

  `;

  $("#toastContainer").append(toastHtml);

  let toastElement = document.getElementById(toastId);

  let bootstrapToast = new bootstrap.Toast(toastElement);

  bootstrapToast.show();

  $(toastElement).on("hidden.bs.toast", function () {
    $(this).remove();
  });
}

//
// Scroll Reveal
//

function initializeScrollReveal() {
  let revealQueued = false;

  function revealSections() {
    $(".reveal-section").each(function () {
      let sectionTop = $(this).offset().top;

      let scrollTop = $(window).scrollTop();

      let windowHeight = $(window).height();

      if (scrollTop + windowHeight > sectionTop + 100) {
        $(this).addClass("show-section");
      }
    });

    revealQueued = false;
  }

  revealSections();

  $(window)
    .off("scroll.civicReveal")
    .on("scroll.civicReveal", function () {
      if (revealQueued) {
        return;
      }

      revealQueued = true;

      window.requestAnimationFrame(revealSections);
    });
}

//
// Initialize Shared UI
//

$(document).ready(function () {
  if ($(".reveal-section").length) {
    initializeScrollReveal();
  }
});
