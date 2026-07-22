import { ScriptOnce } from "@tanstack/react-router"
import type { JSX } from "react"
import {
  DEFAULT_GRAY_PALETTE,
  DEFAULT_PRIMARY_PALETTE,
  GRAY_PALETTE_OPTIONS,
  GRAY_PALETTE_STORAGE_KEY,
  PRIMARY_PALETTE_OPTIONS,
  PRIMARY_PALETTE_STORAGE_KEY,
} from "#/utils/theme-palette"

/*
    Resolves the gray and primary color palettes from localStorage (falling back to the
    defaults) and applies them to <html> before React hydrates to avoid a flash of the
    wrong palette (FOUC).

    Placement matters: this component MUST render before <Outlet /> in <body>, next to
    <RouteRootTheme />. See -route-root-theme.tsx for details.
*/
export function RouteRootPalette(): JSX.Element {
  return (
    <ScriptOnce>
      {`
        const grayPalettes = ${JSON.stringify(GRAY_PALETTE_OPTIONS)};
        const primaryPalettes = ${JSON.stringify(PRIMARY_PALETTE_OPTIONS)};

        function applyPalette(palettes, storageKey, fallback) {
          const stored = localStorage.getItem(storageKey);
          const palette = palettes.includes(stored) ? stored : fallback;
          const root = document.documentElement;
          root.classList.remove(...palettes);
          root.classList.add(palette);
        }

        function applyPalettes() {
          applyPalette(grayPalettes, '${GRAY_PALETTE_STORAGE_KEY}', '${DEFAULT_GRAY_PALETTE}');
          applyPalette(primaryPalettes, '${PRIMARY_PALETTE_STORAGE_KEY}', '${DEFAULT_PRIMARY_PALETTE}');
        }

        function onPaletteStorage(event) {
          // event.key is null when storage is cleared; in both cases the palettes may have changed.
          if (
            event.key === '${GRAY_PALETTE_STORAGE_KEY}' ||
            event.key === '${PRIMARY_PALETTE_STORAGE_KEY}' ||
            event.key === null
          ) {
            applyPalettes();
          }
        }

        applyPalettes();

        // Keep other tabs of the site in sync when the palettes are changed in one of them.
        window.addEventListener('storage', onPaletteStorage);
      `}
    </ScriptOnce>
  )
}
