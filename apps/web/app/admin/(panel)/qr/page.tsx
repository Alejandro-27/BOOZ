"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Download } from "lucide-react";
import { Alerta, Campo, claseInput } from "@/components/admin/Campo";

const URL_POR_DEFECTO = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function QrPage() {
  const [url, setUrl] = useState(URL_POR_DEFECTO);
  const [imagen, setImagen] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Se regenera en cada cambio; el QR es una imagen local y no cuesta red
  useEffect(() => {
    let vigente = true;
    const destino = url.trim() || URL_POR_DEFECTO;

    QRCode.toDataURL(destino, {
      width: 640,
      margin: 2,
      errorCorrectionLevel: "M",
      color: { dark: "#1a1a1a", light: "#ffffff" },
    })
      .then((dataUrl) => {
        if (!vigente) return;
        setImagen(dataUrl);
        setError(null);
      })
      .catch(() => {
        if (vigente) setError("No se pudo generar el QR. Revisa la dirección.");
      });

    return () => {
      vigente = false;
    };
  }, [url]);

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-cuero">Difusión</p>
        <h1 className="mt-2 font-display text-3xl">Código QR</h1>
        <p className="mt-2 max-w-xl text-sm text-carbon/60">
          Imprímelo en el escaparate, tarjetas o etiquetas para que tus clientes abran la
          tienda con la cámara del teléfono.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:items-start">
        <section className="space-y-4">
          <Campo
            etiqueta="Dirección del QR"
            htmlFor="url"
            ayuda="Por defecto es la URL pública del sitio."
          >
            <input
              id="url"
              type="url"
              value={url}
              onChange={(evento) => setUrl(evento.target.value)}
              placeholder={URL_POR_DEFECTO}
              className={claseInput}
            />
          </Campo>

          {error && <Alerta>{error}</Alerta>}

          <div className="border border-carbon/10 bg-white p-4 text-sm text-carbon/60">
            <p className="font-medium text-carbon">Consejo de impresión</p>
            <p className="mt-1">
              Usa al menos 3 cm de lado y deja un margen blanco alrededor. Prueba el QR
              impreso con dos teléfonos antes de mandarlo a producción.
            </p>
          </div>
        </section>

        <section
          aria-label="Vista previa del código QR"
          className="border border-carbon/10 bg-white p-6 text-center"
        >
          {imagen ? (
            <img
              src={imagen}
              alt="Código QR con la dirección de la tienda"
              className="mx-auto aspect-square w-full max-w-64"
            />
          ) : (
            <div className="mx-auto flex aspect-square w-full max-w-64 items-center justify-center bg-carbon/5 text-xs text-carbon/40">
              Generando…
            </div>
          )}

          <a
            href={imagen ?? "#"}
            download="qr-zapateria.png"
            aria-disabled={!imagen}
            className="mt-6 flex items-center justify-center gap-2 bg-carbon px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-hueso transition-colors hover:bg-carbon-suave aria-disabled:pointer-events-none aria-disabled:opacity-50"
          >
            <Download className="size-4" aria-hidden />
            Descargar PNG
          </a>
        </section>
      </div>
    </div>
  );
}
