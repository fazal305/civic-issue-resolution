/*
| CivicConnect Image Upload
| Firebase Storage is disabled by default because the Spark plan does not
| support the required Storage rules/features for this project.
|
| To enable image uploads later:
|
| 1. Upgrade Firebase to the Blaze plan.
| 2. Configure Firebase Storage.
| 3. Set IMAGE_UPLOADS_ENABLED = true.
*/

let IMAGE_UPLOADS_ENABLED = false;

function uploadComplaintImages() {
  /*
    Always return an empty image list while uploads are disabled.
  */

  return $.Deferred().resolve([]).promise();
}

function initializeImageUpload() {
  if ($("#complaintImages").length === 0) {
    return;
  }

  if (!IMAGE_UPLOADS_ENABLED) {
    $(".evidence-upload").hide();

    return;
  }

  function renderImagePreviews() {
    let previewHtml = "";

    selectedComplaintImages.forEach(function (file, index) {
      let imageUrl = URL.createObjectURL(file);

      previewHtml += `

        <div class="image-preview-card">

          <img
            src="${imageUrl}"
            alt="Complaint evidence preview">

          <button
            type="button"
            class="remove-image-btn"
            data-index="${index}">

            ×

          </button>

        </div>

      `;
    });

    $("#imagePreviewGrid").html(previewHtml);
  }

  $("#complaintImages").change(function () {
    let files = Array.from(this.files);

    files.forEach(function (file) {
      if (selectedComplaintImages.length >= MAX_COMPLAINT_IMAGES) {
        showToast(
          "You can upload up to " + MAX_COMPLAINT_IMAGES + " images only.",
          "warning",
        );

        return;
      }

      if (!file.type.startsWith("image/")) {
        showToast("Only image files are allowed.", "warning");

        return;
      }

      if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
        showToast(
          "Each image must be " + MAX_IMAGE_SIZE_MB + " MB or smaller.",
          "warning",
        );

        return;
      }

      selectedComplaintImages.push(file);
    });

    $("#complaintImages").val("");

    renderImagePreviews();
  });

  $("#imagePreviewGrid").on("click", ".remove-image-btn", function () {
    let imageIndex = $(this).data("index");

    selectedComplaintImages.splice(imageIndex, 1);

    renderImagePreviews();
  });
}
