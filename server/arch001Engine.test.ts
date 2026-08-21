import { describe, expect, it, vi } from "vitest";

vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn(),
  listLLMModels: vi.fn(),
}));

import { buildArch001SystemPrompt, runArch001Chat } from "./arch001Engine";
import { invokeLLM, listLLMModels } from "./_core/llm";

describe("ARCH-001 production context", () => {
  it("contains the city hierarchy, the cast locks, and the no-drift contract", () => {
    const prompt = buildArch001SystemPrompt();
    expect(prompt).toContain("Original Jewel > System Jewel > ARCH-001 City");
    expect(prompt).toContain("إسلام سليم [MASTER-001]");
    expect(prompt).toContain("شمندي [SHEMENDI-FAMILY-003]");
    expect(prompt).toContain("Never blend relatives into one face");
    expect(prompt).toContain("[001-DIR] ST-CAST-3D");
    expect(prompt).toContain("TEAM LAYER GOVERNANCE");
    expect(prompt).toContain("مصطفى — مراجع الروح البشرية والكوميديا");
  });

  it("keeps visual locks distinct for siblings and pending citizens", () => {
    const prompt = buildArch001SystemPrompt();
    expect(prompt).toContain("عيد [EID-THE-IMPS-004]");
    expect(prompt).toContain("عودي [OUDI-IMPS-005]");
    expect(prompt).toContain("جوجو [JOJO-PENDING]");
    expect(prompt).toContain("status=PENDING");
  });

  it("keeps team direction separate from the DNA LOCK authority", () => {
    const prompt = buildArch001SystemPrompt();

    expect(prompt).toContain("retain Islam's direction and Mustafa's human/comedy note as separate inputs");
    expect(prompt).toContain("never treat either note as permission to change a locked face");
  });

  it("selects an available live model and sends the ARCH-001 system context", async () => {
    vi.mocked(listLLMModels).mockResolvedValue({ data: [{ id: "gpt-5-mini" }] } as never);
    vi.mocked(invokeLLM).mockResolvedValue({
      choices: [{ message: { content: "STATUS: LOCKED\nمشهد جاهز." } }],
    } as never);

    await expect(runArch001Chat([{ role: "user", content: "اكتب مشهدًا في D02" }])).resolves.toContain("STATUS: LOCKED");
    expect(invokeLLM).toHaveBeenCalledWith(expect.objectContaining({ model: "gpt-5-mini" }));
  });
});
