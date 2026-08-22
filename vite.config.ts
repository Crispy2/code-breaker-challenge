// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  // Inside Lovable the preset is pinned by LOVABLE_NITRO_PRESET; outside (e.g. GitHub
  // Actions) we emit a fully static site so it can be served from GitHub Pages.
  nitro: { preset: "static" },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    // Pre-render every page to static HTML and ship a client-side-routed fallback.
    prerender: { enabled: true, crawlLinks: true },
    spa: { enabled: true },
  },
});
