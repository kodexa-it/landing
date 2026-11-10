import { LifeBuoy } from "lucide-react"
import type { Dict } from "@/lib/dict/es"

/** Aviso de estado: el producto está en beta, pero se puede acceder y tiene soporte prioritario del equipo técnico. */
export function BetaNote({ d, className }: { d: Dict; className?: string }) {
  return (
    <div className={`flex items-start gap-3 rounded-2xl border border-brand/30 bg-brand/[0.08] p-4 ${className ?? ""}`}>
      <LifeBuoy className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />
      <div>
        <p className="text-[0.92rem] font-semibold text-white">{d.beta.title}</p>
        <p className="mt-1 text-[0.85rem] leading-snug text-white/70">{d.beta.text}</p>
      </div>
    </div>
  )
}

export function BetaBadge({ d }: { d: Dict }) {
  return <span className="t-label rounded-full border border-brand/60 px-2.5 py-0.5 text-[0.6rem] text-brand">{d.beta.badge}</span>
}
