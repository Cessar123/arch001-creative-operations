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
});
