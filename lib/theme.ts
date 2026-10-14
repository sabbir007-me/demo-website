/* Light / dark theme. The `dark` class on <html> is the single source of
 * truth: Tailwind's `dark:` variant and the `.dark` tokens in globals.css
 * both key off it. localStorage holds an explicit choice; without one the
 * site follows the OS setting. */

export type Theme = "light" | "dark";

export const THEME_KEY = "theme";
export const SYSTEM_DARK = "(prefers-color-scheme: dark)";

/**
 * Runs in <head> during HTML parsing, so the right theme is on <html> before
 * the first paint. Must stay self-contained: it is inlined as a string.
 */
export const themeScript = `(function(){try{var t=localStorage.getItem("${THEME_KEY}");var d=t==="dark"||(t!=="light"&&matchMedia("${SYSTEM_DARK}").matches);document.documentElement.classList.toggle("dark",d)}catch(e){}})()`;
