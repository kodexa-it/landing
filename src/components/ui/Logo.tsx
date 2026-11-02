import clsx from "clsx"

/** Isotipo de Kodexa (la "K" de tres piezas), trazado a partir del favicon original. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="150 122 215 240" className={clsx("h-7 w-auto", className)} aria-hidden="true" fill="currentColor" stroke="currentColor" strokeWidth="22" strokeLinejoin="round">
      <path d="M171 146h66v96l-68 100h-2c-6 0-1-6-1-10Z" />
      <path d="M252 238 334 148h12v90Z" />
      <path d="M254 258 342 316v26h-88Z" style={{ color: "var(--color-brand)" }} />
    </svg>
  )
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={clsx("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="text-[1.15rem] font-semibold tracking-[-0.03em]">Kodexa</span>
    </span>
  )
}
