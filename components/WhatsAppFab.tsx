import type { Messages } from "@/lib/i18n-shared";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

/**
 * Boton flotante de WhatsApp, contextual: el `message` lo arma cada pagina con lo que
 * el usuario esta viendo (el caso, el cultivo, el calculo de ROI). Nunca es generico
 * si hay contexto disponible.
 *
 * En movil se aparta del CTA principal fijo (`bottom-20`) para no taparlo.
 */
export function WhatsAppFab({ message, messages }: { message: string; messages: Messages }) {
  return (
    <a
      className="btn btn-whatsapp fixed bottom-20 right-4 z-40 shadow-soft md:bottom-6"
      href={buildWhatsAppUrl(message)}
      rel="noopener noreferrer"
      target="_blank"
      aria-label={messages.whatsapp.float}
    >
      <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.3-1.39a9.86 9.86 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.44 9.9-9.9 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.8 14.06c-.24.68-1.42 1.31-1.96 1.36-.5.05-1.14.07-1.83-.11-.42-.13-.97-.31-1.67-.61-2.94-1.27-4.86-4.23-5-4.43-.15-.2-1.2-1.59-1.2-3.04 0-1.44.76-2.15 1.03-2.45.27-.29.59-.37.79-.37h.56c.18 0 .43-.07.67.51.24.59.83 2.03.9 2.18.07.15.12.32.02.51-.1.2-.15.32-.3.49l-.44.51c-.15.15-.3.31-.13.61.17.29.76 1.25 1.62 2.03 1.11 1 2.05 1.3 2.34 1.45.29.15.46.13.63-.08.17-.2.73-.85.92-1.14.2-.29.39-.24.66-.15.27.1 1.7.8 1.99.95.29.15.49.22.56.34.07.12.07.71-.17 1.39Z" />
      </svg>
      <span className="hidden sm:inline">{messages.whatsapp.float}</span>
    </a>
  );
}
