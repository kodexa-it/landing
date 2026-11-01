/**
 * Origen de la visita (UTM y referrer externo) para las interacciones.
 * Se guarda en sessionStorage la primera vez que se ve; no contiene datos personales.
 * Todo está envuelto en try/catch: con el almacenamiento bloqueado simplemente no hay atribución.
 */
const KEY = "kx_attribution"
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign"] as const

export type Attribution = { utm_source?: string; utm_medium?: string; utm_campaign?: string; referrer?: string }

function fromLocation(): Attribution {
  const out: Attribution = {}
  try {
    const p = new URLSearchParams(window.location.search)
    for (const k of UTM_KEYS) {
      const v = p.get(k)
      if (v) out[k] = v.slice(0, 100)
    }
  } catch {}
  return out
}

function read(): Attribution {
  try {
    const raw = sessionStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Attribution) : {}
  } catch {
    return {}
  }
}

/** Se llama al cargar cada página: conserva el primer origen y suma UTM si recién aparecen. */
export function captureAttribution() {
  try {
    const stored = read()
    const current = fromLocation()
    const next: Attribution = { ...stored }

    if (!stored.referrer && document.referrer) {
      const u = new URL(document.referrer)
      if (u.origin !== window.location.origin) next.referrer = `${u.origin}${u.pathname}`.slice(0, 200)
    }
    if (!stored.utm_source && current.utm_source) {
      for (const k of UTM_KEYS) if (current[k]) next[k] = current[k]
    }
    sessionStorage.setItem(KEY, JSON.stringify(next))
  } catch {}
}

export function getAttribution(): Attribution {
  return { ...fromLocation(), ...read() }
}
