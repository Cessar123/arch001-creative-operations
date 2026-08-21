export type ArchTeamRole = {
  id: "origin-director" | "human-reviewer" | "production-translator" | "continuity-guard";
  member: string;
  title: string;
  responsibility: string;
  boundary: string;
};

export const ARCH001_TEAM_LAYER_SIGNATURE = "ARCH-001 TEAM LAYER";

export const archTeamRoles: ArchTeamRole[] = [
  {
    id: "origin-director",
    member: "إسلام",
    title: "صاحب الأصل والقرار الإبداعي",
    responsibility: "يحدد اتجاه الحلقة، الكاست، والغرض النهائي قبل الاعتماد.",
    boundary: "قرار الاتجاه لا يغيّر DNA LOCK أو السجل وحده؛ أي تعديل قفل يمر ببطاقة مرجع مستقلة.",
  },
  {
    id: "human-reviewer",
    member: "مصطفى",
    title: "مراجع الروح البشرية والكوميديا",
    responsibility: "يضيف رد الفعل الواقعي، النبرة، والإفيه الذي يجعل المشهد صادقًا.",
    boundary: "يقدّم ملاحظة أو اقتراحًا ولا يعيد تسمية العائلات أو اختراع ملامح مقفلة.",
  },
  {
    id: "production-translator",
    member: "KA LOLITA / Manus",
    title: "مترجم الإنتاج",
    responsibility: "يحوّل القرار والملاحظة إلى EP-MATRIX أو ST-CAST-3D أو PROMO-5 قابل للتنفيذ.",
    boundary: "لا يعتمد قانونًا جديدًا أو يعلن قفلًا بصريًا من غير مرجع ARCH-001.",
  },
  {
    id: "continuity-guard",
    member: "DNA LOCK",
    title: "حارس المرجع الواحد",
    responsibility: "يفحص الكاست، الحي، العمر، الوجه، الزي، والعائلة قبل إخراج أي مشهد.",
    boundary: "يقفل الطلب عند وجود تضارب ويطلب تأكيدًا بدلًا من اختراع حل.",
  },
];

export const ARCH001_TEAM_COMMAND = `[${ARCH001_TEAM_LAYER_SIGNATURE}]
إسلام — اتجاه الحلقة/القرار: 
مصطفى — الملاحظة الإنسانية أو الكوميدية: 
Manus — حوّل المدخلات إلى: EP-MATRIX أو ST-CAST-3D
الكاست والموقع: 
قواعد القفل الواجب احترامها: DNA LOCK + السجل الرسمي
المخرج المطلوب: بطاقة قابلة للتنفيذ فقط.`;
