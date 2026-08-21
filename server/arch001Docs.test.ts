import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectFile = (filename: string) => readFileSync(resolve(process.cwd(), filename), "utf8");

describe("ARCH-001 repository documentation", () => {
  it("keeps the quick-start guide and the live operations link visible", () => {
    const readme = projectFile("README.md");

    expect(readme).toContain("ARCH-001 Creative Operations");
    expect(readme).toContain("https://crearchbot-mthmrq9b.manus.space");
    expect(readme).toContain("pnpm check");
    expect(readme).toContain("pnpm test");
    expect(readme).toContain("pnpm build");
  });

  it("preserves the DNA LOCK protocol and canonical registry reference", () => {
    const reference = projectFile("ARCH001_REFERENCE.md");

    expect(reference).toContain("ARCH-001@Es0314es");
    expect(reference).toContain("[3/6/9/5/7 | 1/1]");
    expect(reference).toContain("shared/arch001.ts");
    expect(reference).toContain("لا تدمج وجوه الأقارب");
  });

  it("keeps a production playbook with a locked opening episode", () => {
    const playbook = projectFile("ARCH001_PRODUCTION_PLAYBOOK.md");

    expect(playbook).toContain("Original Jewel → System Jewel → City → Cards → Episodes");
    expect(playbook).toContain("[001-DIR] ST-CAST-3D");
    expect(playbook).toContain("EP-001 — «رسالة الصباح التي ضاعت»");
    expect(playbook).toContain("لا تظهر شخصيات `READY` أو `PENDING`");
  });

  it("surfaces the locked opening episode as a chat suggestion", () => {
    const homePage = projectFile("client/src/pages/Home.tsx");

    expect(homePage).toContain("EP-MATRIX");
    expect(homePage).toContain("رسالة الصباح التي ضاعت");
    expect(homePage).toContain("ولا تضف READY أو PENDING بصريًا");
    expect(homePage).toContain("OPENING EPISODE PACKAGE");
    expect(homePage).toContain("شغّل EP-001");
    expect(homePage).toContain("onClick={() => send(ep001Prompt)}");
  });

  it("keeps the Render deployment plan free of Manus secrets", () => {
    const readme = projectFile("README.md");
    const renderPlan = projectFile("RENDER_DEPLOYMENT.md");
    const renderBlueprint = projectFile("render.yaml");

    expect(readme).toContain("RENDER_DEPLOYMENT.md");
    expect(renderPlan).toContain("Render Free");
    expect(renderPlan).toContain("BUILT_IN_FORGE_API_*");
    expect(renderPlan).toContain("No secret belongs");
    expect(renderBlueprint).toContain("plan: free");
    expect(renderBlueprint).not.toContain("BUILT_IN_FORGE_API_KEY:");
  });

  it("documents the shared ARCH-001 team layer for the Node operations room", () => {
    const teamLayer = projectFile("ARCH001_TEAM_LAYER.md");
    const homePage = projectFile("client/src/pages/Home.tsx");

    expect(teamLayer).toContain("طبقة واحدة، أدوار مختلفة");
    expect(teamLayer).toContain("origin_director");
    expect(teamLayer).toContain("human_reviewer");
    expect(homePage).toContain("ARCH001_TEAM_COMMAND");
    expect(homePage).toContain("طبقة الفريق");
    expect(projectFile("RENDER_DEPLOYMENT.md")).toContain("Team layer after external authentication");
    expect(projectFile("RENDER_DEPLOYMENT.md")).toContain("origin_director");
  });

  it("keeps the Cloudflare public preview isolated from Manus-only server features", () => {
    const cloudflareGuide = projectFile("CLOUDFLARE_PAGES.md");
    const preview = projectFile("client/src/CloudflarePreview.tsx");
    const bootstrap = projectFile("client/src/main.tsx");
    const wrangler = projectFile("wrangler.toml");

    expect(cloudflareGuide).toContain("pnpm run build:cloudflare");
    expect(cloudflareGuide).toContain("does **not** call `/api/trpc`");
    expect(preview).not.toContain("trpc.");
    expect(bootstrap).toContain("VITE_DEPLOYMENT_TARGET === \"cloudflare-pages\"");
    expect(wrangler).toContain('pages_build_output_dir = "./dist/public"');
  });
});
