function initializeComplaintMap() {
  if ($("#complaintMap").length === 0 || typeof L === "undefined") {
    return;
  }

  let defaultLatitude = 24.8607;

  let defaultLongitude = 67.0011;

  let karachiCoordinates = [defaultLatitude, defaultLongitude];

  let complaintMap = L.map("complaintMap").setView(karachiCoordinates, 12);

  let complaintMarker = L.marker(karachiCoordinates, {
    draggable: true,
  }).addTo(complaintMap);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(complaintMap);

  function updateSelectedLocation(latitude, longitude) {
    $("#complaintLatitude").val(latitude);

    $("#complaintLongitude").val(longitude);

    $("#complaintLocation").val("Karachi");

    $("#selectedLocationText").text(
      "Karachi (" + latitude.toFixed(5) + ", " + longitude.toFixed(5) + ")",
    );

    complaintMarker.setLatLng([latitude, longitude]);
  }

  updateSelectedLocation(defaultLatitude, defaultLongitude);

  complaintMap.on("click", function (event) {
    updateSelectedLocation(event.latlng.lat, event.latlng.lng);
  });

  complaintMarker.on("dragend", function () {
    let markerPosition = complaintMarker.getLatLng();

    updateSelectedLocation(markerPosition.lat, markerPosition.lng);
  });

  setTimeout(function () {
    complaintMap.invalidateSize();
  }, 500);
}
