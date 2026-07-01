let CIVIC_NOTIFICATIONS_KEY = "civicConnectNotifications";

function getStoredNotifications() {
  let storedNotifications = localStorage.getItem(CIVIC_NOTIFICATIONS_KEY);

  if (!storedNotifications) {
    return [];
  }

  try {
    return JSON.parse(storedNotifications);
  } catch (error) {
    console.log(error);

    return [];
  }
}

function saveStoredNotifications(notifications) {
  localStorage.setItem(CIVIC_NOTIFICATIONS_KEY, JSON.stringify(notifications));
}

function addCivicNotification(message, type, complaintId) {
  let notifications = getStoredNotifications();

  let notification = {
    id: Date.now(),

    message: message,

    type: type || "info",

    read: false,

    createdAt: new Date().toISOString(),

    complaintId: complaintId || "",
  };

  notifications.unshift(notification);

  notifications = notifications.slice(0, 20);

  saveStoredNotifications(notifications);

  renderNotificationCenter();

  return notification;
}

function formatNotificationTime(dateString) {
  let notificationDate = new Date(dateString);

  let now = new Date();

  let diffMs = now - notificationDate;

  let diffSeconds = Math.floor(diffMs / 1000);

  let diffMinutes = Math.floor(diffSeconds / 60);

  let diffHours = Math.floor(diffMinutes / 60);

  let diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) {
    return "Just now";
  }

  if (diffMinutes < 60) {
    return diffMinutes + " minute(s) ago";
  }

  if (diffHours < 24) {
    return diffHours + " hour(s) ago";
  }

  if (diffDays < 7) {
    return diffDays + " day(s) ago";
  }

  return notificationDate.toLocaleDateString();
}
function getNotificationIcon(type) {
  if (type === "success") {
    return "✅";
  }

  if (type === "warning") {
    return "⚠️";
  }

  if (type === "danger") {
    return "❌";
  }

  return "ℹ️";
}
function renderNotificationCenter() {
  let notifications = getStoredNotifications();

  let unreadCount = notifications.filter(function (notification) {
    return !notification.read;
  }).length;

  $("#notificationCount").text(unreadCount);

  if (unreadCount === 0) {
    $("#notificationCount").addClass("hidden");
  } else {
    $("#notificationCount").removeClass("hidden");
  }

  if (notifications.length === 0) {
    $("#notificationList").html(`

      <p class="notification-empty">

        No notifications yet.

      </p>

    `);

    return;
  }

  let html = "";

  notifications.forEach(function (notification) {
    html += `

  <div
    class="notification-item ${notification.read ? "" : "unread"}"
    data-complaint-id="${notification.complaintId}">

       <div class="notification-message">

  <span class="notification-icon">

    ${getNotificationIcon(notification.type)}

  </span>

  <span>

    ${$("<div>").text(notification.message).html()}

  </span>

</div>

        <div class="notification-time">

          ${formatNotificationTime(notification.createdAt)}

        </div>

      </div>

    `;
  });

  $("#notificationList").html(html);
}

$(document).ready(function () {
  if ($("#notificationCenter").length === 0) {
    return;
  }

  renderNotificationCenter();
  $("#notificationList").on("click", ".notification-item", function () {
    let complaintId = $(this).data("complaint-id");

    if (!complaintId) {
      return;
    }

    window.location.href = "complaint-details.html?id=" + complaintId;
  });
  $("#notificationBellBtn").click(function () {
    $("#notificationPanel").toggleClass("visible");

    let notifications = getStoredNotifications();

    notifications.forEach(function (notification) {
      notification.read = true;
    });

    saveStoredNotifications(notifications);

    renderNotificationCenter();
  });
  $("#clearAllNotificationsBtn").click(function () {
    localStorage.removeItem(CIVIC_NOTIFICATIONS_KEY);

    renderNotificationCenter();
  });
  $("#markAllReadBtn").click(function () {
    let notifications = getStoredNotifications();

    notifications.forEach(function (notification) {
      notification.read = true;
    });

    saveStoredNotifications(notifications);

    renderNotificationCenter();
  });

  $(document).click(function (event) {
    if ($(event.target).closest("#notificationCenter").length === 0) {
      $("#notificationPanel").removeClass("visible");
    }
  });
});
