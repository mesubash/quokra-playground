import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"
import { quokraApi } from "./dev/quokra-api"

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // All variables, not just VITE_*: the secret key is only read here, on the server side.
  const env = loadEnv(mode, process.cwd(), "")
  return {
    plugins: [react(), tailwindcss(), quokraApi(env)],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "./src"),
      },
    },
    server: { port: 5173, strictPort: true },
    // Only the login page uses tabs; listing it here keeps Vite from re-bundling deps on the first visit.
    optimizeDeps: { include: ["@base-ui/react/tabs"] },
  }
})
