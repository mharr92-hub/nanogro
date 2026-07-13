import { ImageResponse } from "next/og";

/**
 * La imagen que ve tu contacto cuando le pasas el enlace por WhatsApp.
 *
 * WhatsApp, Facebook y Telegram no leen SVG en la previsualizacion: piden un mapa de bits.
 * Next la genera aqui como PNG en tiempo de compilacion a partir de este JSX, asi que la
 * marca sale igual en la web, en la pestaña del navegador y en el chat, sin mantener tres
 * archivos distintos.
 */

export const alt = "Nano-Gro — Inteligencia de Casos";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px",
          background: "#ffffff",
          backgroundImage:
            "radial-gradient(900px 400px at 0% 0%, rgba(20,82,58,0.10), transparent), radial-gradient(700px 340px at 100% 0%, rgba(10,90,115,0.10), transparent)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
          <svg width="132" height="132" viewBox="0 0 64 64">
            <defs>
              <radialGradient id="d" cx="50%" cy="58%" r="62%">
                <stop offset="0%" stopColor="#e9e14a" />
                <stop offset="42%" stopColor="#a8c93a" />
                <stop offset="72%" stopColor="#3f9440" />
                <stop offset="100%" stopColor="#1c5f2c" />
              </radialGradient>
            </defs>
            <circle cx="32" cy="32" r="29" fill="none" stroke="#2b2fa8" strokeWidth="4" />
            <circle cx="32" cy="32" r="25" fill="url(#d)" />
            <ellipse cx="32" cy="34" rx="20" ry="14" fill="none" stroke="#1c5f2c" strokeOpacity="0.45" />
            <ellipse cx="32" cy="35" rx="14" ry="9" fill="none" stroke="#1c5f2c" strokeOpacity="0.45" />
            <ellipse cx="32" cy="36" rx="8" ry="5" fill="none" stroke="#1c5f2c" strokeOpacity="0.45" />
          </svg>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 72, fontWeight: 700, color: "#2b2fa8", letterSpacing: "-2px" }}>Nano-Gro</div>
            <div style={{ fontSize: 26, color: "#575c53", letterSpacing: "3px" }}>NANOTECNOLOGÍA AGRÍCOLA</div>
          </div>
        </div>

        <div style={{ fontSize: 46, color: "#171a16", marginTop: "48px", lineHeight: 1.25 }}>
          Encuentra resultados de Nano-Gro por cultivo, país y problema
        </div>

        <div style={{ fontSize: 28, color: "#575c53", marginTop: "20px" }}>
          Evidencia de campo documentada: qué se aplicó, qué se midió y con qué nivel de prueba.
        </div>
      </div>
    ),
    size
  );
}
