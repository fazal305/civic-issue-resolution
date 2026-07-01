$(document).ready(function () {
  if ($("#adminTableWrap").length === 0) {
    return;
  }

  let adminComplaints = [];

  function updateAdminStats() {
    let total = adminComplaints.length;

    let pending = adminComplaints.filter(function (complaint) {
      return complaint.status === "Pending";
    }).length;

    let progress = adminComplaints.filter(function (complaint) {
      return complaint.status === "In Progress";
    }).length;

    let resolved = adminComplaints.filter(function (complaint) {
      return complaint.status === "Resolved";
    }).length;

    $("#adminTotalCount").text(total);

    $("#adminPendingCount").text(pending);

    $("#adminProgressCount").text(progress);

    $("#adminResolvedCount").text(resolved);
  }

  function buildStatusOptions(currentStatus) {
    let statuses = ["Pending", "In Progress", "Resolved"];

    let optionsHtml = "";

    statuses.forEach(function (status) {
      let selected = "";

      if (status === currentStatus) {
        selected = "selected";
      }

      optionsHtml += `

        <option
          value="${status}"
          ${selected}>

          ${status}

        </option>

      `;
    });

    return optionsHtml;
  }

  function getImageCount(complaint) {
    if (complaint.imageUrls && complaint.imageUrls.length) {
      return complaint.imageUrls.length;
    }

    return 0;
  }

  function buildAdminTable() {
    if (adminComplaints.length === 0) {
      $("#adminTableWrap").html(`

        <p class="about-text">

          No complaints have been submitted yet.

        </p>

      `);

      return;
    }

    let tableHtml = `

      <table class="admin-table">

        <thead>

          <tr>

            <th>Category</th>

            <th>Complaint</th>

            <th>Language</th>

            <th>Location</th>

            <th>Coordinates</th>

            <th>Photos</th>

            <th>Date</th>

            <th>Status</th>

          </tr>

        </thead>

        <tbody>

    `;

    adminComplaints.forEach(function (complaint) {
      tableHtml += `

        <tr>

          <td>

            ${escapeHtml(complaint.category || "N/A")}

          </td>

          <td>

            ${escapeHtml((complaint.complaintText || "").substring(0, 80))}...

          </td>

          <td>

            ${escapeHtml(complaint.language || "English")}

          </td>

          <td>

            ${escapeHtml(complaint.location || "Karachi")}

          </td>

          <td>

            ${escapeHtml(complaint.latitude || "N/A")},
            ${escapeHtml(complaint.longitude || "N/A")}

          </td>

          <td>

            ${getImageCount(complaint)}

          </td>

          <td>

            ${formatComplaintDate(complaint.timestamp)}

          </td>

          <td>

            <select
              class="form-control dashboard-input admin-status-select"
              data-id="${complaint.id}">

              ${buildStatusOptions(complaint.status || "Pending")}

            </select>

          </td>

        </tr>

      `;
    });

    tableHtml += `

        </tbody>

      </table>

    `;

    $("#adminTableWrap").html(tableHtml);
  }

  function loadAdminComplaints() {
    $("#adminTableWrap").html(`

      <p class="about-text">

        Loading complaints...

      </p>

    `);

    civicFirestoreService.listenAllComplaints(
      function (snapshot) {
        adminComplaints = [];

        snapshot.forEach(function (doc) {
          let complaintData = doc.data();

          complaintData.id = doc.id;

          adminComplaints.push(complaintData);
        });

        updateAdminStats();

        buildAdminTable();
      },

      function (error) {
        console.log(error);

        showToast("Could not load admin complaints.", "danger");

        $("#adminTableWrap").html(`

          <p class="about-text">

            Could not load complaints. Please refresh the page.

          </p>

        `);
      },
    );
  }

  function updateComplaintStatus(complaintId, newStatus) {
    civicFirestoreService
      .updateComplaintStatus(complaintId, newStatus)
      .then(function () {
        showToast("Complaint status updated.", "success");
      })
      .catch(function (error) {
        console.log(error);

        showToast("Could not update complaint status.", "danger");
      });
  }

  $("#adminTableWrap").on("change", ".admin-status-select", function () {
    let complaintId = $(this).data("id");

    let newStatus = $(this).val();

    updateComplaintStatus(complaintId, newStatus);
  });

  loadAdminComplaints();
});
