import { ConfigForm } from "@/components/admin/ConfigForm";

export default function ConfiguracionPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-cuero">Tienda</p>
        <h1 className="mt-2 font-display text-3xl">Configuración</h1>
        <p className="mt-2 max-w-xl text-sm text-carbon/60">
          Estos datos se muestran en el sitio público y en los mensajes de WhatsApp.
        </p>
      </header>

      <ConfigForm />
    </div>
  );
}
