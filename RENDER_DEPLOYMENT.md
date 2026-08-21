# Render Deployment Plan — ARCH-001

> **Purpose:** create a free staging/preview deployment of the Node application. The current Manus deployment remains the only feature-complete live version until the portability items below are completed.

## What Render can host now

Render can build and run the React + Express + tRPC application from this repository. The included [`render.yaml`](render.yaml) declares a Node web service using `pnpm build` and `pnpm start`; Render can connect a GitHub repository and redeploy on each push.[[1]]

The **Free** service is appropriate for a demo or preview, not continuous production. It goes to sleep after 15 minutes with no incoming request and can take about a minute to wake, has an ephemeral filesystem, and receives 750 free instance-hours per workspace each month.[[2]]

## Important portability boundary

The current server reads platform-managed Manus values from `server/_core/env.ts`, including `BUILT_IN_FORGE_API_*` for the production chat, Manus OAuth values for login, and the platform database connection. Those values must **not** be copied to GitHub or Render. Therefore, a Render service started before the migration below can act as a limited shell/preview only; the authenticated chat is not considered ready for external users.

| Capability | Current dependency | Required external replacement before feature-complete Render launch |
| --- | --- | --- |
| AI production chat | Manus Forge LLM (`BUILT_IN_FORGE_API_*`) | A provider API key stored in Render plus a server adapter that replaces the Manus-only LLM helper. |
| Login and user sessions | Manus OAuth (`VITE_APP_ID`, `OAUTH_SERVER_URL`) | An external OAuth/Auth provider and a new callback configuration. |
| Persistent projects and messages | Manus-provisioned `DATABASE_URL` | An external MySQL/TiDB-compatible database and a migration/backup plan. |
| Master map and later DNA sheets | Manus storage URL | External object storage or CDN, with all asset URLs updated. |

> **Safety rule:** No secret belongs in `render.yaml`, `.env.render.example`, client-side `VITE_*` variables, or a Git commit. Enter production values only in Render's Environment dashboard.

## Free preview deployment steps

1. Sign in to [Render](https://dashboard.render.com/) and choose **New → Blueprint** or **New → Web Service**.
2. Connect the public repository `Cessar123/arch001-creative-operations` and select branch `main`.
3. If using Blueprint, Render reads `render.yaml`. If creating manually, set the build command to `corepack enable && pnpm install --frozen-lockfile && pnpm build` and the start command to `pnpm start`.
4. Select **Free** as the instance plan and leave the health-check path as `/`.
5. Add no Manus credentials. For a shell preview, keep optional external integration values unset; for a feature-complete deployment, finish the migration table above first.
6. Deploy and test the generated `onrender.com` URL. The first request after idle can be slow because the free service wakes on demand.[[2]]

## Dashboard configuration recorded

On 21 August 2026, the Render dashboard recognized `Cessar123/arch001-creative-operations` as a **Node** repository on branch `main`, prefilled the build command `pnpm install --frozen-lockfile; pnpm run build` and start command `pnpm run start`, and exposed the **Free** instance choice (`$0/month`, `512 MB RAM`, `0.1 CPU`). The Environment Variables area was left empty intentionally: no Manus values were entered, and deployment still awaits the final user-approved action.

## Environment handoff

Use [`.env.render.example`](.env.render.example) only as a checklist. Render provides the runtime `PORT`; the server already reads it from the environment. Set `NODE_ENV=production` in Render. Create a fresh `JWT_SECRET` in Render rather than reusing a development or Manus value.

| Variable | Enter it now? | Reason |
| --- | --- | --- |
| `NODE_ENV` | Yes — `production` | Enables static production serving. |
| `PORT` | No | Render injects it. |
| `JWT_SECRET` | Render generates a fresh value | Required after external auth/session migration. |
| `DATABASE_URL` | Only after choosing external database | Manus database address is not portable. |
| `LLM_*` | Only after LLM adapter migration | Prevents a non-working or exposed chat integration. |
| `AUTH_*` | Only after choosing auth provider | Prevents redirect/callback mismatches. |

## Team layer after external authentication

The current **ARCH-001 Team Layer** is visible in the Node operations room and can load a shared message template into the production chat. After moving authentication off Manus, map the external provider's authenticated users to these application permissions in the database—never in frontend code or a GitHub file.

| Application permission | Team meaning | Allowed action |
| --- | --- | --- |
| `origin_director` | Islam's canonical-direction role | Propose and approve production direction; DNA changes still require a reference workflow. |
| `human_reviewer` | Mustafa's realism/comedy review role | Add human notes and request revisions; cannot mutate the canonical registry. |
| `producer` | Production translation role | Create scene/episode packages from approved inputs; cannot alter locks. |
| `continuity_guard` | Server policy, not a user account | Validates the registry and blocks drift before the production output is finalized. |

See [`ARCH001_TEAM_LAYER.md`](ARCH001_TEAM_LAYER.md) for the exact shared-message format. This separation keeps all three collaborators on one reference layer, while the server—not a chat message—enforces the final guardrails.

## Recommendation

Start with Render Free **only as a preview** because it supports Node web services and Git-linked deploys.[[1]] For a hobby fallback, Koyeb offers one free web service with 512MB RAM and 0.1 vCPU, but it also scales to zero after an hour and has no persistent volume.[[3]] Keep the Manus URL as the main production-facing location until the external replacements are selected and tested.

## References

[1] [Render: Deploy a Node Express App](https://render.com/docs/deploy-node-express-app)

[2] [Render: Deploy for Free](https://render.com/docs/free)

[3] [Koyeb: Free Instances](https://www.koyeb.com/docs/reference/instances)
