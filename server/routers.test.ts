import { beforeEach, describe, expect, it, vi } from "vitest";

const dbMocks = vi.hoisted(() => ({
  addChatMessage: vi.fn(),
  createProject: vi.fn(),
  getMessagesByProject: vi.fn(),
  getProjectById: vi.fn(),
  getProjectsByUser: vi.fn(),
  updateProject: vi.fn(),
}));

const engineMocks = vi.hoisted(() => ({
  runCreativeArchitecture: vi.fn(),
}));

vi.mock("./db", () => dbMocks);
vi.mock("./creativeEngine", () => engineMocks);

const { appRouter } = await import("./routers");

function context(userId = 7) {
  return {
    user: { id: userId, openId: `user-${userId}`, role: "user" },
    req: { protocol: "https", headers: {} },
    res: { clearCookie: vi.fn() },
  } as any;
}

const sampleProject = {
  id: 41,
  userId: 7,
  title: "مدينة النور",
  premise: "مدينة عائمة تحرسها مجموعة أطفال شجعان.",
  currentStage: 1,
};

const sampleOutput = {
  projectTitle: "مدينة النور",
  logline: "أطفال يحمون مدينتهم من عاصفة غامضة.",
  concept: "مغامرة دافئة.",
  stages: {
    characters: { summary: "ثلاثة أصدقاء", characters: [] },
    vehicles: { summary: "مركبة واحدة", vehicles: [] },
    locations: { summary: "ثلاثة مواقع", locations: [] },
    episode: { title: "العاصفة الأولى", logline: "البداية", scenes: [], endingHook: "يتبع" },
  },
  promo: { videoPrompt: "Cinematic animated teaser.", hook: "المدينة تحتاج حراسها" },
  assetPrompts: { characters: "Character sheet", locations: "Location map" },
};

describe("creative project tRPC flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    dbMocks.createProject.mockResolvedValue(41);
    dbMocks.addChatMessage.mockResolvedValue(1);
    dbMocks.getMessagesByProject.mockResolvedValue([]);
    dbMocks.getProjectsByUser.mockResolvedValue([sampleProject]);
    dbMocks.getProjectById.mockResolvedValue(sampleProject);
    dbMocks.updateProject.mockResolvedValue(true);
    engineMocks.runCreativeArchitecture.mockResolvedValue(sampleOutput);
  });

  it("creates a project and persists the initial premise message", async () => {
    const caller = appRouter.createCaller(context());
    const result = await caller.projects.create({ title: "مدينة النور", premise: sampleProject.premise });

    expect(result).toEqual({ projectId: 41 });
    expect(dbMocks.createProject).toHaveBeenCalledWith(expect.objectContaining({ userId: 7, currentStage: 1 }));
    expect(dbMocks.addChatMessage).toHaveBeenCalledWith(expect.objectContaining({ projectId: 41, role: "user", stage: 1 }));
  });

  it("runs one creative stage, persists output, and advances only one stage", async () => {
    const caller = appRouter.createCaller(context());
    const result = await caller.chat.send({ projectId: 41, content: "أضف بطلة تحب اختراع الطائرات الورقية." });

    expect(engineMocks.runCreativeArchitecture).toHaveBeenCalledWith(expect.any(String), expect.any(Array), 1);
    expect(dbMocks.updateProject).toHaveBeenCalledWith(41, 7, expect.objectContaining({ currentStage: 2 }));
    expect(result.currentStage).toBe(2);
    expect(result.completedStage).toBe(1);
    expect(dbMocks.addChatMessage).toHaveBeenLastCalledWith(expect.objectContaining({ role: "assistant", stage: 2 }));
  });

  it("prevents a user from reading another user's project", async () => {
    dbMocks.getProjectById.mockResolvedValue(undefined);
    const caller = appRouter.createCaller(context(7));

    await expect(caller.projects.get({ projectId: 41 })).rejects.toMatchObject({ code: "NOT_FOUND" });
    expect(dbMocks.getMessagesByProject).not.toHaveBeenCalled();
  });
});
