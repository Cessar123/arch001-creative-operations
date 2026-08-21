import { AIChatBox, type Message } from "@/components/AIChatBox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { archCharacters, archDistricts, archSkills, ARCH001_MASTER_MAP_URL, ARCH001_SIGNATURE, getArchRegistryPayload } from "../../../shared/arch001";
import {
  Aperture,
  Bot,
  Building2,
  Clapperboard,
  Compass,
  Cpu,
  LockKeyhole,
  MapPinned,
  MessageCircleMore,
  QrCode,
  ShieldCheck,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const prompts = [
  "[001-DIR] ST-CAST-3D — CAST: إسلام، شمندي، جوري — LOCATION: D02 — FUNCTION: مشكلة صباحية كوميدية في بوابة العائلة.",
  "اعمل بطاقة حلقة من 4 مشاهد عن عيد وعودي في حي العائلة، مع الحفاظ على اختلافهم البصري.",
  "اعمل شيت Intake لظاظا: ما الذي يحتاجه قبل أن يصبح LOCKED بصريًا؟",
  "اكتب برومبت فيديو من خمس سطور لبرومو مدينة بشوشا، يشمل سوزان وجوست ومريم.",
];

function statusClass(status: string) {
  if (status === "LOCKED") return "border-cyan-300/30 bg-cyan-300/10 text-cyan-100";
  if (status === "READY") return "border-[#e4bd59]/40 bg-[#e4bd59]/10 text-[#f4d889]";
  return "border-orange-300/30 bg-orange-300/10 text-orange-100";
}

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedSkill, setSelectedSkill] = useState("scene");
  const chat = trpc.arch001.chat.useMutation({
    onSuccess: ({ content }) => setMessages((current) => [...current, { role: "assistant", content }]),
    onError: (error) => toast.error(error.message || "تعذر تشغيل غرفة العمليات الآن."),
  });

  const stats = useMemo(() => ({
    locked: archCharacters.filter((character) => character.status === "LOCKED").length,
    ready: archCharacters.filter((character) => character.status === "READY").length,
    pending: archCharacters.filter((character) => character.status === "PENDING").length,
  }), []);

  function send(content: string) {
    if (!isAuthenticated) {
      toast.message("سجّل الدخول لتشغيل محرك الإنتاج الذكي.");
      return;
    }
    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    chat.mutate({
      messages: next.filter(
        (message): message is { role: "user" | "assistant"; content: string } =>
          message.role === "user" || message.role === "assistant",
      ),
    });
  }

  return (
    <main dir="rtl" className="min-h-screen overflow-x-hidden bg-[#050b11] text-[#f5edce] selection:bg-cyan-300/30">
      <div className="pointer-events-none fixed inset-0 opacity-40 [background-image:linear-gradient(rgba(93,232,255,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(93,232,255,.045)_1px,transparent_1px)] [background-size:54px_54px]" />
      <header className="sticky top-0 z-30 border-b border-[#e4bd59]/25 bg-[#061019]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-[1700px] items-center justify-between gap-4 px-4 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-xl border border-[#e4bd59]/70 bg-[#e4bd59]/10 text-[#e4bd59] shadow-[0_0_28px_rgba(228,189,89,.17)]"><Aperture className="size-5" /></div>
            <div><p className="font-display text-lg font-bold tracking-wide">ARCH-001</p><p className="text-[10px] tracking-[.24em] text-cyan-200/70">BASHOSHA CITY // OPERATIONS</p></div>
          </div>
          <div className="hidden items-center gap-3 md:flex"><Badge className="border-cyan-300/35 bg-cyan-300/10 text-cyan-100">DNA LOCK ACTIVE</Badge><Badge className="border-[#e4bd59]/35 bg-[#e4bd59]/10 text-[#e9cd7a]">{ARCH001_SIGNATURE}</Badge></div>
          {isAuthenticated ? <div className="flex items-center gap-2"><span className="hidden text-sm text-[#e7ddb9] sm:block">{user?.name ?? "قائد المدينة"}</span><Button variant="outline" size="sm" onClick={logout} className="border-white/15 bg-transparent text-[#f5edce] hover:bg-white/10">خروج</Button></div> : <Button onClick={() => startLogin()} className="bg-[#e4bd59] text-[#10202a] hover:bg-[#f4d889]">شغّل غرفة العمليات</Button>}
        </div>
      </header>

      <section className="relative mx-auto max-w-[1700px] px-4 pb-8 pt-8 sm:px-7 lg:pt-11">
        <div className="grid gap-7 xl:grid-cols-[1.18fr_.82fr] xl:items-center">
          <div className="relative overflow-hidden rounded-[30px] border border-cyan-300/35 bg-[#091822] p-2 shadow-[0_30px_80px_rgba(0,0,0,.45)]">
            <img src={ARCH001_MASTER_MAP_URL} alt="ARCH-001 Master Map" className="aspect-video w-full rounded-[24px] object-cover opacity-95" />
            <div className="absolute inset-x-7 bottom-7 flex flex-wrap items-end justify-between gap-3 rounded-2xl border border-cyan-300/25 bg-[#041018]/85 p-4 backdrop-blur-md">
              <div><p className="text-[10px] tracking-[.25em] text-cyan-200">MASTER MAP INJECTION</p><p className="mt-1 font-display text-lg font-bold">مدينة + كاست + QR + جوهرة النظام</p></div>
              <div className="flex gap-2"><Badge className="border-[#e4bd59]/35 bg-[#e4bd59]/10 text-[#e9cd7a]"><QrCode className="ml-1 size-3" /> 22 QR</Badge><Badge className="border-cyan-300/35 bg-cyan-300/10 text-cyan-100"><MapPinned className="ml-1 size-3" /> 7 أحياء</Badge></div>
            </div>
          </div>
          <div className="space-y-5">
            <Badge className="border-[#e4bd59]/40 bg-[#e4bd59]/10 px-3 py-1 text-[#e9cd7a]">ORIGINAL JEWEL &gt; SYSTEM JEWEL &gt; CITY &gt; EPISODES</Badge>
            <h1 className="font-display text-4xl font-bold leading-[1.16] sm:text-5xl">غرفة عمليات <span className="text-cyan-200">الإنتاج الإبداعي</span> لعالم بشوشا</h1>
            <p className="max-w-xl text-base leading-8 text-[#c5d6dc]">خريطة واحدة تحرس استمرارية الشخصيات، وشات ذكي يبني المشاهد والحلقات والبرومو من داخل ARCH-001 من غير ما يعيد اختراع أي وجه أو عيلة.</p>
            <div className="grid grid-cols-3 gap-3"><Metric value={stats.locked} label="LOCKED" color="cyan" /><Metric value={stats.ready} label="READY" color="gold" /><Metric value={stats.pending} label="PENDING" color="orange" /></div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1700px] gap-5 px-4 pb-12 sm:px-7 xl:grid-cols-[240px_minmax(0,1fr)_310px]">
        <aside className="space-y-3 xl:sticky xl:top-25 xl:self-start">
          <div className="mb-4 flex items-center gap-2 text-xs tracking-[.2em] text-[#e9cd7a]"><Cpu className="size-4" /> مهارات الإنتاج</div>
          {archSkills.map((skill) => { const active = selectedSkill === skill.id; return <button key={skill.id} onClick={() => { setSelectedSkill(skill.id); send(`فعّل مهارة ${skill.name} (${skill.code}) واعرض لي أقصر خطوة إنتاجية تالية.`); }} className={`w-full rounded-2xl border p-3 text-right transition ${active ? "border-cyan-300/50 bg-cyan-300/10 shadow-[0_0_20px_rgba(93,232,255,.08)]" : "border-white/10 bg-white/[.025] hover:border-[#e4bd59]/35 hover:bg-[#e4bd59]/5"}`}><p className="text-sm font-bold text-[#f5edce]">{skill.name}</p><p className="mt-1 text-[11px] text-cyan-200/80">{skill.code}</p><p className="mt-2 text-xs leading-5 text-[#9db4bd]">{skill.description}</p></button> })}
          <Card className="border-[#e4bd59]/25 bg-[#e4bd59]/[.06] p-4"><div className="flex items-center gap-2 text-[#e9cd7a]"><ShieldCheck className="size-4" /><span className="text-sm font-bold">حارس الاستمرارية</span></div><p className="mt-2 text-xs leading-6 text-[#c8d5d7]">الشات يوقف انجراف الوجه أو العمر أو الزي أو الدور قبل إخراج المشهد.</p></Card>
        </aside>

        <section className="min-w-0">
          <Card className="overflow-hidden border border-cyan-300/25 bg-[#07131c]/95 p-0 shadow-[0_25px_80px_rgba(0,0,0,.28)]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-gradient-to-l from-[#0a2834] to-[#07131c] p-5">
              <div className="flex items-center gap-3"><div className="grid size-10 place-items-center rounded-xl bg-cyan-300/10 text-cyan-200"><Bot className="size-5" /></div><div><p className="font-display text-lg font-bold">KA LOLITA // Creative Operations</p><p className="text-xs text-[#9db4bd]">ARCH-001 context loaded · DNA LOCK monitoring</p></div></div>
              <Badge className="border-cyan-300/30 bg-cyan-300/10 text-cyan-100">LIVE PRODUCTION CHAT</Badge>
            </div>
            {isAuthenticated ? <AIChatBox messages={messages} onSendMessage={send} isLoading={chat.isPending} height="680px" className="rounded-none border-0 bg-[#07131c] shadow-none" placeholder="اطلب مشهد أو حلقة أو برومو أو قفل شخصية داخل ARCH-001..." emptyStateMessage="الشبكة محمّلة: اختر بروتوكول إنتاج أو اكتب أمرك الأول." suggestedPrompts={prompts} /> : <div className="grid min-h-[520px] place-items-center p-8 text-center"><div className="max-w-md"><div className="mx-auto grid size-16 place-items-center rounded-2xl border border-[#e4bd59]/40 bg-[#e4bd59]/10 text-[#e9cd7a]"><MessageCircleMore className="size-8" /></div><h2 className="mt-5 font-display text-2xl font-bold">الشات محمل بذاكرة المدينة</h2><p className="mt-3 text-sm leading-7 text-[#adc0c6]">سجّل الدخول لتبدأ جلسة إنتاج محفوظة ويقدر المحرك ينفذ أوامر الحلقة والمشهد والسكن والعمل.</p><Button onClick={() => startLogin()} className="mt-6 bg-[#e4bd59] text-[#10202a] hover:bg-[#f4d889]">ابدأ الشات الذكي <WandSparkles className="mr-2 size-4" /></Button></div></div>}
          </Card>
        </section>

        <aside className="space-y-4 xl:sticky xl:top-25 xl:self-start">
          <Card className="border-white/10 bg-[#07131c] p-4"><div className="flex items-center justify-between"><div><p className="text-xs tracking-[.2em] text-[#e9cd7a]">CAST REGISTRY</p><p className="mt-1 font-display text-lg font-bold">الشخصيات الحالية</p></div><Building2 className="size-5 text-cyan-200" /></div><div className="mt-4 max-h-[390px] space-y-2 overflow-y-auto pr-1">{archCharacters.map((character) => { const qrPayload = getArchRegistryPayload(character); return <div key={character.id} className="rounded-xl border border-white/[.07] bg-white/[.025] p-3"><div className="flex items-start justify-between gap-2"><div><p className="text-sm font-bold text-[#f5edce]">{character.name}</p><p className="mt-1 text-[11px] text-cyan-200/75">{character.id}</p></div><Badge className={`border text-[9px] ${statusClass(character.status)}`}>{character.status}</Badge></div><p className="mt-2 text-xs text-[#bdced3]">{character.role} · {character.district}</p><p className="mt-1 text-[10px] text-[#8fa7b0]">⌂ {character.residence} · ▣ {character.work}</p><div title={qrPayload} className="mt-2 flex items-center gap-1.5 rounded-md border border-cyan-300/15 bg-cyan-300/[.045] px-2 py-1 text-[9px] text-cyan-100/80"><QrCode className="size-3 shrink-0" /><span className="truncate" dir="ltr">QR:// {character.id}</span></div></div> })}</div></Card>
          <Card className="border-white/10 bg-[#07131c] p-4"><div className="flex items-center gap-2 text-[#e9cd7a]"><Compass className="size-4" /><span className="text-sm font-bold">أحياء المدينة</span></div><div className="mt-3 grid gap-2">{archDistricts.map((district) => <div key={district.id} className="flex items-center gap-3 rounded-lg bg-white/[.025] px-3 py-2"><span className="grid size-7 place-items-center rounded-md bg-cyan-300/10 text-cyan-200">{district.icon}</span><div className="min-w-0"><p className="text-xs font-bold">{district.id} · {district.label}</p><p className="truncate text-[10px] text-[#8fa7b0]">{district.name}</p></div></div>)}</div></Card>
          <Card className="border-[#e4bd59]/25 bg-[#e4bd59]/[.06] p-4"><div className="flex items-center gap-2 text-[#e9cd7a]"><Clapperboard className="size-4" /><span className="text-sm font-bold">أمر سريع</span></div><p className="mt-2 text-xs leading-6 text-[#c8d5d7]">اكتب: <span className="text-cyan-200">[001-DIR] ST-CAST-3D</span> ثم الشخصيات والموقع ووظيفة المشهد.</p></Card>
        </aside>
      </section>
    </main>
  );
}

function Metric({ value, label, color }: { value: number; label: string; color: "cyan" | "gold" | "orange" }) {
  const palette = { cyan: "border-cyan-300/25 bg-cyan-300/10 text-cyan-100", gold: "border-[#e4bd59]/25 bg-[#e4bd59]/10 text-[#f4d889]", orange: "border-orange-300/25 bg-orange-300/10 text-orange-100" }[color];
  return <div className={`rounded-2xl border p-3 ${palette}`}><p className="font-display text-2xl font-bold">{value}</p><p className="mt-1 text-[10px] tracking-[.18em] opacity-80">{label}</p></div>;
}
