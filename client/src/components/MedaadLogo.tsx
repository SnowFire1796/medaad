import { Pencil } from "lucide-react";
import { Link } from "wouter";

export default function MedaadLogo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="group inline-flex items-center gap-2.5" aria-label="مداد، صفحه اصلی">
      <span className="relative flex h-10 w-10 rotate-[-8deg] items-center justify-center rounded-[13px] bg-[#087f8c] text-white shadow-[0_7px_16px_rgba(8,127,140,.2)] transition-transform group-hover:rotate-0">
        <Pencil className="h-5 w-5 rotate-[8deg]" />
        <span className="absolute -bottom-1 -left-1 h-3 w-3 rounded-full bg-[#f4ae6e]" />
      </span>
      {!compact && <span className="text-xl font-black tracking-tight text-[#153d43]">مداد</span>}
    </Link>
  );
}
