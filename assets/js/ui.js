function showToast(message, type) {
  let icon = "ℹ️";
  let title = "Information";
  let toastType = type || "info";

  if (toastType === "success") {
    icon = "✅";
    title = "Success";
  } else if (toastType === "warning") {
    icon = "⚠️";
    title = "Warning";
  } else if (toastType === "danger") {
    icon = "❌";
    title = "Error";
  }

  let toastId = "toast-" + Date.now();

  let toastHtml =
    '<div id="' +
    toastId +
    '" class="toast civic-toast ' +
    toastType +
    '" role="alert" data-bs-delay="4000">' +
    '<div class="toast-header">' +
    '<span class="toast-icon">' +
    icon +
    "</span>" +
    '<strong class="me-auto">' +
    title +
    "</strong>" +
    "<small>Just now</small>" +
    '<button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>' +
    "</div>" +
    '<div class="toast-body">' +
    message +
    "</div>" +
    "</div>";

  $("#toastContainer").append(toastHtml);

  let toastElement = document.getElementById(toastId);
  let bootstrapToast = new bootstrap.Toast(toastElement);

  bootstrapToast.show();

  $(toastElement).on("hidden.bs.toast", function () {
    $(this).remove();
  });
}

function initializeTheme() {
  if (localStorage.getItem("civicTheme") === "light") {
    $("body").addClass("light-theme");
    $("#themeToggleBtn").text("☀️");
  }

  $("#themeToggleBtn").click(function () {
    $("body").toggleClass("light-theme");

    if ($("body").hasClass("light-theme")) {
      $(this).text("☀️");
      localStorage.setItem("civicTheme", "light");
    } else {
      $(this).text("🌙");
      localStorage.setItem("civicTheme", "dark");
    }
  });
}

function initializeScrollReveal() {
  function revealSections() {
    $(".reveal-section").each(function () {
      let sectionTop = $(this).offset().top;
      let scrollTop = $(window).scrollTop();
      let windowHeight = $(window).height();

      if (scrollTop + windowHeight > sectionTop + 100) {
        $(this).addClass("show-section");
      }
    });
  }

  revealSections();

  $(window).scroll(function () {
    revealSections();
  });
}

$(document).ready(function () {
  initializeTheme();

  if ($(".reveal-section").length) {
    initializeScrollReveal();
  }
});
