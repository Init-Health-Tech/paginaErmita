import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cada ruta se compila al abrirla. Conservarlas evita recompilar
  // Alquiler, Retiros y Admin durante la misma sesión de desarrollo.
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000,
    pagesBufferLength: 25,
  },
  // El código está en el disco de Windows y el servidor corre en WSL.
  // El sondeo hace que un guardado desde el editor recargue la página.
  watchOptions: {
    pollIntervalMs: 1000,
  },
};

export default nextConfig;
