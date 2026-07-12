// src/components/layout/ThemeToggle.jsx

import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const isLight = theme === "light";

  return (
    <button
      type="button"
      className="btn-icon theme-toggle-button"
      onClick={toggleTheme}
      aria-label={
        isLight
          ? "Switch to dark mode"
          : "Switch to light mode"
      }
      title={
        isLight
          ? "Switch to dark mode"
          : "Switch to light mode"
      }
    >
      {isLight ? (
        <FiMoon size={17} />
      ) : (
        <FiSun size={17} />
      )}
    </button>
  );
}