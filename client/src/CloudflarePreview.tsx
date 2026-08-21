import { archCharacters, archDistricts, ARCH001_SIGNATURE } from "../../shared/arch001";
import { archTeamRoles } from "../../shared/arch001Team";
import { Aperture, ArrowUpLeft, Cloud, LockKeyhole, MapPinned, UsersRound } from "lucide-react";

const LIVE_MANUS_URL = "https://crearchbot-mthmrq9b.manus.space";

export default function CloudflarePreview() {
  const locked = archCharacters.filter((character) => character.status === "LOCKED").length;

  return (
    <main dir="rtl" className="min-h-screen overflow-x-hidden bg-[#050b11] text-[#f5edce] selection:bg-cyan-300/30">
      <div className="pointer-events-none fixed inset-0 opacity-40 [background-image:linear-gradient(rgba(93,232,255,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(93,232,255,.045)_1px,transparent_1px)] [background-size:54px_54px]" />
      <header className="relative border-b border-cyan-300/20 bg-[#061019]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4">
          <div className="flex items-center gap-3"><div className="grid size-10 place-items-center rounded-xl border border-[#e4bd59]/70 bg-[#e4bd59]/10 text-[#e4bd59]"><Aperture className="size-5" /></div><div><p className="font-display text-lg font-bold">ARCH-001</p><p className="text-[10px] tracking-[.2em] text-cyan-200/75">CLOUDFLARE PUBLIC PREVIEW</p></div></div>
          <a href={LIVE_MANUS_URL} className="inline-flex items-center gap-2 rounded-xl bg-[#e4bd59] px-4 py-2 text-sm font-bold text-[#10202a] transition hover:bg-[#f4d889]">افتح غرفة العمليات الكاملة <ArrowUpLeft className="size-4" /></a>
        </div>
      </header>

      <section className="relative mx-auto max-w-6xl px-5 pb-12 pt-16 sm:pt-24">
        <div className="grid gap-9 lg:grid-cols-[1.2fr_.8fr] lg:items-center">
          <div>
            <p className="text-xs tracking-[.24em] text-[#e9cd7a]">ORIGINAL JEWEL &gt; SYSTEM JEWEL &gt; CITY &gt; EPISODES</p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-6xl">معاينة عامة مجانية<br /><span className="text-cyan-200">لعالم بشوشا</span></h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#c5d6dc]">هذه النسخة تعمل كواجهة تعريفية سريعة على Cloudflare Workers من دون تسجيل دخول أو مفاتيح. سجل المدينة وطبقة الفريق ظاهرين، أما إنتاج الشات المحمي فيبقى في غرفة العمليات الكاملة.</p>
            <div className="mt-7 flex flex-wrap gap-3"><Pill label={`${locked} DNA LOCKED`} /><Pill label={`${archDistricts.length} أحياء`} /><Pill label={ARCH001_SIGNATURE} /></div>
          </div>
          <div className="rounded-[28px] border border-cyan-300/30 bg-gradient-to-br from-[#0b2935] via-[#071923] to-[#111007] p-6 shadow-[0_25px_70px_rgba(0,0,0,.35)]">
            <Cloud className="size-8 text-cyan-200" /><p className="mt-5 text-[11px] tracking-[.22em] text-cyan-200">FREE PREVIEW LAYER</p><p className="mt-2 font-display text-2xl font-bold">Cloudflare Worker</p><p className="mt-3 text-sm leading-7 text-[#b9cbd0]">واجهة عامة بلا أسرار، قابلة للربط من GitHub. لا تدّعي هذه النسخة أنها تشغل OAuth أو قاعدة البيانات أو محرك الشات الداخلي.</p>
          </div>
        </div>
      </section>

      <section className="relative mx-auto grid max-w-6xl gap-5 px-5 pb-16 md:grid-cols-2">
        <article className="rounded-3xl border border-cyan-300/20 bg-[#07131c]/95 p-6"><div className="flex items-center gap-3 text-cyan-100"><UsersRound className="size-5" /><h2 className="font-display text-xl font-bold">طبقة الفريق الواحدة</h2></div><p className="mt-3 text-sm leading-7 text-[#b9cbd0]">إسلام يحدد الاتجاه، مصطفى يراجع الروح البشرية والكوميديا، وManus يترجم القرار إلى بطاقة إنتاج، بينما DNA LOCK يحرس المرجع.</p><div className="mt-5 space-y-3">{archTeamRoles.map((role) => <div key={role.id} className="rounded-xl border border-white/10 bg-white/[.025] p-3"><p className="text-sm font-bold">{role.member} · {role.title}</p><p className="mt-1 text-xs leading-6 text-[#9db4bd]">{role.responsibility}</p></div>)}</div></article>
        <article className="rounded-3xl border border-[#e4bd59]/25 bg-[#e4bd59]/[.055] p-6"><div className="flex items-center gap-3 text-[#e9cd7a]"><MapPinned className="size-5" /><h2 className="font-display text-xl font-bold">خريطة المرجع</h2></div><div className="mt-5 grid gap-2">{archDistricts.map((district) => <div key={district.id} className="flex items-center gap-3 rounded-xl border border-[#e4bd59]/15 bg-[#07131c]/55 p-3"><span className="grid size-8 place-items-center rounded-lg bg-cyan-300/10 text-cyan-200">{district.icon}</span><p className="text-sm font-bold">{district.id} · {district.label}</p></div>)}</div><div className="mt-6 rounded-xl border border-cyan-300/20 bg-cyan-300/[.06] p-4"><div className="flex items-center gap-2 text-cyan-100"><LockKeyhole className="size-4" /><p className="text-sm font-bold">حدود المعاينة</p></div><p className="mt-2 text-xs leading-6 text-[#b9cbd0]">لإنشاء مشهد أو حلقة أو استخدام الشات، انتقل إلى غرفة العمليات الكاملة؛ هذه نسخة عرض عامة فقط.</p></div></article>
      </section>
    </main>
  );
}

function Pill({ label }: { label: string }) {
  return <span className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1.5 text-xs text-cyan-100">{label}</span>;
}
