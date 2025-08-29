import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carregar variáveis de ambiente
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        components: path.resolve(__dirname, "./src/components"),
        utils: path.resolve(__dirname, "./src/utils"),
        types: path.resolve(__dirname, "./src/types"),
        contexts: path.resolve(__dirname, "./src/contexts"),
        services: path.resolve(__dirname, "./src/services"),
        hooks: path.resolve(__dirname, "./src/hooks"),
      },
    },
    server: {
      port: 3000,
      open: true,
      headers: {
        // Configurações para resolver problemas de COOP com Google Sign-In
        "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
        "Cross-Origin-Embedder-Policy": "unsafe-none",
        // Headers de segurança adicionais
        "X-Frame-Options": "SAMEORIGIN",
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "no-referrer-when-downgrade",
      },
    },
    build: {
      outDir: "dist",
      sourcemap: true,
    },
    define: {
      global: "globalThis",
      // Expor variáveis de ambiente com prefixo VITE_
      "process.env": Object.keys(env).reduce(
        (prev, key) => {
          if (key.startsWith("VITE_")) {
            prev[key] = env[key];
          }
          return prev;
        },
        {} as Record<string, string>
      ),
    },
  };
});
