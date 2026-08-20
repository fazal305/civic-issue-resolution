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

  let geocodeDebounceTimer = null;

  let geocodeRequestToken = 0;

  // Reverse-geocode via Nominatim (OpenStreetMap's free geocoding
  // service — same data source as the map tiles above, no API key).
  // Usage policy caps this at ~1 request/second per client, so calls
  // are debounced and only the latest in-flight request is applied.
  function reverseGeocode(latitude, longitude) {
    if (geocodeDebounceTimer) {
      clearTimeout(geocodeDebounceTimer);
    }

    let thisRequest = ++geocodeRequestToken;

    $("#selectedLocationText").text("Locating address...");

    geocodeDebounceTimer = setTimeout(function () {
      fetch(
        "https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=" +
          latitude +
          "&lon=" +
          longitude,
      )
        .then(function (response) {
          if (!response.ok) {
            throw new Error("Nominatim request failed");
          }

          return response.json();
        })
        .then(function (data) {
          if (thisRequest !== geocodeRequestToken) {
            return;
          }

          let address =
            (data && data.display_name) ||
            "Karachi (" + latitude.toFixed(5) + ", " + longitude.toFixed(5) + ")";

          $("#complaintLocation").val(address);

          $("#selectedLocationText").text(address);
        })
        .catch(function () {
          if (thisRequest !== geocodeRequestToken) {
            return;
          }

          let fallback =
            "Karachi (" + latitude.toFixed(5) + ", " + longitude.toFixed(5) + ")";

          $("#complaintLocation").val(fallback);

          $("#selectedLocationText").text(fallback);
        });
    }, 600);
  }

  function updateSelectedLocation(latitude, longitude) {
    $("#complaintLatitude").val(latitude);

    $("#complaintLongitude").val(longitude);

    complaintMarker.setLatLng([latitude, longitude]);

    reverseGeocode(latitude, longitude);
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
