$(document).ready(function () {
    /*
      CivicConnect Theme Controller
    */

    let themeStorageKey = "civicTheme";

    /*
      Apply theme
    */

    function applyTheme(themeName) {
        if (themeName === "light") {
            $("body").addClass("light-mode");

            $(".theme-toggle-btn").html(civicIcon("sun"));
        } else {
            $("body").removeClass("light-mode");

            $(".theme-toggle-btn").html(civicIcon("moon"));
        }
    }

    /*
      Load saved theme
    */

    function loadSavedTheme() {
        let savedTheme = localStorage.getItem(themeStorageKey);

        if (!savedTheme) {
            savedTheme = "dark";

            localStorage.setItem(themeStorageKey, savedTheme);
        }

        applyTheme(savedTheme);
    }

    /*
      Toggle theme
    */

    function toggleTheme() {
        let currentTheme = localStorage.getItem(themeStorageKey);

        let nextTheme = "light";

        if (currentTheme === "light") {
            nextTheme = "dark";
        }

        localStorage.setItem(themeStorageKey, nextTheme);

        applyTheme(nextTheme);
    }

    /*
      Register theme button
    */

    $(".theme-toggle-btn")
        .off("click")
        .on("click", function () {
            toggleTheme();
        });

    /*
      Initialize
    */

    loadSavedTheme();
});