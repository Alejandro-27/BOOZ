import type { UploadApiResponse } from "cloudinary";
import { cloudinary } from "../../config/cloudinary";
import { UploadError } from "./upload.errors";
import type { UploadResponse } from "./upload.types";

/** Lógica de subida a Cloudinary. No conoce HTTP. */
export class UploadService {
  async subir(buffer: Buffer): Promise<UploadResponse> {
    try {
      const resultado = await new Promise<UploadApiResponse>((resolver, rechazador) => {
        const flujo = cloudinary.uploader.upload_stream(
          { folder: "zapateria", resource_type: "image" },
          (error, resultadoSubida) => {
            if (error || !resultadoSubida) {
              rechazador(error ?? new Error("Cloudinary no devolvió un resultado"));
              return;
            }
            resolver(resultadoSubida);
          },
        );

        flujo.end(buffer);
      });

      return { url: resultado.secure_url, public_id: resultado.public_id };
    } catch {
      throw new UploadError();
    }
  }
}
