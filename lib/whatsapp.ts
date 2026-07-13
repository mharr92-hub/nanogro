/**
 * WhatsApp es el canal real de venta agricola. El mensaje nunca sale vacio: siempre viaja
 * pre-rellenado con el contexto de lo que el usuario esta viendo, para que el equipo
 * tecnico no empiece la conversacion preguntando "de que caso me hablas".
 *
 * REGLA CRITICA: sin numero configurado no se pinta el boton.
 *
 * `wa.me/?text=...` sin telefono no escribe a nadie: abre el selector de contactos del
 * propio usuario. Un boton asi no es un canal de conversion, es una fuga: el agricultor
 * cree que ha contactado y el equipo no recibe nada. Es preferible no ofrecer el canal
 * antes que ofrecer uno que se traga los leads.
 *
 * Solo usa NEXT_PUBLIC_WHATSAPP_NUMBER porque tambien se construye en el cliente. El
 * equivalente de servidor vive en lib/actions.ts y admite ademas la variable privada.
 */

function phoneDigits() {
  return (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/\D/g, "");
}

/** ¿Hay un numero de WhatsApp configurado? Si no, no se renderiza ningun boton. */
export function hasWhatsAppNumber() {
  return phoneDigits().length > 0;
}

/** Devuelve el enlace, o `null` si no hay numero configurado. Nunca un wa.me sin destinatario. */
export function buildWhatsAppUrl(message: string): string | null {
  const phone = phoneDigits();
  if (!phone) return null;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
