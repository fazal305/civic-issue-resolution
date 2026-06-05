// Run code after page loads

$(document).ready(function () {
  // Load saved theme

  if (localStorage.getItem("civicTheme") === "light") {
    $("body").addClass("light-theme");

    $("#themeToggleBtn").text("☀️");
  }

  // Theme toggle

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

  // Category card click

  $(".category-card").click(function () {
    let selectedCategory = $(this).data("category");

    $("#complaintCategory").val(selectedCategory);

    $("html, body").animate(
      {
        scrollTop: $("#report-form").offset().top - 90,
      },
      700,
    );
  });

  // Language button click

  $(".language-btn").click(function () {

    $(".language-btn").removeClass("active-language");

    $(this).addClass("active-language");

    let selectedLanguage = $(this).data("language");

    if (selectedLanguage === "English") {

        $("#complaintText").attr(
            "placeholder",
            "Example: Garbage has not been collected in my area for the last 3 days."
        );

    }

    else if (selectedLanguage === "Roman Urdu") {

        $("#complaintText").attr(
            "placeholder",
            "Example: Mere area mein 3 din se kachra nahi uthaya gaya."
        );

    }

    else if (selectedLanguage === "Urdu") {

        $("#complaintText").attr(
            "placeholder",
            "مثال: میرے علاقے میں 3 دن سے کچرا نہیں اٹھایا گیا۔"
        );

    }

});

  // Complaint form submit

  $("#complaintForm").submit(function (event) {
    event.preventDefault();

    let category = $("#complaintCategory").val();

    let complaint = $("#complaintText").val();

    let language = $(".active-language").data("language");

    if (category === "" || complaint.trim() === "") {
      alert("Please select a category and write your complaint.");

      return;
    }

    $("#resultTitle").text(category + " Complaint Generated");

    $("#resultText").text(
      "Language: " + language + " | Complaint: " + complaint,
    );

    $("#resultCard").fadeIn(400);
  });

  // Scroll reveal animation

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
});
