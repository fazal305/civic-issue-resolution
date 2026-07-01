$(document).ready(function () {
  function openReportPage(category) {
    window.location.href =
      "pages/report.html?category=" + encodeURIComponent(category);
  }

  function initializeHomeCategoryCards() {
    let $categoryCards = $(".category-section .category-card");

    $categoryCards.click(function (event) {
      if ($(event.target).closest(".category-btn").length) {
        return;
      }

      let selectedCategory = $(this).data("category");

      openReportPage(selectedCategory);
    });
  }

  if ($(".category-section .category-card").length) {
    initializeHomeCategoryCards();
  }
});
