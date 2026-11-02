import { Check } from "lucide-react"

export function FeatureList({ items, dark }: { items: readonly string[]; dark?: boolean }) {
  return (
    <ul className="space-y-2.5">
      {items.map((f) => (
        <li key={f} className={`flex items-start gap-2.5 text-[0.95rem] ${dark ? "text-white/80" : "text-ink/80"}`}>
          <Check className="mt-1 size-4 shrink-0 text-brand" aria-hidden strokeWidth={2.5} />
          {f}
        </li>
      ))}
    </ul>
  )
}
