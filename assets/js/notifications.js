$(document).ready(function () {
  let CIVIC_NOTIFICATIONS_KEY = "civicConnectNotifications";

  let MAX_NOTIFICATIONS = 20;

  function getStoredNotifications() {
    let storedNotifications = localStorage.getItem(CIVIC_NOTIFICATIONS_KEY);

    if (!storedNotifications) {
      return [];
    }

    try {
      return JSON.parse(storedNotifications);
    } catch {
      return [];
    }
  }

  function saveStoredNotifications(notifications) {
    localStorage.setItem(
      CIVIC_NOTIFICATIONS_KEY,
      JSON.stringify(notifications),
    );
  }

  function updateUnreadBadge(notifications) {
    let unreadCount = notifications.filter(function (notification) {
      return !notification.read;
    }).length;

    $("#notificationCount").text(unreadCount);

    $("#notificationCount").toggleClass("hidden", unreadCount === 0);
  }

  function addCivicNotification(message, type, complaintId) {
    let notifications = getStoredNotifications();

    notifications.unshift({
      id: Date.now(),

      message: message,

      type: type || "info",

      read: false,

      createdAt: new Date().toISOString(),

      complaintId: complaintId || "",
    });

    notifications = notifications.slice(0, MAX_NOTIFICATIONS);

    saveStoredNotifications(notifications);

    renderNotificationCenter();
  }

  function formatNotificationTime(dateString) {
    let notificationDate = new Date(dateString);

    let diffSeconds = Math.floor(
      (Date.now() - notificationDate.getTime()) / 1000,
    );

    if (diffSeconds < 60) {
      return "Just now";
    }

    if (diffSeconds < 3600) {
      return Math.floor(diffSeconds / 60) + " minute(s) ago";
    }

    if (diffSeconds < 86400) {
      return Math.floor(diffSeconds / 3600) + " hour(s) ago";
    }

    if (diffSeconds < 604800) {
      return Math.floor(diffSeconds / 86400) + " day(s) ago";
    }

    return notificationDate.toLocaleDateString();
  }

  function getNotificationIcon(type) {
    switch (type) {
      case "success":
        return "check-circle";

      case "warning":
        return "alert-triangle";

      case "danger":
        return "x-circle";

      default:
        return "info-circle";
    }
  }

  function markAllNotificationsRead() {
    let notifications = getStoredNotifications();

    notifications.forEach(function (notification) {
      notification.read = true;
    });

    saveStoredNotifications(notifications);

    renderNotificationCenter();
  }

  function renderNotificationCenter() {
    let notifications = getStoredNotifications();

    updateUnreadBadge(notifications);

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

            <span class="notification-icon notification-${notification.type || "info"}">

              ${civicIcon(getNotificationIcon(notification.type))}

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

  window.addCivicNotification = addCivicNotification;

  if ($("#notificationCenter").length === 0) {
    return;
  }

  renderNotificationCenter();

  $("#notificationBellBtn").click(function () {
    $("#notificationPanel").toggleClass("visible");

    markAllNotificationsRead();
  });

  $("#notificationList").on("click", ".notification-item", function () {
    let complaintId = $(this).data("complaint-id");

    if (!complaintId) {
      return;
    }

    window.location.href = "complaint-details.html?id=" + complaintId;
  });

  $("#clearAllNotificationsBtn").click(function () {
    localStorage.removeItem(CIVIC_NOTIFICATIONS_KEY);

    renderNotificationCenter();
  });

  $("#markAllReadBtn").click(function () {
    markAllNotificationsRead();
  });

  $(document).click(function (event) {
    if ($(event.target).closest("#notificationCenter").length === 0) {
      $("#notificationPanel").removeClass("visible");
    }
  });
});
