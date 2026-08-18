$(document).ready(function () {
  if ($("#homepageComplaintsPreview").length === 0) {
    return;
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

  function renderLoadingState() {
    $("#homepageComplaintsPreview").html(`

      <div class="col-12 text-center">

        <p class="complaint-text">

          Loading recent complaints...

        </p>

      </div>

    `);
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

            Recent complaints will appear here once citizens start reporting civic issues.

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

      let previewText =
        complaint.complaintText ||
        complaint.generatedComplaint ||
        "No complaint description available.";

      let preview =
        previewText.length > 110
          ? previewText.substring(0, 110) + "..."
          : previewText;

      cardsHtml += `

        <div class="col-lg-4 mb-4">

          <div class="complaint-card">

            <span class="complaint-status ${getStatusClass(status)}">

              ${escapeHtml(status)}

            </span>

            <h3>

              ${escapeHtml(complaint.category || "Civic")} Complaint

            </h3>

            <p>

              ${escapeHtml(preview)}

            </p>

            <p class="complaint-meta">

              ${escapeHtml(complaint.location || "Karachi")}

              &bull;

              ${formatHomeDate(complaint.timestamp)}

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
    if (typeof civicFirestoreService === "undefined") {
      $("#homepageComplaintsPreview").html(`

        <div class="col-12 text-center">

          <p class="complaint-text">

            Firestore service is unavailable.

          </p>

        </div>

      `);

      return;
    }

    renderLoadingState();

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

      function () {
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
