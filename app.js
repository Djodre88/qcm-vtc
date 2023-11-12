document.addEventListener("DOMContentLoaded", function () {
    const themeForm = document.getElementById("theme-form");

    themeForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const selectedThemeOption = document.getElementById("theme-select").value;
        window.location.href = `questionnaire.html?theme=${encodeURIComponent(selectedThemeOption)}`;
    });
});