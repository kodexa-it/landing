"use client"

import { useState } from "react"

const wa = "https://wa.me/5491178148150?text=Hola%2C%20quiero%20hablar%20con%20Kodexa"
const links = [
  ["Servicios", "#m-servicios"],
  ["Productos", "#m-productos"],
  ["Proyectos", "#m-proyectos"],
  ["Contacto", "#contacto"],
]

export function MobileHeader() {
  const [open, setOpen] = useState(false)
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 40, background: "#fff", borderBottom: "1px solid #E4E4DF" }}>
      <div style={{ height: 64, boxSizing: "border-box", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="#m-top" aria-label="Kodexa — inicio" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ position: "relative", width: 24, height: 16, display: "block" }}>
            <i style={{ position: "absolute", left: 0, top: 1, width: 14, height: 14, background: "#FF5A1F", display: "block" }} />
            <i style={{ position: "absolute", left: 7, top: 1, width: 14, height: 14, border: "1.5px solid #0A0A0A", borderRadius: "50%", display: "block", boxSizing: "border-box" }} />
          </span>
          <span style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-.7px" }}>kodexa</span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <a className="btn btn-p" style={{ minHeight: 44, padding: "0 16px", fontSize: 14 }} data-event="whatsapp_click" data-origin="header" href={wa} target="_blank" rel="noopener noreferrer">Hablemos</a>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            style={{ width: 44, height: 44, border: "1px solid #CFCFCA", borderRadius: 8, background: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5, cursor: "pointer", padding: 0 }}
          >
            <span style={{ width: 18, height: 2, background: "#0A0A0A", display: "block" }} />
            <span style={{ width: 18, height: 2, background: "#0A0A0A", display: "block" }} />
          </button>
        </div>
      </div>
      {open && (
        <nav aria-label="Principal" style={{ background: "#0A0A0A", color: "#fff", padding: "8px 20px 28px", display: "flex", flexDirection: "column" }}>
          {links.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setOpen(false)} style={{ fontSize: 30, lineHeight: "38px", fontWeight: 500, letterSpacing: "-.8px", padding: "14px 0", borderBottom: "1px solid #222220" }}>
              {label}
            </a>
          ))}
          <a className="btn btn-p" style={{ marginTop: 24 }} data-event="whatsapp_click" data-origin="menu-mobile" href={wa} target="_blank" rel="noopener noreferrer">Hablemos por WhatsApp <span>→</span></a>
        </nav>
      )}
    </header>
  )
}
