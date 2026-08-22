// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// STATIC_BUILD=1 produces a fully static site (GitHub Pages); otherwise the
// normal Lovable/Cloudflare server build is used.
const isStatic = process.env["STATIC_BUILD"] === "1";
// GitHub Pages project sites are served from /<repo>/; override with BASE_PATH if needed.
const basePath = isStatic ? (process.env["BASE_PATH"] ?? "/code-breaker-challenge/") : "/";

export default defineConfig(
  isStatic
    ? {
        nitro: false,
        vite: { base: basePath },
        tanstackStart: {
          prerender: { enabled: true, crawlLinks: true },
        },
      }
    : {
        tanstackStart: {
          // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
          // nitro/vite builds from this
          server: { entry: "server" },
        },
      },
);
