import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import Components from "unplugin-vue-components/vite";
import IconsResolver from "unplugin-icons/resolver";

import Icons from "unplugin-icons/vite";

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    Icons({
      autoInstall: true,
      compiler: "vue3",
    }),
    Components({
      dirs: ["src"],
      extensions: ["vue"],
      deep: true,
      resolvers: [
        IconsResolver({
          prefix: "icon",
          enabledCollections: ["mdi"],
        }),
      ],
      dts: true,
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
