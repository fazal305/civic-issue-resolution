$(document).ready(function () {
  if ($("#complaintDetailsCard").length === 0) {
    return;
  }

  function getComplaintIdFromUrl() {
    let urlParams = new URLSearchParams(window.location.search);

    return urlParams.get("id");
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

  function formatComplaintDate(timestamp) {
    if (!timestamp || !timestamp.toDate) {
      return "Just now";
    }

    return timestamp.toDate().toLocaleDateString("en-PK", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function showMissingComplaint() {
    $("#complaintDetailsCard").html(`

            <p class="section-label">

                COMPLAINT NOT FOUND

            </p>

            <h1>

                No Complaint Selected

            </h1>

            <p class="about-text">

                Please open a complaint from the dashboard so CivicConnect can
                load the correct complaint details.

            </p>

            <a
                href="complaints.html"
                class="hero-btn mt-3">

                Back To Dashboard

            </a>

        `);
  }

  function renderComplaintDetails(complaintId, complaint) {
    let status = complaint.status || "Pending";

    let statusClass = getStatusClass(status);

    $("#complaintDetailsCard").html(`

            <span class="complaint-status ${statusClass}">

                ${status}

            </span>

            <h1 class="mt-3">

                ${complaint.category || "Civic"} Complaint

            </h1>

            <p class="about-text">

                ${complaint.complaintText || "No complaint description available."}

            </p>

            <hr>

            <h4>

                Complaint Metadata

            </h4>

            <p>

                <strong>Complaint ID:</strong>
                ${complaintId}

            </p>

            <p>

                <strong>Category:</strong>
                ${complaint.category || "N/A"}

            </p>

            <p>

                <strong>Language:</strong>
                ${complaint.language || "English"}

            </p>

           <p>

    <strong>Location:</strong>
    ${complaint.location || "Karachi"}

</p>

<p>

    <strong>Latitude:</strong>
    ${complaint.latitude || "N/A"}

</p>

<p>

    <strong>Longitude:</strong>
    ${complaint.longitude || "N/A"}

</p>

            <p>

                <strong>Status:</strong>
                ${status}

            </p>

            <p>

                <strong>Submitted On:</strong>
                ${formatComplaintDate(complaint.timestamp)}

            </p>

            <hr>

            <h4>

                Generated Complaint

            </h4>

            <p class="about-text">

                ${complaint.generatedComplaint || "Generated complaint text is not available."}

            </p>

            <hr>

            <h4>

                Complaint Timeline

            </h4>

            <div class="complaint-timeline">

                <div class="timeline-item active-timeline">

                    <span class="timeline-dot"></span>

                    <div>

                        <h5>

                            Complaint Created

                        </h5>

                        <p>

                            Your complaint was saved to CivicConnect.

                        </p>

                    </div>

                </div>

                <div class="timeline-item ${status === "In Progress" || status === "Resolved" ? "active-timeline" : ""}">

                    <span class="timeline-dot"></span>

                    <div>

                        <h5>

                            In Progress

                        </h5>

                        <p>

                            The complaint is being reviewed by the responsible
                            department.

                        </p>

                    </div>

                </div>

                <div class="timeline-item ${status === "Resolved" ? "active-timeline" : ""}">

                    <span class="timeline-dot"></span>

                    <div>

                        <h5>

                            Resolved

                        </h5>

                        <p>

                            The issue has been marked as completed.

                        </p>

                    </div>

                </div>

            </div>

            <div class="result-actions mt-4">

                <button
                    type="button"
                    class="hero-btn"
                    id="printComplaintBtn">

                    Print Complaint

                </button>

                <button
                    type="button"
                    class="dashboard-btn"
                    id="downloadComplaintBtn">

                   Save As PDF

                </button>
<a
    href="https://www.openstreetmap.org/?mlat=${complaint.latitude || 24.8607}&mlon=${complaint.longitude || 67.0011}#map=16/${complaint.latitude || 24.8607}/${complaint.longitude || 67.0011}"
    target="_blank"
    class="dashboard-btn">

    View On Map

</a>
            </div>

        `);
  }

  function loadComplaintDetails() {
    let complaintId = getComplaintIdFromUrl();

    if (!complaintId) {
      showMissingComplaint();

      return;
    }

    complaintsCollection
      .doc(complaintId)
      .get()
      .then(function (doc) {
        if (!doc.exists) {
          showMissingComplaint();

          return;
        }

        renderComplaintDetails(doc.id, doc.data());
      })
      .catch(function (error) {
        console.log(error);

        showToast("Could not load complaint details.", "danger");

        showMissingComplaint();
      });
  }

  $("#complaintDetailsCard").on("click", "#printComplaintBtn", function () {
    window.print();
  });

  $("#complaintDetailsCard").on("click", "#downloadComplaintBtn", function () {
    showToast("Choose 'Save as PDF' in the print window.", "info");

    setTimeout(function () {
      window.print();
    }, 500);
  });

  loadComplaintDetails();
});
