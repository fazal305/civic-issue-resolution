function initializeHomeCategoryCards() {
  $(".category-section .category-card").click(function (event) {
    if ($(event.target).closest(".category-btn").length) {
      return;
    }

    let selectedCategory = $(this).data("category");

    window.location.href =
      "pages/report.html?category=" + encodeURIComponent(selectedCategory);
  });
}

$(document).ready(function () {
  if ($(".category-section .category-card").length) {
    initializeHomeCategoryCards();
  }
});
