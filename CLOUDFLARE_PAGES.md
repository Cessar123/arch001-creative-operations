# Cloudflare Public Preview

This repository contains a **no-card public preview** that is intentionally separate from the complete Manus application. It exposes the ARCH-001 world, team layer, districts, and production boundaries without publishing OAuth credentials, database access, storage credentials, or LLM keys.

## Public deployment boundary

| Available in the Cloudflare preview | Kept in the Manus application |
| --- | --- |
| ARCH-001 overview, districts, DNA LOCK counts, and the team-layer protocol | Manus OAuth login and session management |
| Public team roles for Islam, Mustafa, Manus, and the continuity guard | Authenticated tRPC mutations and project data |
| A direct link to the complete operations room | LLM production chat, image generation, database, and storage |

> The Cloudflare build does **not** call `/api/trpc` and does **not** start the Manus login flow. It is a transparent public preview, not a fake copy of the production chat.

## Git deployment through Cloudflare Workers Builds

The current Cloudflare dashboard project is a **Workers Builds** project. This is why its deploy step runs `npx wrangler deploy` rather than the Cloudflare Pages uploader. The repository now supports that route as an assets-only Worker, which serves the Vite output from `dist/public`.

| Dashboard field | Required value |
| --- | --- |
| Production branch | `main` |
| Build command | `pnpm run build:cloudflare` |
| Deploy command | `npx wrangler deploy` |
| Root directory | Leave empty |
| Environment variables | None required |

Cloudflare Workers Builds injects `WORKERS_CI=1` into its build environment. The repository's default `pnpm run build` detects that value and automatically delegates to `pnpm run build:cloudflare`, so the current dashboard setting shown in the failed build is also safe after this change. The committed [`wrangler.toml`](wrangler.toml) sets the Worker name and configures the static-asset directory as `./dist/public`. It also enables single-page-application fallback for any future client-side paths. Do not add secrets to this file.

## Local verification

```bash
pnpm run build:cloudflare
```

The generated static site is in `dist/public`. The command builds only the Vite client; the Express bundle is omitted. `wrangler deploy` then uploads these static assets as part of the Cloudflare Worker deployment.

## Next migration boundary

To move the full authenticated product off Manus, replace each internal service before connecting it to the public preview: OAuth, database, LLM proxy, and S3 storage. The recommended backend target is Cloudflare Workers plus an external auth/database/AI provider, not a direct copy of the Express process.

## References

[1] [Cloudflare Workers static assets](https://developers.cloudflare.com/workers/static-assets/)

[2] [Cloudflare Workers Builds configuration](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/)
