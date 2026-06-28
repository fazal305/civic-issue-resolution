let allComplaints = [];
let filteredComplaints = [];
let searchDebounceTimer = null;
let currentPage = 1;
let COMPLAINTS_PER_PAGE = 6;
let SEARCH_DEBOUNCE_MS = 300;
let FILTER_CATEGORIES = [
  "Garbage",
  "Electricity",
  "Water",
  "Gas",
  "Road Damage",
];let FILTER_STATUSES = ["Pending", "In Progress", "Resolved"];
let FILTER_LANGUAGES = ["English", "Roman Urdu", "Urdu"];function escapeHtml(text) {
  if (!text) {
    return "";
  }

  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getSearchTerms() {
  let searchText = $("#complaintSearch").val().toLowerCase().trim();

  if (searchText === "") {
    return [];
  }

  return searchText.split(/\s+/).filter(function (term) {
    return term.length > 0;
  });
}

function highlightSearchTerms(text, searchTerms) {
  let safeText = escapeHtml(text);

  if (searchTerms.length === 0) {
    return safeText;
  }

  searchTerms.forEach(function (term) {
    let regex = new RegExp("(" + escapeRegex(term) + ")", "gi");
    safeText = safeText.replace(
      regex,
      '<mark class="search-highlight">$1</mark>',
    );
  });

  return safeText;
}

function matchesAdvancedSearch(complaint, searchTerms) {
  if (searchTerms.length === 0) {
    return true;
  }

  let searchableText = (
    complaint.category +
    " " +
    complaint.complaintText +
    " " +
    complaint.generatedComplaint +
    " " +
    complaint.location +
    " " +
    complaint.language +
    " " +
    complaint.status
  ).toLowerCase();

  let allTermsMatch = true;

  searchTerms.forEach(function (term) {
    if (searchableText.indexOf(term) === -1) {
      allTermsMatch = false;
    }
  });

  return allTermsMatch;
}

function hasActiveFilters(searchTerms) {
  return (
    searchTerms.length > 0 ||
    $("#categoryFilter").val() !== "" ||
    $("#statusFilter").val() !== "" ||
    $("#languageFilter").val() !== "" ||
    $("#dateFilter").val() !== ""
  );
}

function getComplaintTimestamp(complaint) {
  if (!complaint.timestamp || !complaint.timestamp.toDate) {
    return null;
  }

  return complaint.timestamp.toDate();
}

function getDateFilterLabel(dateFilter) {
  if (dateFilter === "today") {
    return "Today";
  }

  if (dateFilter === "7days") {
    return "Last 7 days";
  }

  if (dateFilter === "30days") {
    return "Last 30 days";
  }

  if (dateFilter === "90days") {
    return "Last 90 days";
  }

  return dateFilter;
}

function matchesDateFilter(complaint, dateFilter) {
  if (dateFilter === "") {
    return true;
  }

  let complaintDate = getComplaintTimestamp(complaint);

  if (!complaintDate) {
    return true;
  }

  let now = new Date();
  let startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );

  if (dateFilter === "today") {
    return complaintDate >= startOfToday;
  }

  let dayLimit = 0;

  if (dateFilter === "7days") {
    dayLimit = 7;
  } else if (dateFilter === "30days") {
    dayLimit = 30;
  } else if (dateFilter === "90days") {
    dayLimit = 90;
  }

  if (dayLimit === 0) {
    return true;
  }

  let cutoffDate = new Date(now.getTime() - dayLimit * 24 * 60 * 60 * 1000);
  return complaintDate >= cutoffDate;
}

function getActiveFilterValues() {
  return {
    category: $("#categoryFilter").val(),
    status: $("#statusFilter").val(),
    language: $("#languageFilter").val(),
    date: $("#dateFilter").val(),
  };
}

