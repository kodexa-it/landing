import clsx from "clsx"
import Image from "next/image"

/** Marco de navegador para capturas reales. `caption` aclara el origen cuando corresponde (p. ej. datos de demostración). */
export function Browser({
  src, alt, width, height, caption, className, imgClassName, priority, sizes,
}: {
  src: string; alt: string; width: number; height: number; caption?: string; className?: string; imgClassName?: string; priority?: boolean; sizes?: string
}) {
  return (
    <div className={clsx("overflow-hidden rounded-2xl border border-line bg-white shadow-soft", className)}>
      <div className="flex items-center gap-1.5 border-b border-line bg-mist px-3 py-2">
        <span className="size-2 rounded-full bg-ink/15" /><span className="size-2 rounded-full bg-ink/15" /><span className="size-2 rounded-full bg-ink/15" />
        {caption && <span className="t-label ml-2 truncate text-[0.6rem] text-muted">{caption}</span>}
      </div>
      <Image src={src} alt={alt} width={width} height={height} priority={priority} sizes={sizes} className={clsx("h-auto w-full", imgClassName)} />
    </div>
  )
}
