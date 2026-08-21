export type ArchCharacterStatus = "LOCKED" | "READY" | "PENDING";

export type ArchCharacter = {
  id: string;
  name: string;
  role: string;
  family: string;
  residence: string;
  work: string;
  district: string;
  status: ArchCharacterStatus;
  visualLock: string;
};

export function getArchRegistryPayload(character: ArchCharacter) {
  const query = new URLSearchParams({
    family: character.family,
    home: character.residence,
    work: character.work,
    district: character.district,
    status: character.status,
  });
  return `arch001://registry/${character.id}?${query.toString()}`;
}

export const ARCH001_SIGNATURE = "[3/6/9/5/7 | 1/1]";
export const ARCH001_MASTER_MAP_URL = "/manus-storage/arch001-master-map_3d7347f6.png";

export const archDistricts = [
  { id: "D01", name: "Founder Control", label: "جناح المؤسس والتحكم", icon: "◇" },
  { id: "D02", name: "Family Quarter", label: "حي العائلة", icon: "⌂" },
  { id: "D03", name: "Media Hub", label: "الإعلام والبث", icon: "≋" },
  { id: "D04", name: "Learning Heritage", label: "التعليم والتراث", icon: "▤" },
  { id: "D05", name: "Culture Arts", label: "الثقافة والفنون", icon: "✧" },
  { id: "D06", name: "Cyber Gaming", label: "العمليات والألعاب", icon: "◉" },
  { id: "D07", name: "Style Community", label: "الأناقة والمجتمع", icon: "♛" },
] as const;