function complaintMatchesFilters(complaint, searchTerms, filters) {
  if (filters.category !== "" && complaint.category !== filters.category) {
    return false;
  }

  if (filters.status !== "" && complaint.status !== filters.status) {
    return false;
  }

  if (
    filters.language !== "" &&
    (complaint.language || "English") !== filters.language
  ) {
    return false;
  }

  if (!matchesDateFilter(complaint, filters.date)) {
    return false;
  }

  if (!matchesAdvancedSearch(complaint, searchTerms)) {
    return false;
  }

  return true;
}
function updateResultsSummary(filteredCount, totalCount, searchTerms, pageStart, pageEnd) {
  let $summary = $("#searchResultsSummary");

  if (totalCount === 0) {
    $summary.hide().text("");
    return;
  }

  let summaryText = "";

  if (filteredCount === 0) {
    summaryText = "No complaints match your current filters";
  } else if (filteredCount > COMPLAINTS_PER_PAGE) {
    summaryText =
      "Showing " +
      pageStart +
      "–" +
      pageEnd +
      " of " +
      filteredCount +
      " complaints";
  } else if (hasActiveFilters(searchTerms)) {
    summaryText =
      "Showing " + filteredCount + " of " + totalCount + " complaints";
  } else {
    summaryText = "Showing all " + totalCount + " complaints";
  }

  $summary.text(summaryText).show();
}

function getTotalPages(totalItems) {
  return Math.max(1, Math.ceil(totalItems / COMPLAINTS_PER_PAGE));
}

function getPageSlice(complaints, page) {
  let startIndex = (page - 1) * COMPLAINTS_PER_PAGE;
  return complaints.slice(startIndex, startIndex + COMPLAINTS_PER_PAGE);
}

function scrollToComplaints() {
  $("html, body").animate(
    {
      scrollTop: $("#complaintsContainer").offset().top - 100,
    },
    300,
  );
}

function renderPagination(totalItems) {
  let totalPages = getTotalPages(totalItems);
  let $pagination = $("#complaintsPagination");

  if (totalItems === 0 || totalPages <= 1) {
    $pagination.removeClass("visible");
    $("#paginationPages").empty();
    return;
  }

  $pagination.addClass("visible");
  $("#paginationPrevBtn").prop("disabled", currentPage === 1);
  $("#paginationNextBtn").prop("disabled", currentPage === totalPages);

  let pagesHtml = "";

  for (let page = 1; page <= totalPages; page++) {
    pagesHtml +=
      '<button type="button" class="pagination-page-btn' +
      (page === currentPage ? " active-page" : "") +
      '" data-page="' +
      page +
      '">' +
      page +
      "</button>";
  }

  $("#paginationPages").html(pagesHtml);
}

function goToPage(page) {
  let totalPages = getTotalPages(filteredComplaints.length);

  if (page < 1) {
    page = 1;
  }

  if (page > totalPages) {
    page = totalPages;
  }

  currentPage = page;
  renderComplaints(filteredComplaints, getSearchTerms(), false);
  scrollToComplaints();
}
function updateSearchClearButton() {
  let hasText = $("#complaintSearch").val().trim().length > 0;
  $("#clearSearchBtn").toggleClass("visible", hasText);
  $("#dashboardSearchWrap").toggleClass("has-value", hasText);
}

function setSearchPending(isPending) {
  $("#dashboardSearchWrap").toggleClass("is-searching", isPending);
}
function getCategoryCounts(searchTerms) {
  let counts = {};
  let filters = getActiveFilterValues();

  FILTER_CATEGORIES.forEach(function (category) {
    counts[category] = 0;
  });

  allComplaints.forEach(function (complaint) {
    if (
      !complaintMatchesFilters(complaint, searchTerms, {
        category: "",
        status: filters.status,
        language: filters.language,
        date: filters.date,
      })
    ) {
      return;
    }

    if (counts[complaint.category] !== undefined) {
      counts[complaint.category]++;
    }
  });

  return counts;
}

function getStatusCounts(searchTerms) {
  let counts = {};
  let filters = getActiveFilterValues();

  FILTER_STATUSES.forEach(function (status) {
    counts[status] = 0;
  });

  allComplaints.forEach(function (complaint) {
    if (
      !complaintMatchesFilters(complaint, searchTerms, {
        category: filters.category,
        status: "",
        language: filters.language,
        date: filters.date,
      })
    ) {
      return;
    }

    if (counts[complaint.status] !== undefined) {
      counts[complaint.status]++;
    }
  });

  return counts;
}

