$(document).ready(function () {
  if ($("#homepageComplaintsPreview").length === 0) {
    return;
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

  function formatHomeDate(timestamp) {
    if (!timestamp || !timestamp.toDate) {
      return "Just now";
    }

    return timestamp.toDate().toLocaleDateString("en-PK", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function escapeHomeHtml(text) {
    if (!text) {
      return "";
    }

    return $("<div>").text(text).html();
  }

  function renderEmptyPreview() {
    $("#homepageComplaintsPreview").html(`

      <div class="col-12 text-center">

        <div class="about-card">

          <p class="section-label">

            NO COMPLAINTS YET

          </p>

          <h3>

            Be The First To Report An Issue

          </h3>

          <p class="complaint-text">

            Recent complaints will appear here once citizens start reporting
            civic issues.

          </p>

          <a
            href="pages/report.html"
            class="hero-btn mt-3">

            Report First Issue

          </a>

        </div>

      </div>

    `);
  }

  function renderHomepageComplaints(complaints) {
    if (complaints.length === 0) {
      renderEmptyPreview();

      return;
    }

    let cardsHtml = "";

    complaints.forEach(function (complaint) {
      let status = complaint.status || "Pending";

      let statusClass = getStatusClass(status);

      let previewText =
        complaint.complaintText ||
        complaint.generatedComplaint ||
        "No complaint description available.";

      cardsHtml += `

        <div class="col-lg-4">

          <div class="complaint-card">

            <span class="complaint-status ${statusClass}">

              ${escapeHomeHtml(status)}

            </span>

            <h3>

              ${escapeHomeHtml(complaint.category || "Civic")} Complaint

            </h3>

            <p>

              ${escapeHomeHtml(previewText.substring(0, 110))}...

            </p>

            <p class="complaint-meta">

              ${escapeHomeHtml(complaint.location || "Karachi")}
              ·
              ${escapeHomeHtml(formatHomeDate(complaint.timestamp))}

            </p>

            <a
              href="pages/complaint-details.html?id=${complaint.id}"
              class="dashboard-btn">

              View Details

            </a>

          </div>

        </div>

      `;
    });

    $("#homepageComplaintsPreview").html(cardsHtml);
  }
  function listenHomepageComplaints() {
    civicFirestoreService.listenLatestComplaints(
      3,

      function (snapshot) {
        let complaints = [];

        snapshot.forEach(function (document) {
          let complaintData = document.data();

          complaintData.id = document.id;

          complaints.push(complaintData);
        });

        renderHomepageComplaints(complaints);
      },

      function (error) {
        console.log(error);

        $("#homepageComplaintsPreview").html(`

        <div class="col-12 text-center">

          <p class="complaint-text">

            Could not load recent complaints.

          </p>

        </div>

      `);
      },
    );
  }
  listenHomepageComplaints();
});
