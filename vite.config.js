import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

function swVersionPlugin() {
  return {
    name: "sw-version",
    writeBundle() {
      const swPath = path.resolve("dist/sw.js");
      if (!fs.existsSync(swPath)) return;
      const ts = Date.now();
      let sw = fs.readFileSync(swPath, "utf-8");
      sw = sw.replace(/ConvertLab-v[\w-]+/, `ConvertLab-v${ts}`);
      fs.writeFileSync(swPath, sw);
    },
  };
}

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/__tests__/setup.js"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      // Covers only testable pure logic — helpers and data constants
      // Feature/component/context files require browser rendering (integration tests)
      include: ["src/helpers/**", "src/constants/**"],
      exclude: [
        "src/__tests__/**",
        "src/constants/app.js", // pure string/number exports — nothing to execute
      ],
    },
  },

  plugins: [react(), swVersionPlugin()],
  base: "/ConvertLab/",
  build: {
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: { react: ["react", "react-dom"] },
      },
    },
  },
});
