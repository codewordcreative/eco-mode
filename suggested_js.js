!function() {
    "use strict";

    // Cookie setup
    function setCookie(name, value, maxAgeSeconds) {
        document.cookie = `${name}=${value}; path=/; max-age=${maxAgeSeconds}`;
    }

    // Apply theme: light, eco, or null - because I default to dark, but replace light with dark if doing the opposite.
    function applyTheme(theme) {
        // Remove previous theme classes
        document.documentElement.classList.remove("light", "eco");

        if (theme === "light" || theme === "eco") {
            // Add the theme class - I use a simple css class for it.
            document.documentElement.classList.add(theme);
            // Store theme choice in a cookie for a year
            setCookie("theme", theme, 31536e3);
        } else {
            // If clicking the other one, remove theme cookie to revert to default
            setCookie("theme", "", 0);
        }

        // Update radio button status
        document.getElementById("theme-light").checked = theme === "light";
        document.getElementById("theme-eco").checked = theme === "eco";
        document.getElementById("theme-dark").checked = theme === null;
    }

    document.addEventListener("DOMContentLoaded", function() {
        // Check if theme cookie is set
        const currentTheme = (function() {
            const cookieParts = `; ${document.cookie}`.split("; theme=");
            return cookieParts.length === 2 ? cookieParts.pop().split(";").shift() : null;
        })();

        // Apply theme if valid, otherwise use default
        applyTheme(currentTheme === "light" || currentTheme === "eco" ? currentTheme : null);

        // Eco-adjacent support: If any of these are found, automatically apply low data mode (this includes manually setting eco)
        const isLowDataMode = (function() {
            const saveDataEnabled = navigator.connection?.saveData === true;
            const isSlowNetwork = ["slow-2g", "2g"].includes(navigator.connection?.effectiveType);
            const prefersReducedData = window.matchMedia?.("(prefers-reduced-data: reduce)").matches;
            const ecoModeActive = document.documentElement.classList.contains("eco");
            return saveDataEnabled || isSlowNetwork || prefersReducedData || ecoModeActive;
        })();

        // If low data mode is detected, remove speculative prefetch scripts
        if (isLowDataMode) {
            document.querySelectorAll('script[type="speculationrules"]').forEach(script => script.remove());
            console.log("Prefetch disabled: Low-data or eco mode rules applied.");
        }

        // Tooltip functionality
        const tooltipToggleButton = document.getElementById("tooltipToggle");
        const tooltipContent = document.getElementById("tooltipContent");

        tooltipToggleButton?.addEventListener("click", function() {
            const isExpanded = tooltipToggleButton.getAttribute("aria-expanded") === "true";
            tooltipToggleButton.setAttribute("aria-expanded", String(!isExpanded));
            tooltipContent.hidden = isExpanded;
        });

        document.addEventListener("click", function(event) {
            if (!tooltipContent || tooltipContent.hidden) return;
            if (tooltipToggleButton.contains(event.target) || tooltipContent.contains(event.target)) return;
            tooltipToggleButton.setAttribute("aria-expanded", "false");
            tooltipContent.hidden = true;
        });

        // Theme selection buttons event listeners
        document.getElementById("theme-light")?.addEventListener("click", () => applyTheme("light"));
        document.getElementById("theme-eco")?.addEventListener("click", () => applyTheme("eco"));
        document.getElementById("theme-dark")?.addEventListener("click", () => applyTheme(null));
    });
}();
