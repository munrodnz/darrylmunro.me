/* eslint-env browser */

// Get theme data from local storage
let currentTheme = localStorage.getItem("theme");
const themeSetTimestamp = localStorage.getItem("themeSetTimestamp");
let userHasManuallySetTheme = false;

// Check if manual theme preference has expired (24 hours)
if (themeSetTimestamp) {
  const now = Date.now();
  const setTime = parseInt(themeSetTimestamp);
  const hoursSinceSet = (now - setTime) / (1000 * 60 * 60);

  if (hoursSinceSet < 24) {
    userHasManuallySetTheme = true;
  } else {
    localStorage.removeItem("theme");
    localStorage.removeItem("themeSetTimestamp");
    currentTheme = null;
  }
}

function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getPreferredTheme() {
  // If user manually set a theme, use it
  if (userHasManuallySetTheme && currentTheme) {
    return currentTheme;
  }

  // Default to dark mode
  return "dark";
}

let themeValue = getPreferredTheme();

function setPreference(isManualChange = false) {
  if (isManualChange) {
    localStorage.setItem("theme", themeValue);
    localStorage.setItem("themeSetTimestamp", Date.now().toString());
    userHasManuallySetTheme = true;
  }
  reflectPreference();
}

function reflectPreference() {
  document.documentElement.setAttribute("data-theme", themeValue);
  document.querySelector("#theme-btn")?.setAttribute("aria-label", themeValue);

  const body = document.body;
  if (body) {
    body.style.colorScheme = themeValue;
  }
}

// set early so no page flashes
reflectPreference();

window.onload = () => {
  function setThemeFeature() {
    reflectPreference();

    document.querySelector("#theme-btn")?.addEventListener("click", () => {
      themeValue = themeValue === "light" ? "dark" : "light";

      if (!document.startViewTransition) {
        setPreference(true);
        return;
      }

      document.startViewTransition(() => {
        setPreference(true);
      });
    });
  }

  setThemeFeature();
  document.addEventListener("astro:after-swap", setThemeFeature);
};

// sync with system changes only if user hasn't manually set
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", ({ matches: isDark }) => {
    if (!userHasManuallySetTheme) {
      themeValue = "dark"; // always default to dark
      setPreference(false);
    }
  });
