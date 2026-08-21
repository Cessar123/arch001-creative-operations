import { readFile } from "node:fs/promises";
import { invokeLLM, listLLMModels } from "../server/_core/llm.ts";

const prompt = await readFile("/home/ubuntu/ARCH001_RAPID_INJECTION_PROMPT.md", "utf8");
const imageBytes = await readFile("/home/ubuntu/arch001_master_map_injection_sheet.png");
const { data } = await listLLMModels();
const ids = data.map((model) => model.id);
const model = ids.includes("gemini-3-flash-preview") ? "gemini-3-flash-preview" : ids[0];

const response = await invokeLLM({
  model,
  maxTokens: 4096,
  messages: [
    {
      role: "system",
      content: "You are a strict visual continuity auditor. Inspect only what is visible and do not invent unreadable tiny text. Return JSON only.",
    },
    {
      role: "user",
      content: [
        { type: "text", text: `${prompt}\n\nTASK: Read the attached Master Map plus the injected relationship ledger. Be concise: hierarchy maximum 7 items, districts maximum 7 short labels, recognizedCharacters maximum 10 short names, inferredLockRules maximum 5 short rules, relationships must list the four canonical links exactly as known from the injection, uncertainty maximum 3 short notes. Report the world identifier, visible city/district logic, QR registry visibility, continuity rules, and family relationships. Do not transcribe tiny unreadable text.` },
        { type: "image_url", image_url: { url: `data:image/png;base64,${imageBytes.toString("base64")}`, detail: "high" } },
      ],
    },
  ],
  response_format: {
    type: "json_schema",
    json_schema: {
      name: "arch001_master_map_audit",
      strict: true,
      schema: {
        type: "object",
        properties: {
          worldIdentifier: { type: "string" },
          hierarchy: { type: "array", items: { type: "string" } },
          districts: { type: "array", items: { type: "string" } },
          recognizedCharacters: { type: "array", items: { type: "string" } },
          qrRegistryVisible: { type: "boolean" },
          inferredLockRules: { type: "array", items: { type: "string" } },
          relationships: { type: "array", items: { type: "string" } },
          uncertainty: { type: "array", items: { type: "string" } },
        },
        required: ["worldIdentifier", "hierarchy", "districts", "recognizedCharacters", "qrRegistryVisible", "inferredLockRules", "relationships", "uncertainty"],
        additionalProperties: false,
      },
    },
  },
});

const content = response.choices?.[0]?.message?.content;
if (typeof content !== "string" || !content.trim()) {
  throw new Error("Vision audit returned an empty response.");
}
const audit = JSON.parse(content);
if (!String(audit.worldIdentifier).startsWith("ARCH-001") || audit.qrRegistryVisible !== true || audit.recognizedCharacters.length < 6 || audit.relationships.length < 4) {
  throw new Error(`Vision audit did not recover the required master-map signals: ${content}`);
}
console.log(JSON.stringify(audit, null, 2));
