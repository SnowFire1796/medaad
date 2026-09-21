import { startLogin } from "@/const";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowUpLeft, BookOpen, Brain, Check, ChevronLeft, FileText, GraduationCap, LayoutDashboard, MessageCircle, NotebookPen, Play, Sparkles, Target, Users, WandSparkles } from "lucide-react";
import { Link } from "wouter";
import MedaadLogo from "@/components/MedaadLogo";

const features = [
  { icon: BookOpen, title: "درس بده", text: "موضوعات سخت را قدم‌به‌قدم و با زبان ساده یاد بگیر.", tone: "teal" },
  { icon: WandSparkles, title: "حل کن", text: "مسئله را تحلیل کن، راه‌حل را بفهم و تمرین کن.", tone: "orange" },
  { icon: FileText, title: "از روی عکس بخون", text: "از سؤال عکس بگیر و توضیح مرحله‌به‌مرحله بگیر.", tone: "lavender" },
  { icon: NotebookPen, title: "جزوه‌ساز", text: "از متن و فایل، خلاصه و نکات کلیدی بساز.", tone: "blue" },
  { icon: Brain, title: "آزمون بساز", text: "با کمک هوش مصنوعی برای مرور آماده شو.", tone: "rose" },
  { icon: Target, title: "برنامه‌ریزی", text: "برای هدف‌های درسی‌ات برنامه‌ای واقعی بچین.", tone: "green" },
];

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#f7fafb]">
      <header className="relative z-20 border-b border-[#dce8e9]/70 bg-[#f7fafb]/85 backdrop-blur-xl">
        <div className="container flex h-20 items-center justify-between gap-6">
          <MedaadLogo />
          <nav className="hidden items-center gap-8 text-sm font-medium text-[#507078] md:flex">
            <a href="#features" className="transition-colors hover:text-[#087f8c]">امکانات</a>
            <a href="#how" className="transition-colors hover:text-[#087f8c]">چطور کار می‌کند؟</a>
            <a href="#for-teachers" className="transition-colors hover:text-[#087f8c]">برای معلم‌ها</a>
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={() => startLogin()} className="hidden px-4 py-2 text-sm font-semibold text-[#23606a] transition hover:text-[#087f8c] sm:block">ورود</button>
            <Button onClick={() => startLogin()} className="h-11 rounded-full bg-[#087f8c] px-5 text-sm font-bold shadow-[0_8px_20px_rgba(8,127,140,.2)] hover:bg-[#076d78]">شروع یادگیری <ArrowLeft className="mr-2 h-4 w-4" /></Button>
          </div>
        </div>
      </header>

      <main>
        <section className="relative border-b border-[#dce8e9]/70">
          <div className="absolute inset-0 paper-grid opacity-70 [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" />
          <div className="container relative grid min-h-[650px] items-center gap-14 py-20 lg:grid-cols-[1.02fr_.98fr] lg:gap-8 lg:py-24">
            <div className="max-w-2xl">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#bce4e2] bg-white/75 px-3 py-1.5 text-xs font-bold text-[#087f8c] shadow-sm"><Sparkles className="h-3.5 w-3.5" /> یادگیری با ریتم خودت</div>
              <h1 className="max-w-xl text-balance text-5xl font-black leading-[1.18] tracking-tight text-[#10363b] sm:text-6xl lg:text-[4.6rem]">هر چیزی که<br /><span className="text-[#087f8c]">نمی‌فهمی، بپرس.</span></h1>
              <p className="mt-7 max-w-xl text-lg leading-9 text-[#5a7378] sm:text-xl">مداد یک همراه یادگیری هوشمند است؛ مفاهیم را برایت روشن می‌کند، از اشتباه‌هایت یاد می‌گیرد و کمک می‌کند مستقل‌تر پیش بروی.</p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Button onClick={() => startLogin()} className="h-14 rounded-full bg-[#087f8c] px-7 text-base font-bold shadow-[0_14px_28px_rgba(8,127,140,.23)] hover:bg-[#076d78]">همین حالا شروع کن <ArrowLeft className="mr-2 h-5 w-5" /></Button>
                <a href="#how" className="inline-flex h-14 items-center gap-2 rounded-full border border-[#cfe1e2] bg-white/70 px-6 text-sm font-bold text-[#35636a] transition hover:border-[#8acbc9] hover:bg-white"><Play className="h-4 w-4 fill-current" /> یک نگاه کوتاه</a>
              </div>
              <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-[#6a8286]"><span className="flex items-center gap-2"><Check className="h-4 w-4 text-[#f29a5a]" /> مناسب دانش‌آموز و معلم</span><span className="flex items-center gap-2"><Check className="h-4 w-4 text-[#f29a5a]" /> فارسی و راست‌به‌چپ</span></div>
            </div>
            <div className="relative mx-auto w-full max-w-[520px] lg:mr-auto lg:ml-0">
              <div className="absolute -right-7 -top-10 h-28 w-28 rounded-full bg-[#f9c58c]/35 blur-2xl" /><div className="absolute -bottom-10 -left-4 h-40 w-40 rounded-full bg-[#9edbd8]/45 blur-3xl" />
              <div className="relative rounded-[2rem] border border-white bg-white/90 p-3 shadow-[0_30px_90px_rgba(22,78,84,.15)] backdrop-blur">
                <div className="rounded-[1.5rem] bg-[#eef7f6] p-5 sm:p-7">
                  <div className="mb-6 flex items-center justify-between"><div className="flex items-center gap-2"><div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#087f8c] text-white"><Brain className="h-5 w-5" /></div><div><p className="text-xs text-[#6d8588]">همراه یادگیری</p><p className="font-extrabold text-[#163c41]">سلام، آوا!</p></div></div><div className="rounded-full bg-white px-3 py-1 text-[11px] font-bold text-[#087f8c]">امروز</div></div>
                  <div className="rounded-2xl bg-white p-5 shadow-sm"><div className="mb-4 flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#dff2f0] text-[#087f8c]"><MessageCircle className="h-4 w-4" /></div><p className="text-sm font-bold text-[#204a50]">مداد می‌پرسد</p></div><p className="text-sm leading-7 text-[#587175]">می‌خواهی مبحث <span className="font-bold text-[#087f8c]">کسرها</span> را با یک مثال ساده شروع کنیم؟</p><div className="mt-5 flex gap-2"><div className="h-9 flex-1 rounded-xl bg-[#e9f6f5]" /><div className="h-9 w-24 rounded-xl bg-[#087f8c]" /></div></div>
                  <div className="mt-4 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-[#fff4e8] p-4"><p className="text-[11px] text-[#9c6c45]">تمرکز امروز</p><p className="mt-1 text-2xl font-black text-[#9a5b2d]">۲۵ دقیقه</p></div><div className="rounded-2xl bg-[#e4f5ef] p-4"><p className="text-[11px] text-[#54806f]">هدف بعدی</p><p className="mt-1 text-sm font-black text-[#2e6b57]">مرور علوم</p></div></div>
                </div>
              </div>
              <div className="absolute -bottom-5 -right-6 hidden items-center gap-3 rounded-2xl border border-[#d8ecea] bg-white px-4 py-3 shadow-xl sm:flex"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fff0dc] text-[#d77831]"><Target className="h-4 w-4" /></div><div><p className="text-[10px] text-[#759092]">یادگیری هدفمند</p><p className="text-xs font-extrabold text-[#254e53]">قدم‌به‌قدم جلو برو</p></div></div>
            </div>
          </div>
        </section>

        <section id="features" className="container py-24">
          <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="mb-3 text-sm font-black tracking-wide text-[#f08f4f]">یک جعبه‌ابزار کامل برای یادگیری</p><h2 className="text-3xl font-black tracking-tight text-[#163c41] sm:text-4xl">هر چیزی که برای بهتر یاد گرفتن لازم داری</h2></div><p className="max-w-sm text-sm leading-7 text-[#6a8286]">مداد قرار نیست فقط جواب بدهد؛ قرار است کمک کند سؤال بهتری بپرسی و راه‌حل را خودت پیدا کنی.</p></div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{features.map((feature) => { const Icon = feature.icon; const tones: Record<string, string> = { teal: "bg-[#e1f4f2] text-[#087f8c]", orange: "bg-[#fff0df] text-[#d77b35]", lavender: "bg-[#eeeaff] text-[#7562c3]", blue: "bg-[#e7f0ff] text-[#4c72bd]", rose: "bg-[#ffebec] text-[#bd5e69]", green: "bg-[#e3f4e9] text-[#4a9667]" }; return <div key={feature.title} className="interactive group rounded-[1.35rem] border border-[#deeaeb] bg-white p-6"><div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ${tones[feature.tone]}`}><Icon className="h-5 w-5" /></div><h3 className="text-lg font-extrabold text-[#244c52]">{feature.title}</h3><p className="mt-2 text-sm leading-7 text-[#6b8286]">{feature.text}</p><div className="mt-5 flex items-center gap-1 text-xs font-bold text-[#087f8c] opacity-0 transition group-hover:opacity-100">بیشتر بدان <ChevronLeft className="h-3.5 w-3.5" /></div></div> })}</div>
        </section>

        <section id="how" className="border-y border-[#dce8e9]/70 bg-[#eef7f6] py-24"><div className="container"><div className="mx-auto max-w-2xl text-center"><p className="mb-3 text-sm font-black text-[#087f8c]">ساده، روشن، کاربردی</p><h2 className="text-3xl font-black tracking-tight text-[#163c41] sm:text-4xl">یادگیری با مداد چطور پیش می‌رود؟</h2><p className="mt-4 text-sm leading-7 text-[#698185]">در چند قدم کوتاه از سردرگمی به فهم واقعی می‌رسی.</p></div><div className="mt-14 grid gap-4 md:grid-cols-5">{["انتخاب درس", "پرسیدن سؤال", "یادگیری", "تمرین", "بررسی پیشرفت"].map((step, index) => <div key={step} className="relative text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-xl font-black text-[#087f8c] shadow-sm">{index + 1}</div><h3 className="mt-4 text-sm font-extrabold text-[#315a60]">{step}</h3>{index < 4 && <ArrowUpLeft className="absolute -left-3 top-5 hidden h-5 w-5 -rotate-45 text-[#a6ccca] md:block" />}</div>)}</div></div></section>

        <section id="for-teachers" className="container py-24"><div className="overflow-hidden rounded-[2rem] bg-[#123f46] px-7 py-12 text-white sm:px-12 lg:flex lg:items-center lg:justify-between lg:gap-12"><div className="max-w-xl"><div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-[#b5e5e1]"><GraduationCap className="h-4 w-4" /> برای معلم‌ها</div><h2 className="text-3xl font-black leading-[1.35] sm:text-4xl">کلاس را از حالت مدیریت، به فضای یادگیری تبدیل کن.</h2><p className="mt-5 leading-8 text-[#b3d0d0]">کلاس بساز، محتوا منتشر کن، آزمون طراحی کن و با شناخت بهتر از مسیر دانش‌آموزها همراهشان باش.</p><Button onClick={() => startLogin()} className="mt-8 h-12 rounded-full bg-[#f4ae6e] px-6 font-bold text-[#57311c] hover:bg-[#ffc28c]">ورود به فضای معلم <ArrowLeft className="mr-2 h-4 w-4" /></Button></div><div className="mt-12 grid max-w-md grid-cols-2 gap-3 lg:mt-0"><div className="rounded-2xl bg-white/10 p-5"><Users className="mb-5 h-5 w-5 text-[#f4ae6e]" /><p className="text-sm font-bold">کلاس‌های من</p><p className="mt-2 text-xs leading-6 text-[#b3d0d0]">اعضا و فعالیت‌ها را یکجا ببین.</p></div><div className="rounded-2xl bg-white/10 p-5"><LayoutDashboard className="mb-5 h-5 w-5 text-[#9ddbd6]" /><p className="text-sm font-bold">داشبورد واقعی</p><p className="mt-2 text-xs leading-6 text-[#b3d0d0]">بدون آمار ساختگی، فقط داده‌های واقعی.</p></div></div></div></section>
      </main>

      <footer className="border-t border-[#dce8e9] bg-white"><div className="container flex flex-col gap-6 py-9 text-sm text-[#6d8588] sm:flex-row sm:items-center sm:justify-between"><MedaadLogo compact /><div className="flex flex-wrap gap-5"><a href="#features" className="hover:text-[#087f8c]">امکانات</a><a href="#for-teachers" className="hover:text-[#087f8c]">برای معلم‌ها</a><Link href="/login" className="hover:text-[#087f8c]">ورود</Link></div><p className="text-xs">هر چیزی که نمی‌فهمی، بپرس.</p></div></footer>
    </div>
  );
}
