import { describe, expect, it } from "vitest";
import { buildCreativePrompt, normalizeCreativeOutput } from "./creativeEngine";

describe("creative engine contract", () => {
  it("builds a sequential Arabic/English prompt with the core stages", () => {
    const prompt = buildCreativePrompt("مدينة عائمة تحرسها مجموعة أطفال", ["assistant: نريد نبرة دافئة"]);
    expect(prompt).toContain("[3/6/9/5/7 | 1/1]");
    expect(prompt).toContain("Characters");
    expect(prompt).toContain("Vehicles/assets");
    expect(prompt).toContain("Locations");
    expect(prompt).toContain("Episode one");
    expect(prompt).toContain("مدينة عائمة تحرسها مجموعة أطفال");
    expect(prompt).toContain("Previous conversation context");
  });

  it("normalizes a valid structured JSON response", () => {
    const result = normalizeCreativeOutput(JSON.stringify({
      projectTitle: "مدينة الضوء",
      logline: "أطفال يحمون مدينة عائمة.",
      concept: "مغامرة دافئة.",
      stages: {
        characters: { summary: "ثلاثة أصدقاء", characters: [] },
        vehicles: { summary: "مركبة واحدة", vehicles: [] },
        locations: { summary: "ثلاثة مواقع", locations: [] },
        episode: { title: "البداية", logline: "بداية الخطر", scenes: [], endingHook: "يتبع" },
      },
      promo: { videoPrompt: "Cinematic animated teaser.", hook: "الحكاية تبدأ الآن" },
      assetPrompts: { characters: "Character sheet", locations: "Location map" },
    }));

    expect(result.projectTitle).toBe("مدينة الضوء");
    expect(result.promo.hook).toBe("الحكاية تبدأ الآن");
  });

  it("accepts fenced JSON and rejects invalid content", () => {
    expect(normalizeCreativeOutput("```json\n{\"projectTitle\":\"A\"}\n```").projectTitle).toBe("A");
    expect(() => normalizeCreativeOutput("not json")).toThrow("invalid JSON");
  });
});