function getLanguageCounts(searchTerms) {
  let counts = {};
  let filters = getActiveFilterValues();

  FILTER_LANGUAGES.forEach(function (language) {
    counts[language] = 0;
  });

  allComplaints.forEach(function (complaint) {
    if (
      !complaintMatchesFilters(complaint, searchTerms, {
        category: filters.category,
        status: filters.status,
        language: "",
        date: filters.date,
      })
    ) {
      return;
    }

    let language = complaint.language || "English";

    if (counts[language] !== undefined) {
      counts[language]++;
    }
  });

  return counts;
}
function updateFilterOptionCounts() {
  let searchTerms = getSearchTerms();
  let categoryCounts = getCategoryCounts(searchTerms);
  let statusCounts = getStatusCounts(searchTerms);
  let languageCounts = getLanguageCounts(searchTerms);

  $("#categoryFilter option").each(function () {
    let value = $(this).val();

    if (value === "") {
      $(this).text("All Categories (" + allComplaints.length + ")");
      return;
    }

    $(this).text(value + " (" + (categoryCounts[value] || 0) + ")");
  });

  $("#statusFilter option").each(function () {
    let value = $(this).val();

    if (value === "") {
      $(this).text("All Statuses (" + allComplaints.length + ")");
      return;
    }

    $(this).text(value + " (" + (statusCounts[value] || 0) + ")");
  });

  $("#languageFilter option").each(function () {
    let value = $(this).val();

    if (value === "") {
      $(this).text("All Languages (" + allComplaints.length + ")");
      return;
    }

    $(this).text(value + " (" + (languageCounts[value] || 0) + ")");
  });
}

function updateQuickFilterPills() {
  let searchTerms = getSearchTerms();
  let filters = getActiveFilterValues();
  let categoryCounts = getCategoryCounts(searchTerms);
  let statusCounts = getStatusCounts(searchTerms);
  let languageCounts = getLanguageCounts(searchTerms);

  $("#categoryQuickFilters .quick-filter-pill").each(function () {
    let value = $(this).data("filter-value");
    let count = categoryCounts[value] || 0;

    $(this)
      .toggleClass("active-pill", value === filters.category)
      .toggleClass("pill-disabled", count === 0)
      .attr("aria-pressed", value === filters.category ? "true" : "false")
      .find(".pill-count")
      .text(count);
  });

  $("#statusQuickFilters .quick-filter-pill").each(function () {
    let value = $(this).data("filter-value");
    let count = statusCounts[value] || 0;
    let statusClass = getStatusClass(value);

    $(this)
      .removeClass("pending-status progress-status resolved-status")
      .addClass(statusClass)
      .toggleClass("active-pill", value === filters.status)
      .toggleClass("pill-disabled", count === 0)
      .attr("aria-pressed", value === filters.status ? "true" : "false")
      .find(".pill-count")
      .text(count);
  });

  $("#languageQuickFilters .quick-filter-pill").each(function () {
    let value = $(this).data("filter-value");
    let count = languageCounts[value] || 0;

    $(this)
      .toggleClass("active-pill", value === filters.language)
      .toggleClass("pill-disabled", count === 0)
      .attr("aria-pressed", value === filters.language ? "true" : "false")
      .find(".pill-count")
      .text(count);
  });
}

function updateFilterSelectStates() {
  $("#categoryFilter").toggleClass(
    "filter-active",
    $("#categoryFilter").val() !== "",
  );
  $("#statusFilter").toggleClass(
    "filter-active",
    $("#statusFilter").val() !== "",
  );
  $("#languageFilter").toggleClass(
    "filter-active",
    $("#languageFilter").val() !== "",
  );
  $("#dateFilter").toggleClass("filter-active", $("#dateFilter").val() !== "");
}

function renderActiveFilterChips() {
  let searchTerms = getSearchTerms();
  let filters = getActiveFilterValues();
  let chipsHtml = "";

  if ($("#complaintSearch").val().trim() !== "") {
    chipsHtml +=
      '<button type="button" class="filter-chip" data-filter-type="search">' +
      "Search: " +
      escapeHtml($("#complaintSearch").val().trim()) +
      ' <span aria-hidden="true">×</span></button>';
  }

  if (filters.category !== "") {
    chipsHtml +=
      '<button type="button" class="filter-chip" data-filter-type="category">' +
      "Category: " +
      escapeHtml(filters.category) +
      ' <span aria-hidden="true">×</span></button>';
  }

  if (filters.status !== "") {
    chipsHtml +=
      '<button type="button" class="filter-chip" data-filter-type="status">' +
      "Status: " +
      escapeHtml(filters.status) +
      ' <span aria-hidden="true">×</span></button>';
  }

  if (filters.language !== "") {
    chipsHtml +=
      '<button type="button" class="filter-chip" data-filter-type="language">' +
      "Language: " +
      escapeHtml(filters.language) +
      ' <span aria-hidden="true">×</span></button>';
  }

  if (filters.date !== "") {
    chipsHtml +=
      '<button type="button" class="filter-chip" data-filter-type="date">' +
      "Date: " +
      escapeHtml(getDateFilterLabel(filters.date)) +
      ' <span aria-hidden="true">×</span></button>';
  }
  $("#activeFilterChips").html(chipsHtml);

  if (hasActiveFilters(searchTerms)) {
    $("#activeFiltersBar").addClass("visible");
  } else {
    $("#activeFiltersBar").removeClass("visible");
  }
}

