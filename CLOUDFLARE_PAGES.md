# Cloudflare Pages Public Preview

This repository now includes a **no-card public preview** build that is intentionally separate from the complete Manus application. It exists to expose ARCH-001’s world, team layer, districts, and production boundaries without publishing OAuth credentials, database access, storage credentials, or LLM keys.

## What this deployment contains

| Available in Cloudflare Pages | Kept on the Manus application |
| --- | --- |
| ARCH-001 overview, districts, DNA LOCK counts, and the team-layer protocol | Manus OAuth login and session management |
| Public team roles for Islam, Mustafa, Manus, and the continuity guard | Authenticated tRPC mutations and project data |
| A direct link to the complete operations room | LLM production chat, image generation, database, and storage |

> The Cloudflare build does **not** call `/api/trpc` and does **not** start the Manus login flow. It is a transparent public preview, not a fake copy of the production chat.

## Git-based deployment

Create a Cloudflare Pages project from `Cessar123/arch001-creative-operations` and use the following configuration.

| Field | Value |
| --- | --- |
| Production branch | `main` |
| Build command | `pnpm run build:cloudflare` |
| Build output directory | `dist/public` |
| Root directory | Leave empty |
| Environment variables | None required |

The committed [`wrangler.toml`](wrangler.toml) sets `pages_build_output_dir = "./dist/public"` as the project configuration. Cloudflare Pages treats the Wrangler configuration as a source of truth once it is deployed, so do not add secrets to it.[[1]]

## Local verification

```bash
pnpm run build:cloudflare
```

The generated static site is in `dist/public`. This command intentionally builds only the Vite client; the Express bundle is omitted. Cloudflare’s Pages build configuration supports a custom build command and output directory, while a standard Vite project normally outputs to `dist`; this project explicitly uses `dist/public`.[[2]]

## Next migration boundary

To move the full authenticated product off Manus, replace each internal service before connecting it to the public preview: OAuth, database, LLM proxy, and S3 storage. The recommended next backend target is Cloudflare Workers plus an external auth/database/AI provider, not a direct copy of the Express process.

## References

[1] [Cloudflare Pages Wrangler configuration](https://developers.cloudflare.com/pages/functions/wrangler-configuration/)

[2] [Cloudflare Pages build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/)
