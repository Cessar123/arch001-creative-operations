import { invokeLLM } from "./_core/llm";

export type CreativeOutput = {
  projectTitle: string;
  logline: string;
  concept: string;
  stages: {
    characters: {
      summary: string;
      characters: Array<{
        name: string;
        role: string;
        visualIdentity: string;
        personality: string;
        voiceSignature: string;
        expressions: string[];
      }>;
    };
    vehicles: {
      summary: string;
      vehicles: Array<{
        name: string;
        owner: string;
        type: string;
        visualIdentity: string;
        hornSound: string;
        catchphrase: string;
      }>;
    };
    locations: {
      summary: string;
      locations: Array<{
        name: string;
        purpose: string;
        visualDetails: string;
      }>;
    };
    episode: {
      title: string;
      logline: string;
      scenes: Array<{
        heading: string;
        action: string;
        dialogue: string;
      }>;
      endingHook: string;
    };
  };
  promo: {
    videoPrompt: string;
    hook: string;
  };
  assetPrompts: {
    characters: string;
    locations: string;
  };
};

const creativeSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    projectTitle: { type: "string" },
    logline: { type: "string" },
    concept: { type: "string" },
    stages: {
      type: "object",
      additionalProperties: false,
      properties: {
        characters: {
          type: "object",
          additionalProperties: false,
          properties: {
            summary: { type: "string" },
            characters: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: false,
                properties: {
                  name: { type: "string" },
                  role: { type: "string" },
                  visualIdentity: { type: "string" },
                  personality: { type: "string" },
                  voiceSignature: { type: "string" },
                  expressions: { type: "array", items: { type: "string" } },
                },
                required: ["name", "role", "visualIdentity", "personality", "voiceSignature", "expressions"],
              },
            },
          },
          required: ["summary", "characters"],
        },
        vehicles: {
          type: "object",
          additionalProperties: false,
          properties: {
            summary: { type: "string" },
            vehicles: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: false,
                properties: {
                  name: { type: "string" },
                  owner: { type: "string" },
                  type: { type: "string" },
                  visualIdentity: { type: "string" },
                  hornSound: { type: "string" },
                  catchphrase: { type: "string" },
                },
                required: ["name", "owner", "type", "visualIdentity", "hornSound", "catchphrase"],
              },
            },
          },
          required: ["summary", "vehicles"],
        },
        locations: {
          type: "object",
          additionalProperties: false,
          properties: {
            summary: { type: "string" },
            locations: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: false,
                properties: {
                  name: { type: "string" },
                  purpose: { type: "string" },
                  visualDetails: { type: "string" },
                },
                required: ["name", "purpose", "visualDetails"],
              },
            },
          },
          required: ["summary", "locations"],
        },
        episode: {
          type: "object",
          additionalProperties: false,
          properties: {
            title: { type: "string" },
            logline: { type: "string" },
            scenes: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: false,
                properties: {
                  heading: { type: "string" },
                  action: { type: "string" },
                  dialogue: { type: "string" },
                },
                required: ["heading", "action", "dialogue"],
              },
            },
            endingHook: { type: "string" },
          },
          required: ["title", "logline", "scenes", "endingHook"],
        },
      },
      required: ["characters", "vehicles", "locations", "episode"],
    },
    promo: {
      type: "object",
      additionalProperties: false,
      properties: {
        videoPrompt: { type: "string" },
        hook: { type: "string" },
      },
      required: ["videoPrompt", "hook"],
    },
    assetPrompts: {
      type: "object",
      additionalProperties: false,
      properties: {
        characters: { type: "string" },
        locations: { type: "string" },
      },
      required: ["characters", "locations"],
    },
  },
  required: ["projectTitle", "logline", "concept", "stages", "promo", "assetPrompts"],
} as const;

export function buildCreativePrompt(idea: string, previousContext: string[] = [], currentStage = 1) {
  const context = previousContext.length > 0 ? `\nPrevious conversation context:\n${previousContext.join("\n")}` : "";
  const stageNames = ["characters", "vehicles/assets", "locations", "episode and promo"];
  const activeStage = stageNames[Math.max(0, Math.min(currentStage - 1, stageNames.length - 1))];

  return `You are Universal-Creative-Architect-Pro, a senior creative director and narrative systems architect.
Use the initialization sequence [3/6/9/5/7 | 1/1] as a quality framework, not as a claim of hidden capabilities.
Turn the user's idea into a cohesive cartoon or animated film project.

STRICT PIPELINE — execute in this exact order and make every stage depend on the one before it:
CURRENT STAGE GATE: The session is currently at stage ${currentStage} (${activeStage}). Treat stages before this gate as established context, focus your creative detail on this gate, and do not claim that a later stage is finalized until the user advances through it. Still return every schema field: future-stage fields may be concise planning placeholders, while the active stage must be production-ready.
1. Characters: create a coherent cast with visual identity, psychology, voice signature, and five expressions.
2. Vehicles/assets: design companion vehicles or objects that reflect the characters; include names, owners, horn/sound identity, and catchphrases.
3. Locations: create a connected location system with homes, workspaces, public spaces, and story landmarks. Include an empty-map-friendly description.
4. Episode one: write a compact but detailed first episode with scene headings, action, dialogue, and a strong ending hook.
5. Promo layer: produce one concise English video prompt of no more than five lines and one Arabic teaser hook.

OUTPUT CONTRACT:
- Return only valid JSON matching the supplied schema.
- Write all narrative fields in clear Egyptian Arabic unless a proper name is better in English.
- Write assetPrompts.characters, assetPrompts.locations, and promo.videoPrompt in precise English for image/video models.
- Avoid copyrighted character names, direct franchise imitation, fabricated testimonials, or claims that assets have already been generated.
- Make every character, vehicle, and location serve the same narrative DNA.\n\nUSER IDEA:\n${idea}${context}`;
}

export function normalizeCreativeOutput(content: unknown): CreativeOutput {
  if (typeof content !== "string") {
    throw new Error("The creative model returned an empty response.");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    const fenced = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)?.[1];
    if (!fenced) throw new Error("The creative model returned invalid JSON.");
    parsed = JSON.parse(fenced);
  }

  if (!parsed || typeof parsed !== "object") {
    throw new Error("The creative model returned an invalid project payload.");
  }
  return parsed as CreativeOutput;
}

export async function runCreativeArchitecture(idea: string, previousContext: string[] = [], currentStage = 1) {
  const response = await invokeLLM({
    messages: [
      { role: "system", content: "Return a complete structured creative project in JSON only." },
      { role: "user", content: buildCreativePrompt(idea, previousContext, currentStage) },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "creative_architect_project",
        strict: true,
        schema: creativeSchema,
      },
    },
  });

  return normalizeCreativeOutput(response.choices?.[0]?.message?.content);
}
