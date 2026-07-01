function uploadComplaintImages() {
  let currentUser = firebaseAuth.currentUser;

  if (selectedComplaintImages.length === 0) {
    return $.Deferred().resolve([]).promise();
  }

  if (!currentUser) {
    return $.Deferred().reject("User not logged in").promise();
  }

  let uploadPromises = [];

  selectedComplaintImages.forEach(function (file, index) {
    let safeFileName = file.name
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9.-]/g, "");

    let filePath =
      "complaint-images/" +
      currentUser.uid +
      "/" +
      Date.now() +
      "-" +
      index +
      "-" +
      safeFileName;

    let storageReference = firebaseStorage.ref(filePath);

    let uploadTask = storageReference.put(file);

    let uploadPromise = uploadTask.then(function (snapshot) {
      return snapshot.ref.getDownloadURL();
    });

    uploadPromises.push(uploadPromise);
  });

  return Promise.all(uploadPromises);
}

function initializeImageUpload() {
  if ($("#complaintImages").length === 0) {
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
        showToast("You can upload up to 3 images only.", "warning");

        return;
      }

      if (!file.type.startsWith("image/")) {
        showToast("Only image files are allowed.", "warning");

        return;
      }

      if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
        showToast("Each image must be 3 MB or smaller.", "warning");

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
