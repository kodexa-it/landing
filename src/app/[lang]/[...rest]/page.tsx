import { notFound } from "next/navigation"

/** Cualquier ruta desconocida cae acá y responde 404 (con el idioma correspondiente). */
export default function Unknown() {
  notFound()
}
