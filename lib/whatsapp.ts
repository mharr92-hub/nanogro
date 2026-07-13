/**
 * WhatsApp es el canal real de venta agricola. El mensaje nunca sale vacio: siempre viaja
 * pre-rellenado con el contexto de lo que el usuario esta viendo, para que el equipo
 * tecnico no empiece la conversacion preguntando "de que caso me hablas".
 *
 * El numero vive AQUI, en el codigo, no en una variable de entorno.
 *
 * Un telefono comercial que se va a publicar en la web para que cualquiera escriba no es un
 * secreto: esconderlo en la configuracion solo consigue que, si alguien se olvida de
 * ponerlo al desplegar, el sitio salga sin canal de venta. La variable de entorno sigue
 * funcionando y tiene prioridad, por si algun dia hay que cambiar el numero sin tocar el
 * codigo o llevar distintos numeros por pais.
 *
 * Formato: solo digitos, con codigo de pais y sin el +.
 */
export const DEFAULT_WHATSAPP_NUMBER = "50766781266"; // Panama (+507) 6678 1266

function phoneDigits() {
  const configured = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || DEFAULT_WHATSAPP_NUMBER;
  return configured.replace(/\D/g, "");
}

/** ¿Hay un numero de WhatsApp utilizable? */
export function hasWhatsAppNumber() {
  return phoneDigits().length > 0;
}

/**
 * Devuelve el enlace, o `null` si no hubiera numero.
 *
 * Nunca un `wa.me/?text=...` sin destinatario: ese enlace no escribe a nadie, abre el
 * selector de contactos del propio usuario, y el lead se pierde creyendo que ha contactado.
 */
export function buildWhatsAppUrl(message: string): string | null {
  const phone = phoneDigits();
  if (!phone) return null;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
