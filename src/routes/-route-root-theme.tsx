import { ScriptOnce } from "@tanstack/react-router"
import type { JSX } from "react"

/*
    Resolves the theme from localStorage (falling back to the system preference) and applies
    it to <html> before React hydrates to avoid a flash of the wrong theme (FOUC).

    Placement matters: this component MUST render before <Outlet /> in <body>.
    `ScriptOnce` emits a synchronous inline <script> that runs where it appears in the
    HTML. If rendered after the page content, a hard reload (Cmd+Shift+R) can paint the
    body with the default (light) theme before the script attaches the resolved
    `dark`/`light` class, producing a visible white flash on dark mode.

    See: https://tanstack.com/router/latest/docs/guide/document-head-management#inline-scripts-with-scriptonce
*/
export function RouteRootTheme(): JSX.Element {
  return (
    <ScriptOnce>
      {`
        function applyTheme() {
          const theme = localStorage.getItem('theme') ?? 'auto';
          const resolved = theme === 'auto'
          ? (prefersDark.matches ? 'dark' : 'light')
          : theme;
          const root = document.documentElement;
          root.classList.remove('light', 'dark');
          root.classList.add(resolved);
        }

        function onThemeChange() {
          if ((localStorage.getItem('theme') ?? 'auto') === 'auto') {
            applyTheme();
          }
        }

        function onStorage(event) {
          // event.key is null when storage is cleared; in both cases the theme may have changed.
          if (event.key === 'theme' || event.key === null) {
            applyTheme();
          }
        }

        const prefersDark = matchMedia('(prefers-color-scheme: dark)');

        applyTheme();

        // Follow the OS preference live while the user is in auto mode, so flipping the
        // system theme updates the page without needing a reload.
        prefersDark.addEventListener('change', onThemeChange);

        // Keep other tabs of the site in sync when the theme is changed in one of them.
        window.addEventListener('storage', onStorage);
      `}
    </ScriptOnce>
  )
}
