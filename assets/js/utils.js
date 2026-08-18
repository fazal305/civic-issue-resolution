/*
  CivicConnect Shared Utilities
*/

function escapeHtml(text) {
  if (text === null || text === undefined) {
    return "";
  }

  return $("<div>").text(text).html();
}

function formatComplaintDate(timestamp) {
  if (!timestamp) {
    return "N/A";
  }

  if (timestamp.toDate) {
    return timestamp.toDate().toLocaleDateString("en-PK", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return new Date(timestamp).toLocaleDateString("en-PK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getStatusClass(status) {
  if (status === "In Progress") {
    return "progress-status";
  }

  if (status === "Resolved") {
    return "resolved-status";
  }

  return "pending-status";
}

function getTranslatedCategory(category, language) {
  let categoryTranslations = {
    English: {
      Garbage: "Garbage Collection",
      Electricity: "Electricity",
      Water: "Water Supply",
      Gas: "Gas Supply",
      "Road Damage": "Road Damage",
    },

    "Roman Urdu": {
      Garbage: "Kachra",
      Electricity: "Bijli",
      Water: "Pani",
      Gas: "Gas",
      "Road Damage": "Sadak",
    },

    Urdu: {
      Garbage: "کچرا",
      Electricity: "بجلی",
      Water: "پانی",
      Gas: "گیس",
      "Road Damage": "سڑک",
    },
  };

  if (
    categoryTranslations[language] &&
    categoryTranslations[language][category]
  ) {
    return categoryTranslations[language][category];
  }

  return category;
}

function truncateText(text, limit) {
  if (!text) {
    return "";
  }

  if (text.length <= limit) {
    return text;
  }

  return text.substring(0, limit) + "...";
}

function showLoading($element, loadingText) {
  $element
    .data("original-text", $element.text())
    .text(loadingText || "Loading...")
    .prop("disabled", true);
}

function hideLoading($element) {
  let originalText = $element.data("original-text");

  $element.text(originalText || $element.text()).prop("disabled", false);
}
