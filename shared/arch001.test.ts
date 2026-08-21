import { describe, expect, it } from "vitest";
import { archCharacters, getArchRegistryPayload } from "./arch001";

describe("ARCH-001 QR registry payloads", () => {
  it("maps every registered citizen to identity, family, residence, work, and district", () => {
    expect(archCharacters).toHaveLength(22);
    for (const character of archCharacters) {
      const payload = getArchRegistryPayload(character);
      expect(payload).toContain(`arch001://registry/${character.id}`);
      expect(payload).toContain("family=");
      expect(payload).toContain("home=");
      expect(payload).toContain("work=");
      expect(payload).toContain(`district=${character.district}`);
    }
  });
});
