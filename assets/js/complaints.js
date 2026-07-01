$(document).ready(function () {
  if ($("#complaintsContainer").length === 0) {
    return;
  }

  let dashboardState = {
    allComplaints: [],
    filteredComplaints: [],
    selectedComplaints: [],
    searchDebounceTimer: null,
    currentPage: 1,
    complaintsPerPage: 6,
    searchDebounceMs: 300,
  };

  let filterOptions = {
    categories: ["Garbage", "Electricity", "Water", "Gas", "Road Damage"],
    statuses: ["Pending", "In Progress", "Resolved"],
    languages: ["English", "Roman Urdu", "Urdu"],
  };

  let statusClassMap = {
    Pending: "pending-status",
    "In Progress": "progress-status",
    Resolved: "resolved-status",
  };

  let categoryClassMap = {
    Garbage: "category-garbage",
    Electricity: "category-electricity",
    Water: "category-water",
    Gas: "category-gas",
    "Road Damage": "category-road",
  };

  function escapeHtml(text) {
    if (!text) {
      return "";
    }

    return String(text)
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

  function getActiveFilterValues() {
    return {
      category: $("#categoryFilter").val(),
      status: $("#statusFilter").val(),
      language: $("#languageFilter").val(),
      date: $("#dateFilter").val(),
    };
  }

  function hasActiveFilters(searchTerms) {
    let filters = getActiveFilterValues();

    return (
      searchTerms.length > 0 ||
      filters.category !== "" ||
      filters.status !== "" ||
      filters.language !== "" ||
      filters.date !== ""
    );
  }

  function getComplaintTimestamp(complaint) {
    if (!complaint.timestamp || !complaint.timestamp.toDate) {
      return null;
    }

    return complaint.timestamp.toDate();
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

  function matchesSearch(complaint, searchTerms) {
    if (searchTerms.length === 0) {
      return true;
    }

    let searchableText = (
      (complaint.category || "") +
      " " +
      (complaint.complaintText || "") +
      " " +
      (complaint.generatedComplaint || "") +
      " " +
      (complaint.location || "") +
      " " +
      (complaint.language || "") +
      " " +
      (complaint.status || "")
    ).toLowerCase();

    let allTermsMatch = true;

    searchTerms.forEach(function (term) {
      if (searchableText.indexOf(term) === -1) {
        allTermsMatch = false;
      }
    });

    return allTermsMatch;
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

    if (!matchesSearch(complaint, searchTerms)) {
      return false;
    }

    return true;
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

  function getStatusClass(status) {
    return statusClassMap[status] || "pending-status";
  }

  function getCategoryBadgeClass(category) {
    return categoryClassMap[category] || "category-default";
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

  function getTotalPages(totalItems) {
    return Math.max(
      1,
      Math.ceil(totalItems / dashboardState.complaintsPerPage),
    );
  }

  function getPageSlice(complaints, page) {
    let startIndex = (page - 1) * dashboardState.complaintsPerPage;

    return complaints.slice(
      startIndex,
      startIndex + dashboardState.complaintsPerPage,
    );
  }

  function scrollToComplaints() {
    $("html, body").animate(
      {
        scrollTop: $("#complaintsContainer").offset().top - 100,
      },
      300,
    );
  }

  function updateResultsSummary(
    filteredCount,
    totalCount,
    searchTerms,
    pageStart,
    pageEnd,
  ) {
    let summaryText = "";

    if (totalCount === 0) {
      $("#searchResultsSummary").hide().text("");

      return;
    }

    if (filteredCount === 0) {
      summaryText = "No complaints match your current filters";
    } else if (filteredCount > dashboardState.complaintsPerPage) {
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
        "Showing " +
        filteredCount +
        " of " +
        totalCount +
        " complaints matching your filters";
    } else {
      summaryText =
        "Showing all " + totalCount + " complaints in your dashboard";
    }

    $("#searchResultsSummary").text(summaryText).show();
  }

  function renderPagination(totalItems) {
    let totalPages = getTotalPages(totalItems);

    if (totalItems === 0 || totalPages <= 1) {
      $("#complaintsPagination").removeClass("visible");

      $("#paginationPages").empty();

      return;
    }

    $("#complaintsPagination").addClass("visible");

    $("#paginationPrevBtn").prop("disabled", dashboardState.currentPage === 1);

    $("#paginationNextBtn").prop(
      "disabled",
      dashboardState.currentPage === totalPages,
    );

    let pagesHtml = "";

    for (let page = 1; page <= totalPages; page++) {
      pagesHtml += `
                <button
                    type="button"
                    class="pagination-page-btn ${page === dashboardState.currentPage ? "active-page" : ""}"
                    data-page="${page}">
                    ${page}
                </button>
            `;
    }

    $("#paginationPages").html(pagesHtml);
  }

  function goToPage(page) {
    let totalPages = getTotalPages(dashboardState.filteredComplaints.length);

    if (page < 1) {
      page = 1;
    }

    if (page > totalPages) {
      page = totalPages;
    }

    dashboardState.currentPage = page;

    renderComplaints(
      dashboardState.filteredComplaints,
      getSearchTerms(),
      false,
    );

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

  function getCountsByField(fieldName, searchTerms) {
    let counts = {};

    let filters = getActiveFilterValues();

    let options = [];

    if (fieldName === "category") {
      options = filterOptions.categories;

      filters.category = "";
    }

    if (fieldName === "status") {
      options = filterOptions.statuses;

      filters.status = "";
    }

    if (fieldName === "language") {
      options = filterOptions.languages;

      filters.language = "";
    }

    options.forEach(function (option) {
      counts[option] = 0;
    });

    dashboardState.allComplaints.forEach(function (complaint) {
      if (!complaintMatchesFilters(complaint, searchTerms, filters)) {
        return;
      }

      let value = complaint[fieldName] || "English";

      if (counts[value] !== undefined) {
        counts[value]++;
      }
    });

    return counts;
  }

  function updateSelectCounts(selector, counts, allLabel) {
    $(selector + " option").each(function () {
      let value = $(this).val();

      if (value === "") {
        $(this).text(
          allLabel + " (" + dashboardState.allComplaints.length + ")",
        );

        return;
      }

      $(this).text(value + " (" + (counts[value] || 0) + ")");
    });
  }

  function updateFilterOptionCounts() {
    let searchTerms = getSearchTerms();

    updateSelectCounts(
      "#categoryFilter",
      getCountsByField("category", searchTerms),
      "All Categories",
    );

    updateSelectCounts(
      "#statusFilter",
      getCountsByField("status", searchTerms),
      "All Statuses",
    );

    updateSelectCounts(
      "#languageFilter",
      getCountsByField("language", searchTerms),
      "All Languages",
    );
  }

  function updateQuickFilterGroup(selector, fieldName, counts, activeValue) {
    $(selector + " .quick-filter-pill").each(function () {
      let value = $(this).data("filter-value");

      let count = counts[value] || 0;

      if (fieldName === "status") {
        $(this)
          .removeClass("pending-status progress-status resolved-status")
          .addClass(getStatusClass(value));
      }

      $(this)
        .toggleClass("active-pill", value === activeValue)
        .toggleClass("pill-disabled", count === 0)
        .attr("aria-pressed", value === activeValue ? "true" : "false")
        .find(".pill-count")
        .text(count);
    });
  }

  function updateQuickFilterPills() {
    let searchTerms = getSearchTerms();

    let filters = getActiveFilterValues();

    updateQuickFilterGroup(
      "#categoryQuickFilters",
      "category",
      getCountsByField("category", searchTerms),
      filters.category,
    );

    updateQuickFilterGroup(
      "#statusQuickFilters",
      "status",
      getCountsByField("status", searchTerms),
      filters.status,
    );

    updateQuickFilterGroup(
      "#languageQuickFilters",
      "language",
      getCountsByField("language", searchTerms),
      filters.language,
    );
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

    $("#dateFilter").toggleClass(
      "filter-active",
      $("#dateFilter").val() !== "",
    );
  }

  function renderActiveFilterChips() {
    let searchTerms = getSearchTerms();

    let filters = getActiveFilterValues();

    let chipsHtml = "";

    if ($("#complaintSearch").val().trim() !== "") {
      chipsHtml += `
                <button
                    type="button"
                    class="filter-chip"
                    data-filter-type="search">
                    Search: ${escapeHtml($("#complaintSearch").val().trim())}
                    <span aria-hidden="true">×</span>
                </button>
            `;
    }

    if (filters.category !== "") {
      chipsHtml += `
                <button
                    type="button"
                    class="filter-chip"
                    data-filter-type="category">
                    Category: ${escapeHtml(filters.category)}
                    <span aria-hidden="true">×</span>
                </button>
            `;
    }

    if (filters.status !== "") {
      chipsHtml += `
                <button
                    type="button"
                    class="filter-chip"
                    data-filter-type="status">
                    Status: ${escapeHtml(filters.status)}
                    <span aria-hidden="true">×</span>
                </button>
            `;
    }

    if (filters.language !== "") {
      chipsHtml += `
                <button
                    type="button"
                    class="filter-chip"
                    data-filter-type="language">
                    Language: ${escapeHtml(filters.language)}
                    <span aria-hidden="true">×</span>
                </button>
            `;
    }

    if (filters.date !== "") {
      chipsHtml += `
                <button
                    type="button"
                    class="filter-chip"
                    data-filter-type="date">
                    Date: ${escapeHtml(getDateFilterLabel(filters.date))}
                    <span aria-hidden="true">×</span>
                </button>
            `;
    }

    $("#activeFilterChips").html(chipsHtml);

    $("#activeFiltersBar").toggleClass(
      "visible",
      hasActiveFilters(searchTerms),
    );
  }

  function updateFilterControls() {
    updateFilterOptionCounts();

    updateQuickFilterPills();

    updateFilterSelectStates();

    renderActiveFilterChips();
  }

  function clearAllFilters() {
    if (dashboardState.searchDebounceTimer) {
      clearTimeout(dashboardState.searchDebounceTimer);
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

  function buildQuickFilterGroup(options, filterType) {
    let html = "";

    options.forEach(function (option) {
      let statusClass = "";

      if (filterType === "status") {
        statusClass = getStatusClass(option);
      }

      html += `
                <button
                    type="button"
                    class="quick-filter-pill ${statusClass}"
                    data-filter-type="${filterType}"
                    data-filter-value="${option}"
                    aria-pressed="false">
                    ${option}
                    <span class="pill-count">0</span>
                </button>
            `;
    });

    return html;
  }

  function buildQuickFilterPills() {
    $("#categoryQuickFilters").html(
      buildQuickFilterGroup(filterOptions.categories, "category"),
    );

    $("#statusQuickFilters").html(
      buildQuickFilterGroup(filterOptions.statuses, "status"),
    );

    $("#languageQuickFilters").html(
      buildQuickFilterGroup(filterOptions.languages, "language"),
    );
  }

  function buildComplaintCard(complaint, searchTerms) {
    let statusClass = getStatusClass(complaint.status);

    let categoryClass = getCategoryBadgeClass(complaint.category);

    let previewText =
      complaint.complaintText || complaint.generatedComplaint || "";

    let preview = highlightSearchTerms(
      truncateText(previewText, 120),
      searchTerms,
    );

    let categoryLabel = highlightSearchTerms(
      complaint.category || "Complaint",
      searchTerms,
    );

    let statusLabel = highlightSearchTerms(
      complaint.status || "Pending",
      searchTerms,
    );

    let metaLine = highlightSearchTerms(
      (complaint.location || "Karachi") +
        " · " +
        (complaint.language || "English") +
        " · " +
        formatComplaintDate(complaint.timestamp),
      searchTerms,
    );

    let fullComplaint = escapeHtml(
      complaint.generatedComplaint || complaint.complaintText || "",
    );

    return `
    <div class="col-lg-4 col-md-6">
        <div
            class="complaint-card"
            data-id="${complaint.id}">

            <label class="bulk-select-wrap">
                <input
                    type="checkbox"
                    class="bulk-select-checkbox"
                    data-id="${complaint.id}">
                <span>Select</span>
            </label>
                    
                    <div class="complaint-card-top">
                        <span class="category-badge ${categoryClass}">
                            ${categoryLabel}
                        </span>

                        <span class="complaint-status ${statusClass}">
                            ${statusLabel}
                        </span>
                    </div>

                    <h3>
                        ${categoryLabel} Complaint
                    </h3>

                    <p class="complaint-preview">
                        ${preview}
                    </p>

                    <p class="complaint-meta">
                        ${metaLine}
                    </p>

                   <div class="dashboard-actions">
    <a
        href="complaint-details.html?id=${complaint.id}"
        class="dashboard-btn">
        Open Details
    </a>

    <button
        type="button"
        class="dashboard-btn view-full-btn">
        View Full
    </button>

                        <button
                            type="button"
                            class="dashboard-btn delete-btn"
                            data-id="${complaint.id}">
                            🗑 Delete
                        </button>
                    </div>

                    <div
                        class="full-complaint"
                        style="display:none;">
                        <hr>
                        <p>
                            ${fullComplaint}
                        </p>
                    </div>
                </div>
            </div>
        `;
  }

  function buildSkeletonCard() {
    return `
            <div class="col-lg-4 col-md-6">
                <div class="complaint-card skeleton-card">
                    <div class="skeleton-card-top">
                        <span class="skeleton-block skeleton-badge"></span>
                        <span class="skeleton-block skeleton-status"></span>
                    </div>

                    <span class="skeleton-block skeleton-title"></span>
                    <span class="skeleton-block skeleton-line"></span>
                    <span class="skeleton-block skeleton-line skeleton-line-short"></span>
                    <span class="skeleton-block skeleton-meta"></span>
                    <span class="skeleton-block skeleton-btn"></span>
                </div>
            </div>
        `;
  }

  function showLoadingState() {
    let skeletonHtml = "";

    $("#skeletonLoadingLabel").show();

    $("#emptyBox").hide();

    $("#searchResultsSummary").hide();

    $("#activeFiltersBar").removeClass("visible");

    $("#complaintsPagination").removeClass("visible");

    for (let index = 0; index < dashboardState.complaintsPerPage; index++) {
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
      hasActiveFilters(getSearchTerms()) &&
      dashboardState.allComplaints.length > 0;

    hideLoadingState();

    $("#emptyBoxMessage").text(message);

    $("#emptyBox").show();

    $("#complaintsContainer").empty();

    if (hasFilters) {
      $("#emptyBoxTitle").text("No Matching Complaints");

      $("#emptyBoxPrimaryActions").hide();

      $("#emptyBoxFilterActions").show();

      $("#emptyClearFiltersBtn").show();
    } else {
      $("#emptyBoxTitle").text("No Complaints Yet");

      $("#emptyBoxPrimaryActions").show();

      $("#emptyBoxFilterActions").hide();

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
      dashboardState.currentPage = 1;
    }

    dashboardState.filteredComplaints = complaints;

    let totalPages = getTotalPages(dashboardState.filteredComplaints.length);

    if (dashboardState.currentPage > totalPages) {
      dashboardState.currentPage = totalPages;
    }

    if (dashboardState.filteredComplaints.length === 0) {
      updateResultsSummary(
        0,
        dashboardState.allComplaints.length,
        searchTerms,
        0,
        0,
      );

      renderPagination(0);

      if (dashboardState.allComplaints.length === 0) {
        showEmptyState("You have not submitted any complaints yet.");
      } else {
        showEmptyState(
          "No complaints match your current search or filters. Try removing one filter, clearing the search box, or reporting a new issue.",
        );
      }

      updateFilterControls();

      return;
    }

    hideEmptyState();

    let pageComplaints = getPageSlice(
      dashboardState.filteredComplaints,
      dashboardState.currentPage,
    );

    let startIndex =
      (dashboardState.currentPage - 1) * dashboardState.complaintsPerPage + 1;

    let endIndex = startIndex + pageComplaints.length - 1;

    updateResultsSummary(
      dashboardState.filteredComplaints.length,
      dashboardState.allComplaints.length,
      searchTerms,
      startIndex,
      endIndex,
    );

    let cardsHtml = "";

    pageComplaints.forEach(function (complaint) {
      cardsHtml += buildComplaintCard(complaint, searchTerms);
    });

    $("#complaintsContainer").html(cardsHtml);

    renderPagination(dashboardState.filteredComplaints.length);

    updateFilterControls();
  }

  function filterComplaints(keepPage) {
    let searchTerms = getSearchTerms();

    let filters = getActiveFilterValues();

    let matchedComplaints = dashboardState.allComplaints.filter(
      function (complaint) {
        return complaintMatchesFilters(complaint, searchTerms, filters);
      },
    );

    renderComplaints(matchedComplaints, searchTerms, !keepPage);
  }

  function sortComplaintsByDate(complaints) {
    return complaints.sort(function (first, second) {
      let firstTime = getComplaintTimestamp(first)
        ? getComplaintTimestamp(first).getTime()
        : 0;

      let secondTime = getComplaintTimestamp(second)
        ? getComplaintTimestamp(second).getTime()
        : 0;

      return secondTime - firstTime;
    });
  }

  function loadComplaints() {
    showLoadingState();

    let currentUser = firebaseAuth.currentUser;

    if (!currentUser) {
      showToast("Please login to view your complaints.", "warning");

      hideLoadingState();

      return;
    }

    civicFirestoreService.listenUserComplaints(
      currentUser.uid,

      function (snapshot) {
        dashboardState.allComplaints = [];

        snapshot.forEach(function (doc) {
          let complaintData = doc.data();

          complaintData.id = doc.id;

          dashboardState.allComplaints.push(complaintData);
        });

        filterComplaints(true);
      },

      function (error) {
        console.log(error);

        hideLoadingState();

        showEmptyState("Could not load complaints. Please refresh the page.");

        showToast("Failed to load complaints from the database.", "danger");
      },
    );
  }

  function deleteComplaint(complaintId) {
    complaintsCollection
      .doc(complaintId)
      .delete()
      .then(function () {
        dashboardState.allComplaints = dashboardState.allComplaints.filter(
          function (complaint) {
            return complaint.id !== complaintId;
          },
        );

        filterComplaints(true);

        showToast("Complaint deleted successfully.", "success");
      })
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

      if (dashboardState.searchDebounceTimer) {
        clearTimeout(dashboardState.searchDebounceTimer);
      }

      dashboardState.searchDebounceTimer = setTimeout(function () {
        setSearchPending(false);

        filterComplaints();
      }, dashboardState.searchDebounceMs);
    });

    $("#clearSearchBtn").click(function () {
      if (dashboardState.searchDebounceTimer) {
        clearTimeout(dashboardState.searchDebounceTimer);
      }

      setSearchPending(false);

      $("#complaintSearch").val("").focus();

      updateSearchClearButton();

      filterComplaints();
    });

    $("#complaintSearch").on("keydown", function (event) {
      if (event.key === "Escape") {
        if (dashboardState.searchDebounceTimer) {
          clearTimeout(dashboardState.searchDebounceTimer);
        }

        setSearchPending(false);

        $("#complaintSearch").val("");

        updateSearchClearButton();

        filterComplaints();
      }
    });
  }

  function initializeFilters() {
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
      goToPage(dashboardState.currentPage - 1);
    });

    $("#paginationNextBtn").click(function () {
      goToPage(dashboardState.currentPage + 1);
    });

    $("#paginationPages").on("click", ".pagination-page-btn", function () {
      goToPage(parseInt($(this).data("page"), 10));
    });
  }
  function updateBulkActionsBar() {
    let selectedCount = dashboardState.selectedComplaints.length;

    $("#selectedComplaintsCount").text(selectedCount);

    if (selectedCount > 0) {
      $("#bulkActionsBar").addClass("visible");
    } else {
      $("#bulkActionsBar").removeClass("visible");
    }
  }

  function toggleComplaintSelection(complaintId, isSelected) {
    if (isSelected) {
      if (dashboardState.selectedComplaints.indexOf(complaintId) === -1) {
        dashboardState.selectedComplaints.push(complaintId);
      }
    } else {
      dashboardState.selectedComplaints =
        dashboardState.selectedComplaints.filter(function (id) {
          return id !== complaintId;
        });
    }

    $('.complaint-card[data-id="' + complaintId + '"]').toggleClass(
      "selected",
      isSelected,
    );

    updateBulkActionsBar();
  }
  function exportSelectedComplaints() {
    if (dashboardState.selectedComplaints.length === 0) {
      showToast("Please select at least one complaint to export.", "warning");

      return;
    }

    let selectedData = dashboardState.allComplaints.filter(
      function (complaint) {
        return dashboardState.selectedComplaints.indexOf(complaint.id) !== -1;
      },
    );

    let exportText = "CivicConnect Selected Complaints\n";
    exportText += "================================\n\n";

    selectedData.forEach(function (complaint, index) {
      exportText += "Complaint " + (index + 1) + "\n";
      exportText += "ID: " + complaint.id + "\n";
      exportText += "Category: " + (complaint.category || "N/A") + "\n";
      exportText += "Status: " + (complaint.status || "Pending") + "\n";
      exportText += "Language: " + (complaint.language || "English") + "\n";
      exportText += "Location: " + (complaint.location || "Karachi") + "\n";
      exportText += "Date: " + formatComplaintDate(complaint.timestamp) + "\n";
      exportText +=
        "Complaint Text: " + (complaint.complaintText || "N/A") + "\n";
      exportText +=
        "Generated Complaint: " +
        (complaint.generatedComplaint || "N/A") +
        "\n";
      exportText += "\n--------------------------------\n\n";
    });

    let blob = new Blob([exportText], {
      type: "text/plain;charset=utf-8",
    });

    let exportUrl = URL.createObjectURL(blob);

    let downloadLink = document.createElement("a");

    downloadLink.href = exportUrl;

    downloadLink.download = "civicconnect-selected-complaints.txt";

    document.body.appendChild(downloadLink);

    downloadLink.click();

    document.body.removeChild(downloadLink);

    URL.revokeObjectURL(exportUrl);

    showToast("Selected complaints exported successfully.", "success");
  }
  function initializeCardActions() {
    $("#complaintsContainer").on(
      "change",
      ".bulk-select-checkbox",
      function () {
        let complaintId = $(this).data("id");

        let isSelected = $(this).is(":checked");

        toggleComplaintSelection(complaintId, isSelected);
      },
    );
    $("#complaintsContainer").on("click", ".view-full-btn", function () {
      $(this).closest(".complaint-card").find(".full-complaint").slideToggle();
    });
    function deleteSelectedComplaints() {
      if (dashboardState.selectedComplaints.length === 0) {
        showToast("Please select at least one complaint first.", "warning");

        return;
      }

      let confirmDelete = window.confirm(
        "Are you sure you want to delete " +
          dashboardState.selectedComplaints.length +
          " selected complaint(s)?",
      );

      if (!confirmDelete) {
        return;
      }
      $("#bulkDeleteBtn").click(function () {
        deleteSelectedComplaints();
      });

      let deletePromises = [];
      $("#bulkExportBtn").click(function () {
        exportSelectedComplaints();
      });
      dashboardState.selectedComplaints.forEach(function (complaintId) {
        deletePromises.push(complaintsCollection.doc(complaintId).delete());
      });

      Promise.all(deletePromises)
        .then(function () {
          dashboardState.allComplaints = dashboardState.allComplaints.filter(
            function (complaint) {
              return (
                dashboardState.selectedComplaints.indexOf(complaint.id) === -1
              );
            },
          );

          dashboardState.selectedComplaints = [];

          updateBulkActionsBar();

          filterComplaints(true);

          showToast("Selected complaints deleted successfully.", "success");
        })
        .catch(function (error) {
          console.log(error);

          showToast("Could not delete selected complaints.", "danger");
        });
    }
    $("#complaintsContainer").on("click", ".delete-btn", function () {
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

  initializeSearch();

  initializeFilters();

  initializePagination();

  initializeCardActions();

  loadComplaints();
});