function updateFilterControls() {
  updateFilterOptionCounts();
  updateQuickFilterPills();
  updateFilterSelectStates();
  renderActiveFilterChips();
}

function clearAllFilters() {
  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer);
  }

  setSearchPending(false);
  $("#complaintSearch").val("");
  $("#categoryFilter").val("");
  $("#statusFilter").val("");
  $("#languageFilter").val("");
  $("#dateFilter").val("");
  updateSearchClearButton();
  filterComplaints();
}

function removeFilter(filterType) {
  if (filterType === "search") {
    $("#complaintSearch").val("");
    updateSearchClearButton();
  }

  if (filterType === "category") {
    $("#categoryFilter").val("");
  }

  if (filterType === "status") {
    $("#statusFilter").val("");
  }

  if (filterType === "language") {
    $("#languageFilter").val("");
  }

  if (filterType === "date") {
    $("#dateFilter").val("");
  }

  filterComplaints();
}
function buildQuickFilterPills() {
  let categoryHtml = "";

  FILTER_CATEGORIES.forEach(function (category) {
    categoryHtml +=
      '<button type="button" class="quick-filter-pill" data-filter-type="category" data-filter-value="' +
      category +
      '" aria-pressed="false">' +
      category +
      ' <span class="pill-count">0</span></button>';
  });

  $("#categoryQuickFilters").html(categoryHtml);

  let statusHtml = "";

  FILTER_STATUSES.forEach(function (status) {
    statusHtml +=
      '<button type="button" class="quick-filter-pill ' +
      getStatusClass(status) +
      '" data-filter-type="status" data-filter-value="' +
      status +
      '" aria-pressed="false">' +
      status +
      ' <span class="pill-count">0</span></button>';
  });

  $("#statusQuickFilters").html(statusHtml);

  let languageHtml = "";

  FILTER_LANGUAGES.forEach(function (language) {
    languageHtml +=
      '<button type="button" class="quick-filter-pill" data-filter-type="language" data-filter-value="' +
      language +
      '" aria-pressed="false">' +
      language +
      ' <span class="pill-count">0</span></button>';
  });

  $("#languageQuickFilters").html(languageHtml);
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

function getCategoryBadgeClass(category) {
  let badgeMap = {
    Garbage: "category-garbage",
    Electricity: "category-electricity",
    Water: "category-water",
    Gas: "category-gas",
    "Road Damage": "category-road",
  };

  return badgeMap[category] || "category-default";
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

function truncateText(text, limit) {
  if (!text) {
    return "";
  }

  if (text.length <= limit) {
    return text;
  }

  return text.substring(0, limit) + "...";
}

function buildComplaintCard(complaint, searchTerms) {
  let statusClass = getStatusClass(complaint.status);
  let categoryClass = getCategoryBadgeClass(complaint.category);
  let rawPreview =
    complaint.complaintText || complaint.generatedComplaint || "";
  let preview = highlightSearchTerms(
    truncateText(rawPreview, 120),
    searchTerms,
  );
  let categoryLabel = highlightSearchTerms(complaint.category, searchTerms);
  let statusLabel = highlightSearchTerms(complaint.status, searchTerms);
  let metaLine = highlightSearchTerms(
    (complaint.location || "Karachi") +
      " · " +
      (complaint.language || "English") +
      " · " +
      formatComplaintDate(complaint.timestamp),
    searchTerms,
  );
  return (
    '<div class="col-lg-4 col-md-6">' +
    '<div class="complaint-card" data-id="' +
    complaint.id +
    '">' +
    '<div class="complaint-card-top">' +
    '<span class="category-badge ' +
    categoryClass +
    '">' +
    categoryLabel +
    "</span>" +
    '<span class="complaint-status ' +
    statusClass +
    '">' +
    statusLabel +
    "</span>" +
    "</div>" +
    "<h3>" +
    categoryLabel +
    " Complaint</h3>" +
    '<p class="complaint-preview">' +
    preview +
    "</p>" +
    '<p class="complaint-meta">' +
    metaLine +
    "</p>" +    '<div class="dashboard-actions">' +
    '<button type="button" class="dashboard-btn delete-btn" data-id="' +
    complaint.id +
    '">' +
    "🗑 Delete" +
    "</button>" +
    "</div>" +
    "</div>" +
    "</div>"
  );
}

function buildSkeletonCard() {
  return (
    '<div class="col-lg-4 col-md-6">' +
    '<div class="complaint-card skeleton-card">' +
    '<div class="skeleton-card-top">' +
    '<span class="skeleton-block skeleton-badge"></span>' +
    '<span class="skeleton-block skeleton-status"></span>' +
    "</div>" +
    '<span class="skeleton-block skeleton-title"></span>' +
    '<span class="skeleton-block skeleton-line"></span>' +
    '<span class="skeleton-block skeleton-line skeleton-line-short"></span>' +
    '<span class="skeleton-block skeleton-meta"></span>' +
    '<span class="skeleton-block skeleton-btn"></span>' +
    "</div>" +
    "</div>"
  );
}

function showLoadingState() {
  let skeletonHtml = "";
  let index = 0;

  $("#skeletonLoadingLabel").show();
  $("#emptyBox").hide();
  $("#searchResultsSummary").hide();
  $("#activeFiltersBar").removeClass("visible");
  $("#complaintsPagination").removeClass("visible");

  for (index = 0; index < COMPLAINTS_PER_PAGE; index++) {
    skeletonHtml += buildSkeletonCard();
  }

  $("#complaintsContainer")
    .attr("aria-busy", "true")
    .addClass("is-loading")
    .html(skeletonHtml);
}

function hideLoadingState() {
  $("#skeletonLoadingLabel").hide();
  $("#complaintsContainer").removeClass("is-loading").removeAttr("aria-busy");
}

function showEmptyState(message) {
  let hasFilters =
    hasActiveFilters(getSearchTerms()) && allComplaints.length > 0;

  hideLoadingState();
  $("#emptyBoxMessage").text(message);
  $("#emptyBox").show();
  $("#complaintsContainer").empty();

  if (hasFilters) {
    $("#emptyBoxTitle").text("No Matches Found");
    $("#emptyBoxPrimaryActions").hide();
    $("#emptyClearFiltersBtn").show();
  } else {
    $("#emptyBoxTitle").text("No Complaints Yet");
    $("#emptyBoxPrimaryActions").show();
    $("#emptyClearFiltersBtn").hide();
  }
}
function hideEmptyState() {
  $("#emptyBox").hide();
}

function renderComplaints(complaints, searchTerms, resetPage) {
  searchTerms = searchTerms || [];
  hideLoadingState();

  if (resetPage !== false) {
    currentPage = 1;
  }

  filteredComplaints = complaints;

  let totalPages = getTotalPages(filteredComplaints.length);

  if (currentPage > totalPages) {
    currentPage = totalPages;
  }

  if (filteredComplaints.length === 0) {
    updateResultsSummary(0, allComplaints.length, searchTerms, 0, 0);
    renderPagination(0);

    if (allComplaints.length === 0) {
      showEmptyState("You have not submitted any complaints yet.");
    } else {
      showEmptyState("No complaints match your search or filters.");
    }

    updateFilterControls();
    return;
  }

  hideEmptyState();

  let pageComplaints = getPageSlice(filteredComplaints, currentPage);
  let startIndex = (currentPage - 1) * COMPLAINTS_PER_PAGE + 1;
  let endIndex = startIndex + pageComplaints.length - 1;

  updateResultsSummary(
    filteredComplaints.length,
    allComplaints.length,
    searchTerms,
    startIndex,
    endIndex,
  );

  let cardsHtml = "";

  pageComplaints.forEach(function (complaint) {
    cardsHtml += buildComplaintCard(complaint, searchTerms);
  });

  $("#complaintsContainer").html(cardsHtml);
  renderPagination(filteredComplaints.length);
  updateFilterControls();
}

function filterComplaints(keepPage) {
  let searchTerms = getSearchTerms();
  let filters = getActiveFilterValues();

  let matchedComplaints = allComplaints.filter(function (complaint) {
    return complaintMatchesFilters(complaint, searchTerms, filters);
  });

  renderComplaints(matchedComplaints, searchTerms, !keepPage);
}
function sortComplaintsByDate(complaints) {
  return complaints.sort(function (first, second) {    let firstTime =
      first.timestamp && first.timestamp.toDate
        ? first.timestamp.toDate().getTime()
        : 0;
    let secondTime =
      second.timestamp && second.timestamp.toDate
        ? second.timestamp.toDate().getTime()
        : 0;

    return secondTime - firstTime;
  });
}

function loadComplaints() {
  showLoadingState();

  complaintsCollection
    .get()
    .then(function (snapshot) {
      allComplaints = [];

      snapshot.forEach(function (doc) {
        let complaintData = doc.data();

        complaintData.id = doc.id;
        allComplaints.push(complaintData);
      });

      allComplaints = sortComplaintsByDate(allComplaints);
      filterComplaints();
    })
    .catch(function (error) {
      console.log(error);
      hideLoadingState();
      showEmptyState("Could not load complaints. Please refresh the page.");
      showToast("Failed to load complaints from the database.", "danger");
    });
}

function deleteComplaint(complaintId) {
  complaintsCollection
    .doc(complaintId)
    .delete()
    .then(function () {
      allComplaints = allComplaints.filter(function (complaint) {
        return complaint.id !== complaintId;
      });

      filterComplaints(true);
      showToast("Complaint deleted successfully.", "success");    })
    .catch(function (error) {
      console.log(error);
      showToast("Could not delete this complaint.", "danger");
    });
}

function initializeSearch() {
  $("#complaintSearch").on("input", function () {
    updateSearchClearButton();

    if ($("#complaintSearch").val().trim() !== "") {
      setSearchPending(true);
      $("#searchResultsSummary").text("Searching...").show();
    }

    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer);
    }

    searchDebounceTimer = setTimeout(function () {
      setSearchPending(false);
      filterComplaints();
    }, SEARCH_DEBOUNCE_MS);
  });

  $("#clearSearchBtn").click(function () {
    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer);
    }

    setSearchPending(false);
    $("#complaintSearch").val("").focus();
    updateSearchClearButton();
    filterComplaints();
  });

  $("#complaintSearch").on("keydown", function (event) {
    if (event.key === "Escape") {
      if (searchDebounceTimer) {
        clearTimeout(searchDebounceTimer);
      }

      setSearchPending(false);
      $("#complaintSearch").val("");
      updateSearchClearButton();
      filterComplaints();
    }
  });
}function initializeFilters() {
  buildQuickFilterPills();

  $("#categoryFilter, #statusFilter, #languageFilter, #dateFilter").change(
    function () {
      filterComplaints();
    },
  );

  $("#categoryQuickFilters, #statusQuickFilters, #languageQuickFilters").on(
    "click",
    ".quick-filter-pill",
    function () {
      if ($(this).hasClass("pill-disabled")) {
        return;
      }

      let filterType = $(this).data("filter-type");
      let filterValue = $(this).data("filter-value");
      let $select = $("#" + filterType + "Filter");

      if ($select.val() === filterValue) {
        $select.val("");
      } else {
        $select.val(filterValue);
      }

      filterComplaints();
    },
  );
  $("#activeFilterChips").on("click", ".filter-chip", function () {
    removeFilter($(this).data("filter-type"));
  });

  $("#clearAllFiltersBtn, #emptyClearFiltersBtn").click(function () {
    clearAllFilters();
  });
}
function initializePagination() {
  $("#paginationPrevBtn").click(function () {
    goToPage(currentPage - 1);
  });

  $("#paginationNextBtn").click(function () {
    goToPage(currentPage + 1);
  });

  $("#paginationPages").on("click", ".pagination-page-btn", function () {
    goToPage(parseInt($(this).data("page"), 10));
  });
}

function initializeDeleteButtons() {  $("#complaintsContainer").on("click", ".delete-btn", function () {
    let complaintId = $(this).data("id");
    let confirmDelete = window.confirm(
      "Are you sure you want to delete this complaint?",
    );

    if (!confirmDelete) {
      return;
    }

    deleteComplaint(complaintId);
  });
}

$(document).ready(function () {
  if ($("#complaintsContainer").length === 0) {
    return;
  }

  initializeSearch();
  initializeFilters();
  initializePagination();
  initializeDeleteButtons();  loadComplaints();
});
