import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BookOpen, Brain, CalendarDays, ChevronLeft, ClipboardList, FileText, GraduationCap, LayoutDashboard, LogOut, Menu, MessageCircle, NotebookPen, PanelRight, Settings, Sparkles, Target, Users, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import MedaadLogo from "./MedaadLogo";

const studentNav = [
  { label: "داشبورد", href: "/dashboard", icon: LayoutDashboard },
  { label: "درس بده", href: "/tutor", icon: MessageCircle },
  { label: "حل کن", href: "/solve", icon: Sparkles },
  { label: "فایل‌های من", href: "/files", icon: FileText },
  { label: "آزمون‌ها", href: "/quizzes", icon: ClipboardList },
  { label: "فلش‌کارت‌ها", href: "/flashcards", icon: NotebookPen },
  { label: "برنامه‌ریزی", href: "/planner", icon: CalendarDays },
  { label: "پیشرفت من", href: "/progress", icon: Target },
];

const teacherNav = [
  { label: "داشبورد", href: "/teacher", icon: LayoutDashboard },
  { label: "کلاس‌های من", href: "/teacher/classes", icon: Users },
  { label: "درس‌ها", href: "/teacher/lessons", icon: BookOpen },
  { label: "آزمون‌ها", href: "/teacher/quizzes", icon: ClipboardList },
  { label: "تکالیف", href: "/teacher/assignments", icon: NotebookPen },
  { label: "دانش‌آموزان", href: "/teacher/students", icon: GraduationCap },
  { label: "فایل‌ها", href: "/teacher/files", icon: FileText },
];

function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex min-h-screen items-center justify-center bg-[#f7fafb]"><div className="flex items-center gap-3 text-sm text-[#6c858b]"><span className="h-4 w-4 animate-spin rounded-full border-2 border-[#b9d9d8] border-t-[#087f8c]" /> در حال آماده‌سازی فضای یادگیری...</div></div>;
  if (!user) return <div className="flex min-h-screen items-center justify-center bg-[#f7fafb] px-5"><div className="w-full max-w-md rounded-[2rem] border border-[#dce8e9] bg-white p-8 text-center shadow-xl"><div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e1f4f2] text-[#087f8c]"><GraduationCap className="h-7 w-7" /></div><h1 className="text-2xl font-black text-[#163c41]">برای ادامه وارد شو</h1><p className="mt-3 text-sm leading-7 text-[#6c858b]">فضای یادگیری شخصی مداد با ورود به حساب کاربری در دسترس است.</p><Button onClick={() => startLogin()} className="mt-7 h-12 w-full rounded-xl bg-[#087f8c] font-bold hover:bg-[#076d78]">ورود به مداد</Button><Link href="/" className="mt-4 inline-flex text-sm font-bold text-[#087f8c]">بازگشت به صفحه اصلی</Link></div></div>;
  return <>{children}</>;
}

