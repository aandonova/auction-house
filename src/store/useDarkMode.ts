import { useEffect, useState } from "react";

const THEME_KEY = "theme";

function getInitial(): boolean {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "dark") return true;
  if (saved === "light") return false;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
}

export function useDarkMode() {
  const [isDark, setIsDark] = useState<boolean>(getInitial);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem(THEME_KEY, "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem(THEME_KEY, "light");
    }
  }, [isDark]);

  const toggle = () => setIsDark((d) => !d);

  return { isDark, toggle };
}