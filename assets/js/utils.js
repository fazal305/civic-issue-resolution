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
    return timestamp.toDate().toLocaleString();
  }

  return new Date(timestamp).toLocaleString();
}

function getStatusClass(status) {
  switch (status) {
    case "Pending":
      return "pending-status";

    case "In Progress":
      return "progress-status";

    case "Resolved":
      return "resolved-status";

    default:
      return "pending-status";
  }
}

function showLoading($element) {
  $element.prop("disabled", true);
}

function hideLoading($element) {
  $element.prop("disabled", false);
}