export default function AppShell({ children, teacher = false }: { children: React.ReactNode; teacher?: boolean }) {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const [open, setOpen] = useState(false);
  const profile = trpc.profile.me.useQuery(undefined, { enabled: Boolean(user), retry: false });
  const onboarding = trpc.profile.save.useMutation({ onSuccess: () => profile.refetch() });
  useEffect(() => { if (!user || profile.isLoading || profile.data || onboarding.isPending) return; const intended = localStorage.getItem("medaad-intended-role"); if (!intended) return; localStorage.removeItem("medaad-intended-role"); onboarding.mutate({ role: intended === "teacher" ? "teacher" : "student" }); }, [user, profile.isLoading, profile.data, onboarding.isPending]);
  const nav = teacher ? teacherNav : studentNav;
  const displayName = profile.data?.name || user?.name || "دوست مدادی";
  const initials = displayName.slice(0, 1);
  if (teacher && !profile.isLoading && profile.data && profile.data.role !== "teacher" && user?.role !== "admin") return <div dir="rtl" className="flex min-h-screen items-center justify-center bg-[#f7fafb] px-5"><div className="w-full max-w-md rounded-[2rem] border border-[#dce8e9] bg-white p-8 text-center shadow-xl"><h1 className="text-2xl font-black text-[#163c41]">دسترسی مخصوص معلم‌هاست</h1><p className="mt-3 text-sm leading-7 text-[#6c858b]">این حساب هنوز به عنوان معلم ثبت نشده است.</p><Link href="/dashboard" className="mt-6 inline-flex h-11 items-center rounded-xl bg-[#087f8c] px-5 text-sm font-bold text-white">بازگشت به داشبورد</Link></div></div>;
  return <AuthGate><div dir="rtl" className="min-h-screen bg-[#f7fafb]">
    {open && <button aria-label="بستن منو" onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-[#10363b]/25 backdrop-blur-sm lg:hidden" />}
    <aside className={`fixed inset-y-0 right-0 z-50 flex w-[280px] flex-col border-l border-[#dce8e9] bg-white transition-transform duration-200 lg:translate-x-0 ${open ? "translate-x-0" : "translate-x-full"}`}>
      <div className="flex h-20 items-center justify-between border-b border-[#edf2f2] px-5"><MedaadLogo /><button onClick={() => setOpen(false)} className="rounded-lg p-2 text-[#6c858b] hover:bg-[#edf5f5] lg:hidden" aria-label="بستن"><X className="h-5 w-5" /></button></div>
      <div className="flex items-center gap-3 border-b border-[#edf2f2] px-5 py-5"><Avatar className="h-11 w-11 border-2 border-[#d7efed]"><AvatarFallback className="bg-[#e1f4f2] font-black text-[#087f8c]">{initials}</AvatarFallback></Avatar><div className="min-w-0"><p className="truncate text-sm font-extrabold text-[#244c52]">{displayName}</p><p className="mt-1 text-xs text-[#789095]">{teacher ? "فضای معلم" : "فضای دانش‌آموز"}</p></div></div>
      <nav className="flex-1 overflow-y-auto px-3 py-5"><p className="mb-3 px-3 text-[11px] font-black tracking-wide text-[#94a9ac]">منوی اصلی</p><div className="space-y-1">{nav.map(item => { const Icon = item.icon; const active = location === item.href || (item.href !== "/dashboard" && item.href !== "/teacher" && location.startsWith(item.href)); return <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition ${active ? "bg-[#e5f5f3] text-[#087f8c]" : "text-[#607b80] hover:bg-[#f3f8f8] hover:text-[#087f8c]"}`}><Icon className={`h-[18px] w-[18px] ${active ? "text-[#087f8c]" : "text-[#90aaad] group-hover:text-[#087f8c]"}`} />{item.label}{active && <ChevronLeft className="mr-auto h-4 w-4" />}</Link> })}</div><div className="my-6 h-px bg-[#edf2f2]" /><Link href={teacher ? "/teacher/settings" : "/settings"} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-[#607b80] transition hover:bg-[#f3f8f8] hover:text-[#087f8c]"><Settings className="h-[18px] w-[18px] text-[#90aaad]" /> تنظیمات</Link></nav>
      <div className="border-t border-[#edf2f2] p-4"><button onClick={() => logout()} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-[#b45d52] transition hover:bg-[#fff1ef]"><LogOut className="h-[18px] w-[18px]" /> خروج از حساب</button></div>
    </aside>
    <div className="lg:pr-[280px]"><header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-[#dce8e9]/70 bg-[#f7fafb]/85 px-4 backdrop-blur-xl sm:px-7"><div className="flex items-center gap-3"><button onClick={() => setOpen(true)} className="rounded-xl border border-[#dce8e9] bg-white p-2.5 text-[#4d7176] lg:hidden" aria-label="باز کردن منو"><Menu className="h-5 w-5" /></button><div className="hidden items-center gap-2 text-sm text-[#789095] sm:flex"><PanelRight className="h-4 w-4" /><span>{teacher ? "فضای معلم" : "فضای یادگیری"}</span><ChevronLeft className="h-3 w-3" /><span className="font-bold text-[#315a60]">{teacher ? "کلاس‌های من" : "امروز"}</span></div></div><div className="flex items-center gap-3"><div className="hidden rounded-full bg-white px-3 py-2 text-xs font-bold text-[#698185] shadow-sm sm:block">{new Intl.DateTimeFormat("fa-IR", { weekday: "long", day: "numeric", month: "long" }).format(new Date())}</div><Avatar className="h-10 w-10 border-2 border-white shadow-sm"><AvatarFallback className="bg-[#e1f4f2] font-black text-[#087f8c]">{initials}</AvatarFallback></Avatar></div></header><main className="mx-auto max-w-[1240px] px-4 py-7 sm:px-7 lg:px-10">{children}</main></div>
  </div></AuthGate>;
}
