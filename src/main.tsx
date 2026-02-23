import "./i18n";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { I18nextProvider, useTranslation } from "react-i18next";
import i18n from "./i18n";
import "./theme/tokens.css";
import "./theme/light.css";
import "./theme/dark.css";
import "./theme/enrollment-dark.css";
import "./index.css";
import { loadUXtweak } from "./utils/uxtweakLoader";
import { loadUXsniff } from "./utils/uxsniffLoader";
import { router } from "./app/router.tsx";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { OtpProvider } from "./context/OtpContext";
import { UserProvider } from "./context/UserContext";

// Initialize theme from localStorage before first paint (avoids flash)
const savedTheme = localStorage.getItem("theme");
const isDark = savedTheme === "dark";
document.documentElement.classList.remove("light", "dark");
document.documentElement.classList.add(isDark ? "dark" : "light");

/** Keys router to current language so all route content remounts and picks up new translations. */
function RootWithLanguageKey() {
  const { i18n: i18nInstance } = useTranslation();
  return (
    <AuthProvider>
      <OtpProvider>
        <UserProvider>
          <ThemeProvider>
            <RouterProvider key={i18nInstance.language || "en"} router={router} />
          </ThemeProvider>
        </UserProvider>
      </OtpProvider>
    </AuthProvider>
  );
}

loadUXtweak();
loadUXsniff();

createRoot(document.getElementById("root")!).render(
  <I18nextProvider i18n={i18n}>
    <StrictMode>
      <RootWithLanguageKey />
    </StrictMode>
  </I18nextProvider>,
);