export const archCharacters: ArchCharacter[] = [
  { id: "MASTER-001", name: "إسلام سليم", role: "المؤسس والمخرج الإبداعي", family: "FAM-FOUNDER-001", residence: "شقة إسلام", work: "استديو التحكم", district: "D01", status: "LOCKED", visualLock: "شعر كيرلي أسود، عينان بنيتان، جاكيت داكن بحواف ذهبية" },
  { id: "CITIZEN-002", name: "سوزان", role: "أمينة السرد والذاكرة", family: "FAM-COMMUNITY-002", residence: "لوفت الذاكرة", work: "مكتب السرد والإعلام", district: "D03", status: "LOCKED", visualLock: "شعر فاتح مموج، حضور إعلامي دافئ" },
  { id: "SHEMENDI-FAMILY-003", name: "شمندي", role: "مرساة العائلة", family: "FAM-SHEMENDI-003", residence: "شقة عائلة شمندي", work: "دعم العائلة والمجتمع", district: "D02", status: "LOCKED", visualLock: "قبعة سوداء، لحية مرتبة، قميص أبيض" },
  { id: "MASTER-KOY", name: "جوري", role: "أميرة البهجة", family: "FAM-SHEMENDI-003", residence: "شقة عائلة شمندي", work: "عقدة البهجة واللعب", district: "D02", status: "LOCKED", visualLock: "طفلة بشعر بني وفستان مرح، نسب طفولي ثابت" },
  { id: "EID-THE-IMPS-004", name: "عيد", role: "عفريت المدينة", family: "FAM-IMPS-004", residence: "منزل العفاريت", work: "عقدة اللعب والمقالب", district: "D02", status: "LOCKED", visualLock: "هودي أزرق ومارون، شعر جانبي، طاقة مقالب بريئة" },
  { id: "OUDI-IMPS-005", name: "عودي", role: "أخ عيد المستقل", family: "FAM-IMPS-004", residence: "منزل العفاريت", work: "عقدة الاكتشاف", district: "D02", status: "READY", visualLock: "شعر أسود كيرلي، قميص رمادي وأسود" },
  { id: "ENGY-MEDIA-FAMILY-007", name: "إنجي سليم", role: "إعلامية ومرساة عائلة", family: "FAM-SELIM-007", residence: "شقة عائلة سليم", work: "استديو الإعلام العائلي", district: "D03", status: "LOCKED", visualLock: "حجاب منقوش وحضور ودود" },
  { id: "MALEK-CHILD-P001", name: "مالك", role: "طفل فضولي ومشاكس", family: "FAM-SELIM-007", residence: "شقة عائلة سليم", work: "عقدة التعلم واللعب", district: "D02", status: "LOCKED", visualLock: "ابتسامة كبيرة وطاقة وثابة" },
  { id: "TITO-5", name: "تيتو", role: "طفل صغير فضولي", family: "FAM-SELIM-007", residence: "شقة عائلة سليم", work: "عقدة التعلم واللعب", district: "D02", status: "LOCKED", visualLock: "جاكيت جينز وقميص مخطط" },
  { id: "YOUSEF-CHILD-P001", name: "يوسف", role: "طفل ذكي رياضي", family: "FAM-YOUSEF-001", residence: "منزل يوسف", work: "المدرسة والرياضة", district: "D04", status: "LOCKED", visualLock: "نظارة وقميص أسود بلمسة ذهبية" },
  { id: "MOHAMED-SHEHATA-FAMILY-010", name: "محمد شحاتة", role: "الأب الجدلي الكوميدي", family: "FAM-SHEHATA-010", residence: "منزل عائلة شحاتة", work: "ركن الجدل والكوميديا", district: "D07", status: "READY", visualLock: "شعر قصير وجاكيت أحمر في مرجع الذاكرة" },
  { id: "MAKKA-SHEHATA-FAMILY-010-A", name: "مكّة محمد شحاتة", role: "الأخت الذكية المشاغبة", family: "FAM-SHEHATA-010", residence: "منزل عائلة شحاتة", work: "المدرسة والعقدة الذكية", district: "D02", status: "READY", visualLock: "ذيل حصان وكنزة خمرية بقلوب" },
  { id: "OSAMA-SHEHATA-FAMILY-010-B", name: "أسامة محمد شحاتة", role: "الأخ الطيب كثير النسيان", family: "FAM-SHEHATA-010", residence: "منزل عائلة شحاتة", work: "المدرسة والاكتشاف", district: "D02", status: "READY", visualLock: "شعر كيرلي وقميص أسود مخطط" },
  { id: "LOUMA-FAMILY-009", name: "لوما الشرصي", role: "ركيزة الكرامة والمجتمع", family: "FAM-LOUMA-009", residence: "منزل عائلة لوما", work: "مجلس الكرامة", district: "D07", status: "LOCKED", visualLock: "بدلة كحلية وربطة عنق خمرية وابتسامة وقورة" },
  { id: "ZAZA-FAMILY-009-A", name: "ظاظا", role: "مواطن عائلي مستقل", family: "FAM-LOUMA-009", residence: "منزل عائلة لوما", work: "التعلم والعائلة", district: "D02", status: "READY", visualLock: "طفل بشعر قصير مموج وزي داكن" },
  { id: "HISTORY-TEACHER-P001", name: "الأستاذ بوشكا", role: "مدرس التاريخ الكوميدي", family: "FAM-BOUCHKA-001", residence: "سكن المعلم", work: "مدرسة التاريخ", district: "D04", status: "LOCKED", visualLock: "طربوش أحمر وابتسامة واسعة" },
  { id: "LEADERSHIP-MASTER-REF", name: "د. قطب قطب", role: "خبير القيادة الاستراتيجية", family: "FAM-QUTB-001", residence: "سكن القيادة", work: "مجلس القيادة", district: "D04", status: "LOCKED", visualLock: "بدلة رسمية ورأس أصلع وحضور هادئ" },
  { id: "CULTURE-007", name: "مريم", role: "مفتاح الثقافة والفنون", family: "FAM-CULTURE-007", residence: "لوفت ساحة الثقافة", work: "أرشيف الثقافة والفنون", district: "D05", status: "LOCKED", visualLock: "ضفيرتان بنفسجيتان ونظارة وردية" },
  { id: "GAMING-COMMAND-9002C", name: "مصطفى محمد ممدوح", role: "لاعب محترف واستراتيجي", family: "FAM-GAMING-001", residence: "كبسولة قيادة الألعاب", work: "عمليات السيبرانيات والألعاب", district: "D06", status: "LOCKED", visualLock: "زي تكتيكي داكن بإضاءة سماوية" },
  { id: "GHOST-MEDIA-005", name: "مصطفى خميس — جوست", role: "إعلامي رصين", family: "FAM-GHOST-005", residence: "لوفت الإعلام", work: "غرفة تحكم البث", district: "D03", status: "LOCKED", visualLock: "جاكيت جلدي أسود ولحية مرتبة" },
  { id: "KAMMOUNA-STYLE-008", name: "سليم رفعت — كمونة", role: "وزير الأناقة والابتسامة", family: "FAM-STYLE-008", residence: "سكن الأناقة", work: "وزارة الأناقة والابتسامة", district: "D07", status: "LOCKED", visualLock: "نظارة شمسية وبدلة كحلية" },
  { id: "JOJO-PENDING", name: "جوجو", role: "مواطنة مرتبطة بعقدة شمندي", family: "FAM-SHEMENDI-003", residence: "شقة عائلة شمندي", work: "البورصة — بطاقة مطلوبة", district: "D07", status: "PENDING", visualLock: "لا يُقفل بصريًا قبل بطاقة مستقلة" },
];

export const archSkills = [
  { id: "scene", name: "مخرج المشهد", code: "[001-DIR] ST-CAST-3D", description: "كاست + موقع + فعل مرئي + كاميرا" },
  { id: "episode", name: "بطاقة الحلقة", code: "EP-MATRIX", description: "صراع، مشاهد، حوار، وهوك نهائي" },
  { id: "character", name: "قفل DNA", code: "DNA-LOCK", description: "هوية، عمر، ملامح، زي، دور، عائلة" },
  { id: "location", name: "سكن وعمل", code: "QR-REGISTRY", description: "حي، بيت، وظيفة، عائلة، QR" },
  { id: "promo", name: "برومو سينمائي", code: "PROMO-5", description: "هوك وبرومبت فيديو مختصر" },
] as const;
