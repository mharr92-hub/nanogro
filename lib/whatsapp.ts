/**
 * WhatsApp es el canal real de venta agricola. El mensaje nunca sale vacio: siempre
 * viaja pre-rellenado con el contexto de lo que el usuario esta viendo, para que el
 * equipo tecnico no empiece la conversacion preguntando "de que caso me hablas".
 *
 * Solo usa NEXT_PUBLIC_WHATSAPP_NUMBER porque tambien se construye en el cliente.
 * El equivalente de servidor vive en lib/actions.ts y admite ademas la variable privada.
 */
export function buildWhatsAppUrl(message: string) {
  const phone = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/\D/g, "");
  const text = encodeURIComponent(message);
  return phone ? `https://wa.me/${phone}?text=${text}` : `https://wa.me/?text=${text}`;
}
