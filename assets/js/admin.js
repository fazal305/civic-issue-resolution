$(document).ready(function () {
  /*
    Stop if admin dashboard is not on this page
  */

  if ($("#adminTableWrap").length === 0) {
    return;
  }

  /*
    Admin state
  */

  let adminComplaints = [];

  let filteredComplaints = [];

  let expandedComplaintId = "";

  /*
    Create admin controls if missing
  */

  function ensureAdminControls() {
    if ($("#adminControls").length !== 0) {
      return;
    }

    $("#adminTableWrap").before(`

      <div
        class="admin-actions-bar"
        id="adminControls">

        <div class="admin-filter-grid">

          <input
            type="text"
            class="dashboard-input"
            id="adminSearchInput"
            placeholder="Search complaints or category">

          <select
            class="dashboard-input"
            id="adminCategoryFilter">

            <option value="All">All Categories</option>
            <option value="Garbage">Garbage</option>
            <option value="Electricity">Electricity</option>
            <option value="Water">Water</option>
            <option value="Gas">Gas</option>
            <option value="Road Damage">Road Damage</option>

          </select>

          <select
            class="dashboard-input"
            id="adminStatusFilter">

            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>

          </select>

        </div>

        <button
          type="button"
          class="hero-btn"
          id="adminDownloadCsvBtn">

          Download CSV

        </button>

      </div>

    `);
  }

  /*
    Helpers
  */

  function getSafeStatus(status) {
    if (status === "Resolved") {
      return "Resolved";
    }

    if (status === "In Progress") {
      return "In Progress";
    }

    return "Pending";
  }

  function getStatusClass(status) {
    if (status === "Resolved") {
      return "resolved-status";
    }

    if (status === "In Progress") {
      return "progress-status";
    }

    return "pending-status";
  }

  function getComplaintText(complaint) {
    return (
      complaint.generatedComplaint ||
      complaint.complaintText ||
      "No complaint text available."
    );
  }

  function getCategoryBreakdown() {
    let categories = {};

    adminComplaints.forEach(function (complaint) {
      let category = complaint.category || "Other";

      if (!categories[category]) {
        categories[category] = 0;
      }

      categories[category]++;
    });

    return Object.keys(categories)
      .map(function (category) {
        return category + ": " + categories[category];
      })
      .join(" | ");
  }

  /*
    Update admin statistics
  */

  function updateAdminStats() {
    let total = adminComplaints.length;

    let pending = adminComplaints.filter(function (complaint) {
      return getSafeStatus(complaint.status) === "Pending";
    }).length;

    let progress = adminComplaints.filter(function (complaint) {
      return getSafeStatus(complaint.status) === "In Progress";
    }).length;

    let resolved = adminComplaints.filter(function (complaint) {
      return getSafeStatus(complaint.status) === "Resolved";
    }).length;

    $("#adminTotalCount").text(total);

    $("#adminPendingCount").text(pending);

    $("#adminProgressCount").text(progress);

    $("#adminResolvedCount").text(resolved);

    if ($("#adminCategoryCount").length !== 0) {
      $("#adminCategoryCount").text(getCategoryBreakdown() || "0");
    }
  }

  /*
    Apply filters
  */

  function applyAdminFilters() {
    let searchTerm = ($("#adminSearchInput").val() || "").toLowerCase().trim();

    let categoryFilter = $("#adminCategoryFilter").val() || "All";

    let statusFilter = $("#adminStatusFilter").val() || "All";

    filteredComplaints = adminComplaints.filter(function (complaint) {
      let category = complaint.category || "";

      let status = getSafeStatus(complaint.status);

      let text = getComplaintText(complaint).toLowerCase();

      let matchesSearch =
        searchTerm === "" ||
        text.indexOf(searchTerm) !== -1 ||
        category.toLowerCase().indexOf(searchTerm) !== -1;

      let matchesCategory =
        categoryFilter === "All" || category === categoryFilter;

      let matchesStatus = statusFilter === "All" || status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });

    buildAdminTable();
  }

  /*
    Build admin table
  */

  function buildAdminTable() {
    if (adminComplaints.length === 0) {
      $("#adminTableWrap").html(`

        <div class="empty-box-card">

          <div class="empty-box-icon-wrap">

            <span class="empty-box-icon">📭</span>

          </div>

          <h3 class="empty-box-title">

            No complaints submitted yet

          </h3>

          <p class="empty-box-message">

            Citizen complaints will appear here in real time once they are submitted.

          </p>

        </div>

      `);

      return;
    }

    if (filteredComplaints.length === 0) {
      $("#adminTableWrap").html(`

        <div class="empty-box-card">

          <h3 class="empty-box-title">

            No matching complaints found

          </h3>

          <p class="empty-box-message">

            Try changing your search, category, or status filter.

          </p>

        </div>

      `);

      return;
    }

    let tableHtml = `

      <table class="admin-table">

        <thead>

          <tr>

            <th>#</th>

            <th>Category</th>

            <th>Language</th>

            <th>Status</th>

            <th>Date</th>

            <th>Actions</th>

          </tr>

        </thead>

        <tbody>

    `;

    filteredComplaints.forEach(function (complaint, index) {
      let status = getSafeStatus(complaint.status);

      let statusClass = getStatusClass(status);

      tableHtml += `

        <tr>

          <td>${index + 1}</td>

          <td>${escapeHtml(complaint.category || "N/A")}</td>

          <td>${escapeHtml(complaint.language || "English")}</td>

          <td>

            <span class="complaint-status ${statusClass}">

              ${escapeHtml(status)}

            </span>

          </td>

          <td>${formatComplaintDate(complaint.timestamp)}</td>

          <td>

            <div class="admin-row-actions">

              <button
                type="button"
                class="admin-small-btn admin-view-btn"
                data-id="${complaint.id}">

                View

              </button>

              <button
                type="button"
                class="admin-small-btn admin-resolve-btn"
                data-id="${complaint.id}">

                Mark Resolved

              </button>

              <button
                type="button"
                class="admin-small-btn admin-danger-btn admin-delete-btn"
                data-id="${complaint.id}">

                Delete

              </button>

            </div>

          </td>

        </tr>

      `;

      if (expandedComplaintId === complaint.id) {
        tableHtml += `

          <tr class="admin-expanded-row">

            <td colspan="6">

              <div class="admin-expanded-content">

                <strong>Complaint Text</strong>

                <p>${escapeHtml(getComplaintText(complaint))}</p>

                <strong>Location</strong>

                <p>
                  ${escapeHtml(complaint.location || "Karachi")}
                  —
                  ${escapeHtml(complaint.latitude || "N/A")},
                  ${escapeHtml(complaint.longitude || "N/A")}
                </p>

                <strong>User</strong>

                <p>${escapeHtml(complaint.userEmail || "N/A")}</p>

              </div>

            </td>

          </tr>

        `;
      }
    });

    tableHtml += `

        </tbody>

      </table>

    `;

    $("#adminTableWrap").html(tableHtml);
  }

  /*
    Load complaints live
  */

  function loadAdminComplaints() {
    ensureAdminControls();

    $("#adminTableWrap").html(`

      <div class="loading-box">

        <div class="spinner-border text-info" role="status">

          <span class="visually-hidden">Loading...</span>

        </div>

        <p>Loading complaints...</p>

      </div>

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

        applyAdminFilters();
      },

      function (error) {
        console.log(error);

        showToast("Could not load admin complaints.", "danger");

        $("#adminTableWrap").html(`

          <div class="empty-box-card">

            <h3 class="empty-box-title">

              Could not load complaints

            </h3>

            <p class="empty-box-message">

              Please check Firebase rules or refresh the page.

            </p>

          </div>

        `);
      },
    );
  }

  /*
    Update complaint status
  */

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

  /*
    Delete complaint
  */

  function deleteComplaint(complaintId) {
    let confirmed = confirm("Are you sure you want to delete this complaint?");

    if (!confirmed) {
      return;
    }

    civicFirestoreService
      .deleteComplaint(complaintId)
      .then(function () {
        showToast("Complaint deleted successfully.", "success");
      })
      .catch(function (error) {
        console.log(error);

        showToast("Could not delete complaint.", "danger");
      });
  }

  /*
    CSV export
  */

  function downloadVisibleComplaintsCsv() {
    if (filteredComplaints.length === 0) {
      showToast("No complaints available to export.", "warning");

      return;
    }

    let rows = [["Date", "Category", "Language", "Status", "Complaint Text"]];

    filteredComplaints.forEach(function (complaint) {
      rows.push([
        formatComplaintDate(complaint.timestamp),
        complaint.category || "",
        complaint.language || "",
        getSafeStatus(complaint.status),
        getComplaintText(complaint),
      ]);
    });

    let csvContent = rows
      .map(function (row) {
        return row
          .map(function (value) {
            return '"' + String(value).replace(/"/g, '""') + '"';
          })
          .join(",");
      })
      .join("\n");

    let blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    let url = URL.createObjectURL(blob);

    let link = document.createElement("a");

    link.href = url;

    link.download = "civicconnect-complaints.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  /*
    Events
  */

  $("#adminTableWrap").on("click", ".admin-view-btn", function () {
    let complaintId = $(this).data("id");

    if (expandedComplaintId === complaintId) {
      expandedComplaintId = "";
    } else {
      expandedComplaintId = complaintId;
    }

    buildAdminTable();
  });

  $("#adminTableWrap").on("click", ".admin-resolve-btn", function () {
    let complaintId = $(this).data("id");

    updateComplaintStatus(complaintId, "Resolved");
  });

  $("#adminTableWrap").on("click", ".admin-delete-btn", function () {
    let complaintId = $(this).data("id");

    deleteComplaint(complaintId);
  });

  $(document).on(
    "input change",
    "#adminSearchInput, #adminCategoryFilter, #adminStatusFilter",
    function () {
      applyAdminFilters();
    },
  );

  $(document).on("click", "#adminDownloadCsvBtn", function () {
    downloadVisibleComplaintsCsv();
  });

  /*
    Initialize
  */

  loadAdminComplaints();
});