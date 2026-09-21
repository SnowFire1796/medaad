import { Button } from "@/components/ui/button";
import { ArrowLeft, Inbox, Sparkles } from "lucide-react";
import { Link } from "wouter";

export function PageHeader({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: React.ReactNode }) {
  return <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><div className="mb-2 text-xs font-black tracking-wide text-[#f08f4f]">{eyebrow ?? "فضای یادگیری"}</div><h1 className="text-3xl font-black tracking-tight text-[#163c41]">{title}</h1>{description && <p className="mt-2 max-w-2xl text-sm leading-7 text-[#71878b]">{description}</p>}</div>{action}</div>;
}

export function EmptyState({ title, description, href, actionLabel }: { title: string; description: string; href?: string; actionLabel?: string }) {
  return <div className="flex min-h-[220px] flex-col items-center justify-center rounded-[1.4rem] border border-dashed border-[#cbdfe0] bg-white/65 p-8 text-center"><div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#edf5f5] text-[#087f8c]"><Inbox className="h-5 w-5" /></div><h3 className="font-extrabold text-[#315a60]">{title}</h3><p className="mt-2 max-w-sm text-sm leading-7 text-[#819599]">{description}</p>{href && <Link href={href} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#087f8c]">{actionLabel ?? "شروع کن"}<ArrowLeft className="h-4 w-4" /></Link>}</div>;
}

export function StatCard({ label, value, hint, icon: Icon, tone = "teal" }: { label: string; value: string | number; hint: string; icon: React.ComponentType<{ className?: string }>; tone?: "teal" | "orange" | "blue" | "green" }) {
  const tones = { teal: "bg-[#e1f4f2] text-[#087f8c]", orange: "bg-[#fff0df] text-[#d77b35]", blue: "bg-[#e7f0ff] text-[#4c72bd]", green: "bg-[#e3f4e9] text-[#4a9667]" };
  return <div className="rounded-[1.25rem] border border-[#deeaeb] bg-white p-5 shadow-[0_10px_30px_rgba(16,64,72,.04)]"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold text-[#80979a]">{label}</p><p className="mt-2 text-3xl font-black text-[#214950]">{value}</p></div><div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tones[tone]}`}><Icon className="h-5 w-5" /></div></div><p className="mt-4 text-xs text-[#84999c]">{hint}</p></div>;
}

export function AIChip({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return <button onClick={onClick} className="inline-flex items-center gap-1.5 rounded-full border border-[#bfe4e1] bg-[#f1fbfa] px-3 py-2 text-xs font-bold text-[#087f8c] transition hover:bg-[#e1f4f2]"><Sparkles className="h-3.5 w-3.5" />{children}</button>;
}
