import { runArch001Chat } from "../server/arch001Engine.ts";

const checks = [
  {
    name: "scene-card",
    prompt: "[001-DIR] ST-CAST-3D — CAST: شمندي، جوري، عيد — LOCATION: D02 — FUNCTION: مشكلة صباحية كوميدية. اكتب بطاقة مشهد قصيرة فقط.",
  },
  {
    name: "episode-card",
    prompt: "اكتب بطاقة حلقة من أربع مشاهد عن عيد وعودي في D02. حافظ على اختلاف ملامحهما وأدوارهما، واكتب هوك ختامي.",
  },
  {
    name: "character-intake",
    prompt: "اعمل Character Intake لظاظا: اذكر حالته الحالية، عائلته، سكنه، وما المرجع الذي نحتاجه قبل أن يصبح LOCKED بصرياً.",
  },
];

const results = [];
for (const check of checks) {
  const content = await runArch001Chat([{ role: "user", content: check.prompt }]);
  if (!content.includes("STATUS:")) {
    throw new Error(`${check.name} did not return an ARCH-001 status line.`);
  }
  results.push({ name: check.name, preview: content.slice(0, 500) });
}

console.log(JSON.stringify({ results }, null, 2));
