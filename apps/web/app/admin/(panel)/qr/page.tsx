"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Download } from "lucide-react";
import { Alerta, Campo, claseInput } from "@/components/admin/Campo";

const URL_POR_DEFECTO = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function QrPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [url, setUrl] = useState(URL_POR_DEFECTO);
  const [imagen, setImagen] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Genera el QR y, cuando el canvas está listo, superpone el logo al centro.
  useEffect(() => {
    let vigente = true;
    const destino = url.trim() || URL_POR_DEFECTO;

    QRCode.toDataURL(destino, {
      width: 640,
      margin: 2,
      errorCorrectionLevel: "H", // mayor corrección para permitir el logo al centro
      color: { dark: "#1a1a1a", light: "#ffffff" },
    })
      .then((dataUrl) => {
        if (!vigente) return;
        setImagen(dataUrl);
        setError(null);
        void superponerLogo(canvasRef.current, dataUrl);
      })
      .catch(() => {
        if (vigente) setError("No se pudo generar el QR. Revisa la dirección.");
      });

    return () => {
      vigente = false;
    };
  }, [url, canvasRef.current]);

  /**
   * Dibuja el QR en el canvas y superpone el logo de BOOZ al centro.
   * El logo ocupa aproximadamente el 20 % del ancho del QR.
   */
  async function superponerLogo(canvas: HTMLCanvasElement | null, qrDataUrl: string) {
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const qrImg = await cargarImagen(qrDataUrl);
    const logoImg = await cargarImagen("/logo.jpeg").catch(() => null);

    const tamaño = 640;
    canvas.width = tamaño;
    canvas.height = tamaño;

    // Dibuja el QR de fondo
    ctx.drawImage(qrImg, 0, 0, tamaño, tamaño);

    // Superpone el logo al centro si se cargó
    if (logoImg) {
      const logoTamaño = tamaño * 0.2; // 20 % del ancho del QR
      const x = (tamaño - logoTamaño) / 2;
      const y = (tamaño - logoTamaño) / 2;

      // Círculo blanco alrededor del logo para mejorar legibilidad del QR
      const radio = logoTamaño / 2 + 12;
      ctx.beginPath();
      ctx.arc(tamaño / 2, tamaño / 2, radio, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();

      ctx.drawImage(logoImg, x, y, logoTamaño, logoTamaño);
    }
  }

  function cargarImagen(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const ImgCtor = (globalThis as { Image: new () => HTMLImageElement }).Image;
      const img = new ImgCtor();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  const descargarPng = () => {
    if (!canvasRef.current || !imagen) return;
    const enlace = document.createElement("a");
    enlace.download = "booz-catalogo.png";
    enlace.href = canvasRef.current.toDataURL("image/png");
    enlace.click();
  };

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-cuero">Difusión</p>
        <h1 className="mt-2 font-display text-3xl">Código QR</h1>
        <p className="mt-2 max-w-xl text-sm text-carbon/60">
          Escanea para ver el catálogo BOOZ. Imprímelo en el escaparate, tarjetas o
          etiquetas para que tus clientes abran la tienda con la cámara del teléfono.
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
            <canvas
              ref={canvasRef}
              aria-label="Código QR con el logo de BOOZ al centro"
              className="mx-auto aspect-square w-full max-w-64"
            />
          ) : (
            <div className="mx-auto flex aspect-square w-full max-w-64 items-center justify-center bg-carbon/5 text-xs text-carbon/40">
              Generando…
            </div>
          )}

          <button
            onClick={descargarPng}
            disabled={!imagen}
            className="mt-6 flex items-center justify-center gap-2 bg-carbon px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-hueso transition-colors hover:bg-carbon-suave aria-disabled:pointer-events-none aria-disabled:opacity-50"
          >
            <Download className="size-4" aria-hidden />
            Descargar PNG
          </button>
        </section>
      </div>
    </div>
  );
}
