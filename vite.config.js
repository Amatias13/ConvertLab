import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

// Plugin: inject build timestamp into sw.js so cache busts on every deploy
function swVersionPlugin() {
  return {
    name: "sw-version",
    writeBundle() {
      const swPath = path.resolve("dist/sw.js");
      if (!fs.existsSync(swPath)) return;
      const ts = Date.now();
      let sw = fs.readFileSync(swPath, "utf-8");
      sw = sw.replace(/ConvertLab-v\d+/, `ConvertLab-v${ts}`);
      fs.writeFileSync(swPath, sw);
    },
  };
}

export default defineConfig({
  plugins: [react(), swVersionPlugin()],
  base: "/ConvertLab/",
  build: {
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
        },
      },
    },
  },
});
