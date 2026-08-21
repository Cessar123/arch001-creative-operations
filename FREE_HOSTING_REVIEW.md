# ARCH-001 Free Hosting Review

> **Decision context:** the user rejected Render's card-verification requirement. This review records provider constraints as of 21 August 2026 before an external deployment is attempted.

| Option | Confirmed free capability | Blocking constraint for ARCH-001 | Decision |
| --- | --- | --- |
| Render Free | Node web service; 750 instance-hours/month; sleeps after 15 minutes. | Dashboard requested card verification before service creation. | Rejected by user. |
| Koyeb Free | One web service with 512MB RAM, 0.1 vCPU, 2GB SSD; scales to zero after one hour. | Koyeb's current pricing FAQ says it requires a credit card and documents a $29 pre-authorization hold. | Not suitable for the user's no-card requirement. |
| Cloudflare Workers Free | Workers and Pages Functions; 100,000 requests/day and 10ms CPU per invocation. | Does not run the current Express server unchanged; requires a Worker/serverless adaptation and replacing Manus-only integrations. | Viable no-card technical path, but requires a separate migration. |
| Existing Manus deployment | Full React + Express + tRPC + Manus OAuth, database, storage, and LLM integration. | Uses Manus hosting rather than an external provider. | Keep as the feature-complete live version. |

## Recommendation

For a **true no-card external preview**, the repository now provides a Cloudflare Pages build that exposes the public shell while omitting the Manus-only backend features. Do not claim the current authenticated production chat will work until OAuth, database, LLM, and storage have been replaced with external services. The current Manus deployment remains the functional production link in the meantime.

## Sources

[1] [Render: Deploy for Free](https://render.com/docs/free)

[2] [Koyeb: Pricing FAQ](https://www.koyeb.com/docs/faqs/pricing)

[3] [Koyeb: Free Instances](https://www.koyeb.com/docs/reference/instances)

[4] [Cloudflare Workers: Pricing](https://developers.cloudflare.com/workers/platform/pricing/)
