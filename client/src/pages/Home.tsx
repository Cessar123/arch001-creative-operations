import { AIChatBox, type Message } from "@/components/AIChatBox";
import { useAuth } from "@/_core/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { startLogin } from "@/const";
import {
  ArrowUpLeft,
  Bot,
  Boxes,
  ChevronLeft,
  Clapperboard,
  Clock3,
  Compass,
  Image as ImageIcon,
  Layers3,
  LogOut,
  Map,
  MessageCircle,
  Plus,
  Sparkles,
  WandSparkles,
  Workflow,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const stages = [
  { id: 1, label: "الشخصيات", icon: Sparkles },
  { id: 2, label: "المركبات", icon: Boxes },
  { id: 3, label: "المواقع", icon: Map },
  { id: 4, label: "الحلقة والبرومو", icon: Clapperboard },
];

function parseJson(value: string | null | undefined) {
  if (!value) return null;
  try {
    return JSON.parse(value) as Record<string, any>;
  } catch {
    return null;
  }
}

function messageText(content: string) {
  const parsed = parseJson(content);
  if (!parsed?.stages) return content;
  const characters = parsed.stages.characters?.characters?.slice(0, 3).map((item: any) => `- ${item.name}: ${item.role}`).join("\\n") ?? "- لم تُحدد بعد";
  const vehicles = parsed.stages.vehicles?.vehicles?.slice(0, 2).map((item: any) => `- ${item.name}: ${item.catchphrase}`).join("\\n") ?? "- لم تُحدد بعد";
  return `**${parsed.projectTitle}**\\n\\n${parsed.logline}\\n\\n### الشخصيات\\n${characters}\\n\\n### المركبات\\n${vehicles}\\n\\n### الهوك\\n${parsed.promo?.hook ?? "سيظهر بعد اكتمال المرحلة الرابعة."}\\n\\n_التفاصيل الكاملة محفوظة في لوحات المخرجات الجانبية._`;
}

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [activePanel, setActivePanel] = useState("overview");
  const [newTitle, setNewTitle] = useState("");
  const [newPremise, setNewPremise] = useState("");
  const utils = trpc.useUtils();

  const projectsQuery = trpc.projects.list.useQuery(undefined, { enabled: isAuthenticated });
  const projectInput = useMemo(() => ({ projectId: selectedProjectId ?? 0 }), [selectedProjectId]);
  const projectQuery = trpc.projects.get.useQuery(projectInput, { enabled: Boolean(selectedProjectId) && isAuthenticated });

  const createProject = trpc.projects.create.useMutation({
    onError: error => toast.error(error.message || "تعذر إنشاء المشروع، حاول مرة أخرى."),
    onSuccess: async ({ projectId }) => {
      setSelectedProjectId(projectId);
      setNewTitle("");
      setNewPremise("");
      await utils.projects.list.invalidate();
    },
  });

  const sendMessage = trpc.chat.send.useMutation({
    onError: error => toast.error(error.message || "تعذر تشغيل المحرك الإبداعي، حاول مرة أخرى."),
    onSuccess: async () => {
      await utils.projects.get.invalidate(projectInput);
      await utils.projects.list.invalidate();
    },
  });

  const generateAsset = trpc.assets.generateImage.useMutation({
    onError: error => toast.error(error.message || "تعذر توليد الصورة، تحقق من الوصف وحاول مرة أخرى."),
    onSuccess: async () => {
      await utils.projects.get.invalidate(projectInput);
    },
  });

  const selectedProject = projectQuery.data?.project;
  const dbMessages = projectQuery.data?.messages ?? [];
  const chatMessages: Message[] = dbMessages.map(message => ({
    role: message.role === "system" ? "system" : message.role,
    content: messageText(message.content),
  }));
  const latestOutput = useMemo(() => {
    const latest = [...dbMessages].reverse().find(message => message.role === "assistant");
    return latest ? parseJson(latest.content) : null;
  }, [dbMessages]);

  const hasProjects = (projectsQuery.data?.length ?? 0) > 0;
  const isBusy = createProject.isPending || sendMessage.isPending || generateAsset.isPending;

  function createNewProject(event: React.FormEvent) {
    event.preventDefault();
    if (!newTitle.trim() || newPremise.trim().length < 10) return;
    createProject.mutate({ title: newTitle.trim(), premise: newPremise.trim() });
  }

  function handleSend(content: string) {
    if (!selectedProjectId) return;
    sendMessage.mutate({ projectId: selectedProjectId, content });
  }

  function generateCharacters() {
    if (!selectedProjectId || !latestOutput?.assetPrompts?.characters) return;
    generateAsset.mutate({ projectId: selectedProjectId, kind: "characters", prompt: latestOutput.assetPrompts.characters });
  }

  function generateLocations() {
    if (!selectedProjectId || !latestOutput?.assetPrompts?.locations) return;
    generateAsset.mutate({ projectId: selectedProjectId, kind: "locations", prompt: latestOutput.assetPrompts.locations });
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#10100f] text-white px-6 py-10 grid place-items-center">
        <Card className="max-w-xl border-white/10 bg-[#191917] p-10 text-center shadow-2xl">
          <div className="mx-auto mb-6 grid size-16 place-items-center rounded-2xl bg-[#dcae54] text-[#15130f]"><WandSparkles /></div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#dcae54]">Universal Creative Architect Pro</p>
          <h1 className="font-display text-4xl font-semibold leading-tight">ابنِ عالمك الكرتوني من فكرة واحدة</h1>
          <p className="mt-4 text-[#bdb8ab]">منصة إبداعية تحفظ مشروعاتك وتحوّل الخيال إلى شخصيات ومواقع وحلقات وصور جاهزة للتطوير.</p>
          <Button className="mt-8 h-12 w-full bg-[#e6b95d] text-[#19150f] hover:bg-[#f1ce7d]" onClick={() => startLogin()}>ابدأ مساحة الإبداع <ArrowUpLeft className="mr-2 size-4" /></Button>
        </Card>
      </main>
    );
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#10100f] text-[#f7f1e4]">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#10100f]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-5 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="grid size-11 place-items-center rounded-2xl bg-[#e6b95d] text-[#17140f] shadow-[0_0_30px_rgba(230,185,93,.25)]"><WandSparkles className="size-5" /></div>
            <div><p className="font-display text-lg font-semibold tracking-wide">المعمل الإبداعي</p><p className="text-[11px] text-[#aaa397]">Universal Creative Architect Pro</p></div>
          </div>
          <div className="hidden items-center gap-3 md:flex"><Badge className="border border-[#e6b95d]/30 bg-[#e6b95d]/10 text-[#e6b95d]">النواة 1/1 نشطة</Badge><span className="text-sm text-[#bdb8ab]">{user?.name ?? "المبدع"}</span><Button variant="ghost" size="icon" className="text-[#aaa397] hover:bg-white/10 hover:text-white" onClick={() => logout()}><LogOut className="size-4" /></Button></div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1600px] gap-5 px-5 py-5 lg:grid-cols-[270px_minmax(0,1fr)] lg:px-8">
        <aside className="order-2 lg:order-1">
          <div className="sticky top-25 space-y-4">
            <Card className="border-white/10 bg-[#181816] p-4">
              <div className="mb-4 flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#aaa397]">مساحاتي</p><p className="mt-1 text-sm text-[#f7f1e4]">مشاريعك المحفوظة</p></div><Button size="icon" variant="ghost" className="text-[#e6b95d] hover:bg-[#e6b95d]/10" onClick={() => setSelectedProjectId(null)}><Plus className="size-4" /></Button></div>
              <div className="space-y-2">
                {projectsQuery.data?.map(project => <button key={project.id} onClick={() => { setSelectedProjectId(project.id); setActivePanel("overview"); }} className={`w-full rounded-xl border p-3 text-right transition ${selectedProjectId === project.id ? "border-[#e6b95d]/60 bg-[#e6b95d]/10" : "border-white/5 bg-white/[.02] hover:border-white/15 hover:bg-white/[.05]"}`}><p className="truncate text-sm font-semibold">{project.title}</p><p className="mt-1 truncate text-xs text-[#aaa397]">{project.premise}</p></button>)}
                {!hasProjects && <div className="rounded-xl border border-dashed border-white/10 p-4 text-center text-xs leading-6 text-[#aaa397]">لا توجد مشاريع بعد. ابدأ بفكرة صغيرة ودع المعمل يبني عالمها.</div>}
              </div>
            </Card>
            <Card className="border-white/10 bg-[#181816] p-4"><p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#aaa397]">منهجية البناء</p><div className="space-y-2">{stages.map(stage => { const Icon = stage.icon; const active = selectedProject && selectedProject.currentStage >= stage.id; return <div key={stage.id} className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm"><span className={`grid size-7 place-items-center rounded-lg ${active ? "bg-[#e6b95d] text-[#19150f]" : "bg-white/5 text-[#77736b]"}`}><Icon className="size-3.5" /></span><span className={active ? "text-[#f7f1e4]" : "text-[#77736b]"}>{stage.label}</span>{active && <span className="mr-auto size-1.5 rounded-full bg-[#e6b95d]" />}</div> })}</div></Card>
          </div>
        </aside>

        <section className="order-1 min-w-0 lg:order-2">
          {!selectedProjectId ? (
            <div className="grid min-h-[calc(100vh-130px)] place-items-center">
              <Card className="relative w-full max-w-3xl overflow-hidden border-white/10 bg-[#181816] p-8 shadow-2xl lg:p-12"><div className="absolute -left-16 -top-16 size-56 rounded-full bg-[#e6b95d]/10 blur-3xl" /><div className="relative"><div className="mb-8 flex items-center gap-3"><span className="grid size-12 place-items-center rounded-2xl bg-[#e6b95d]/10 text-[#e6b95d]"><Compass /></span><div><p className="text-xs font-bold uppercase tracking-[0.25em] text-[#e6b95d]">جلسة جديدة</p><p className="text-sm text-[#aaa397]">الفكرة الخام هي نقطة الانطلاق</p></div></div><h1 className="max-w-2xl font-display text-4xl font-semibold leading-[1.2] lg:text-6xl">خلّي فكرتك <span className="text-[#e6b95d]">تتحول لعالم</span></h1><p className="mt-5 max-w-xl text-base leading-8 text-[#bdb8ab]">اكتب فكرة فيلمك أو مسلسلك الكرتوني، وسأبني لك الشخصيات والمركبات والمواقع والحلقة الأولى والبرومو في جلسة واحدة مرتبة.</p><form onSubmit={createNewProject} className="mt-9 space-y-3"><Input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="اسم المشروع، مثال: حراس واحة التروس" className="h-12 border-white/10 bg-[#10100f] text-white placeholder:text-[#6e6b63]" /><Textarea value={newPremise} onChange={e => setNewPremise(e.target.value)} placeholder="صف فكرتك في سطرين على الأقل... من هم الأبطال؟ أين يعيشون؟ وما المشكلة التي ستطلق المغامرة؟" className="min-h-32 resize-none border-white/10 bg-[#10100f] text-white placeholder:text-[#6e6b63]" /><Button disabled={createProject.isPending || !newTitle.trim() || newPremise.trim().length < 10} className="h-12 w-full bg-[#e6b95d] font-semibold text-[#19150f] hover:bg-[#f1ce7d]">{createProject.isPending ? "جاري فتح العالم..." : "افتح مشروعك الإبداعي"}<ChevronLeft className="mr-2 size-4" /></Button></form><div className="mt-8 grid gap-3 text-xs text-[#aaa397] sm:grid-cols-3"><span className="flex items-center gap-2"><Workflow className="size-4 text-[#e6b95d]" /> مراحل متسلسلة</span><span className="flex items-center gap-2"><ImageIcon className="size-4 text-[#e6b95d]" /> صور فعلية</span><span className="flex items-center gap-2"><Clock3 className="size-4 text-[#e6b95d]" /> حفظ تلقائي</span></div></div></Card>
            </div>
          ) : (
            <div className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(360px,.9fr)]">
              <Card className="overflow-hidden border-white/10 bg-[#181816] p-0 shadow-xl"><div className="border-b border-white/10 bg-gradient-to-l from-[#2a2519] to-[#181816] p-5"><div className="flex items-start justify-between gap-4"><div><div className="mb-2 flex items-center gap-2"><Badge className="border-[#e6b95d]/30 bg-[#e6b95d]/10 text-[#e6b95d]">جلسة إنتاج</Badge><span className="text-xs text-[#aaa397]">المرحلة {selectedProject?.currentStage ?? 1} من 4</span></div><h2 className="font-display text-2xl font-semibold">{selectedProject?.title}</h2><p className="mt-1 line-clamp-2 text-sm text-[#aaa397]">{selectedProject?.premise}</p></div><div className="hidden size-12 place-items-center rounded-2xl bg-[#e6b95d]/10 text-[#e6b95d] sm:grid"><Bot /></div></div></div><AIChatBox messages={chatMessages} onSendMessage={handleSend} isLoading={sendMessage.isPending} height="calc(100vh - 250px)" placeholder="اكتب إضافة أو تعديل أو فكرة جديدة للمشروع..." emptyStateMessage="المعمل جاهز لبناء عالمك" suggestedPrompts={["ابنِ لي عالم كرتوني عن مدينة عائمة فوق السحاب", "أريد أبطالاً أطفالاً يحرسون مكتبة سحرية", "اجعل القصة مصرية مع لمسة خيال علمي"]} /></Card>

              <div className="space-y-5">
                <Card className="border-white/10 bg-[#181816] p-4"><div className="mb-4 flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#aaa397]">مخرجات المشروع</p><p className="mt-1 text-sm text-[#f7f1e4]">لوحة القيادة الإبداعية</p></div><Layers3 className="size-5 text-[#e6b95d]" /></div><div className="grid grid-cols-2 gap-2">{[{id:"overview",label:"نظرة عامة",icon:Workflow},{id:"characters",label:"الشخصيات",icon:Sparkles},{id:"vehicles",label:"المركبات",icon:Boxes},{id:"locations",label:"المواقع",icon:Map},{id:"episode",label:"الحلقة",icon:Clapperboard}].map(item => { const Icon=item.icon; return <button key={item.id} onClick={() => setActivePanel(item.id)} className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-right text-xs transition ${activePanel===item.id ? "border-[#e6b95d]/50 bg-[#e6b95d]/10 text-[#f7f1e4]" : "border-white/5 text-[#aaa397] hover:bg-white/5"}`}><Icon className="size-3.5" />{item.label}</button> })}</div></Card>

                {activePanel === "overview" && <OverviewPanel output={latestOutput} project={selectedProject} onGenerateCharacters={generateCharacters} onGenerateLocations={generateLocations} busy={generateAsset.isPending} />}
                {activePanel === "characters" && <CharactersPanel output={latestOutput} imageUrl={selectedProject?.charactersImageUrl} onGenerate={generateCharacters} busy={generateAsset.isPending} />}
                {activePanel === "vehicles" && <VehiclesPanel output={latestOutput} />}
                {activePanel === "locations" && <LocationsPanel output={latestOutput} imageUrl={selectedProject?.locationsImageUrl} onGenerate={generateLocations} busy={generateAsset.isPending} />}
                {activePanel === "episode" && <EpisodePanel output={latestOutput} />}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function OverviewPanel({ output, project, onGenerateCharacters, onGenerateLocations, busy }: { output: any; project: any; onGenerateCharacters: () => void; onGenerateLocations: () => void; busy: boolean }) {
  if (!output) return <Card className="border-dashed border-white/10 bg-[#181816] p-6 text-center text-sm leading-7 text-[#aaa397]">أرسل أول رسالة للمشروع لتوليد لوحة الشخصيات وخريطة المواقع والسيناريو. كل رد سيُحفظ تلقائياً في سجل المشروع.</Card>;
  return <div className="space-y-4"><Card className="border-white/10 bg-[#181816] p-5"><p className="text-xs uppercase tracking-[0.2em] text-[#e6b95d]">الفكرة المركزية</p><h3 className="mt-2 font-display text-xl font-semibold">{output.projectTitle}</h3><p className="mt-2 text-sm leading-7 text-[#bdb8ab]">{output.logline}</p><div className="mt-4 rounded-xl bg-white/[.03] p-3 text-sm leading-7 text-[#aaa397]">{output.concept}</div></Card><div className="grid gap-3 sm:grid-cols-2"><AssetCard title="لوحة الشخصيات" imageUrl={project?.charactersImageUrl} onGenerate={onGenerateCharacters} busy={busy} /><AssetCard title="خريطة المواقع" imageUrl={project?.locationsImageUrl} onGenerate={onGenerateLocations} busy={busy} /></div><Card className="border-white/10 bg-[#181816] p-5"><p className="text-sm font-semibold">البرومو والهوك</p><p className="mt-3 rounded-xl bg-[#e6b95d]/10 p-3 text-sm leading-7 text-[#e6b95d]">{output.promo?.hook}</p><p className="mt-3 text-xs leading-6 text-[#aaa397]">{output.promo?.videoPrompt}</p></Card></div>;
}

function AssetCard({ title, imageUrl, onGenerate, busy }: { title: string; imageUrl?: string | null; onGenerate: () => void; busy: boolean }) {
  return <Card className="overflow-hidden border-white/10 bg-[#181816] p-0"><div className="aspect-[4/3] bg-[#10100f]">{imageUrl ? <img src={imageUrl} alt={title} className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-center text-xs text-[#77736b]"><ImageIcon className="mb-2 size-6 text-[#e6b95d]/60" /><span>الصورة لم تُولّد بعد</span></div>}</div><div className="flex items-center justify-between gap-2 p-3"><span className="text-sm font-semibold">{title}</span><Button size="sm" variant="outline" onClick={onGenerate} disabled={busy} className="border-[#e6b95d]/30 bg-transparent text-[#e6b95d] hover:bg-[#e6b95d]/10">{busy ? "جاري التوليد" : imageUrl ? "إعادة التوليد" : "ولّد صورة"}</Button></div></Card>;
}

function CharactersPanel({ output, imageUrl, onGenerate, busy }: { output: any; imageUrl?: string | null; onGenerate: () => void; busy: boolean }) {
  const characters = output?.stages?.characters?.characters ?? [];
  return <OutputPanel title="لوحة الشخصيات" imageUrl={imageUrl} onGenerate={onGenerate} busy={busy} empty={!output}><div className="space-y-3">{characters.map((character: any) => <div key={character.name} className="rounded-xl border border-white/5 bg-white/[.03] p-4"><div className="flex items-center justify-between"><h4 className="font-semibold">{character.name}</h4><Badge variant="outline" className="border-white/10 text-[#aaa397]">{character.role}</Badge></div><p className="mt-2 text-sm leading-6 text-[#bdb8ab]">{character.visualIdentity}</p><p className="mt-2 text-xs leading-6 text-[#aaa397]">{character.personality} · {character.voiceSignature}</p></div>)}</div></OutputPanel>;
}

function LocationsPanel({ output, imageUrl, onGenerate, busy }: { output: any; imageUrl?: string | null; onGenerate: () => void; busy: boolean }) {
  const locations = output?.stages?.locations?.locations ?? [];
  return <OutputPanel title="خريطة المواقع" imageUrl={imageUrl} onGenerate={onGenerate} busy={busy} empty={!output}><div className="space-y-3">{locations.map((location: any) => <div key={location.name} className="rounded-xl border border-white/5 bg-white/[.03] p-4"><h4 className="font-semibold">{location.name}</h4><p className="mt-2 text-sm text-[#bdb8ab]">{location.purpose}</p><p className="mt-2 text-xs leading-6 text-[#aaa397]">{location.visualDetails}</p></div>)}</div></OutputPanel>;
}

function OutputPanel({ title, imageUrl, onGenerate, busy, empty, children }: { title: string; imageUrl?: string | null; onGenerate: () => void; busy: boolean; empty: boolean; children: React.ReactNode }) {
  return <Card className="border-white/10 bg-[#181816] p-5"><div className="mb-4 flex items-center justify-between gap-3"><h3 className="font-display text-xl font-semibold">{title}</h3>{!empty && <Button size="sm" variant="outline" onClick={onGenerate} disabled={busy} className="border-[#e6b95d]/30 bg-transparent text-[#e6b95d]">{busy ? "جاري التوليد" : imageUrl ? "تحديث الصورة" : "توليد الصورة"}</Button>}</div>{imageUrl && <img src={imageUrl} alt={title} className="mb-4 aspect-video w-full rounded-xl object-cover" />}{empty ? <p className="text-sm leading-7 text-[#aaa397]">ستظهر المخرجات هنا بعد إرسال فكرة المشروع.</p> : children}</Card>;
}

function VehiclesPanel({ output }: { output: any }) {
  const vehicles = output?.stages?.vehicles?.vehicles ?? [];
  return <Card className="border-white/10 bg-[#181816] p-5"><h3 className="font-display text-xl font-semibold">المركبات والأصول</h3><div className="mt-4 space-y-3">{vehicles.length ? vehicles.map((vehicle: any) => <div key={vehicle.name} className="rounded-xl border border-white/5 bg-white/[.03] p-4"><div className="flex items-center justify-between"><h4 className="font-semibold">{vehicle.name}</h4><span className="text-xs text-[#e6b95d]">{vehicle.owner}</span></div><p className="mt-2 text-sm leading-6 text-[#bdb8ab]">{vehicle.visualIdentity}</p><p className="mt-2 text-xs leading-6 text-[#aaa397]">الزمور: {vehicle.hornSound} · الجملة: {vehicle.catchphrase}</p></div>) : <p className="text-sm text-[#aaa397]">أرسل فكرة لتظهر المركبات.</p>}</div></Card>;
}

function EpisodePanel({ output }: { output: any }) {
  const episode = output?.stages?.episode;
  return <Card className="border-white/10 bg-[#181816] p-5"><h3 className="font-display text-xl font-semibold">{episode?.title ?? "سيناريو الحلقة الأولى"}</h3>{episode ? <><p className="mt-2 text-sm leading-7 text-[#bdb8ab]">{episode.logline}</p><div className="mt-5 space-y-4">{episode.scenes?.map((scene: any) => <div key={scene.heading} className="border-r-2 border-[#e6b95d]/50 pr-4"><p className="text-xs font-bold uppercase tracking-[0.15em] text-[#e6b95d]">{scene.heading}</p><p className="mt-2 text-sm leading-7 text-[#bdb8ab]">{scene.action}</p><p className="mt-2 text-sm leading-7 text-[#f7f1e4]">{scene.dialogue}</p></div>)}</div><div className="mt-5 rounded-xl bg-[#e6b95d]/10 p-4 text-sm leading-7 text-[#e6b95d]">{episode.endingHook}</div></> : <p className="mt-3 text-sm leading-7 text-[#aaa397]">أرسل فكرة لتظهر الحلقة الأولى.</p>}</Card>;
}
