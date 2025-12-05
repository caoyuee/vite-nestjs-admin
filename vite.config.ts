import { defineConfig,loadEnv,type ConfigEnv,type UserConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import vueJsx from "@vitejs/plugin-vue-jsx";
import {wrapperEnv} from "./build/getEnv";
import {createProxy} from "./build/proxy";
// https://vite.dev/config/

  

export default defineConfig(({ mode }: ConfigEnv): UserConfig =>{
  const root = process.cwd();
  const env = loadEnv(mode, root);
  const viteEnv = wrapperEnv(env);
  return {
  plugins: [
    vue(),
    vueJsx(),
    createSvgIconsPlugin({
      iconDirs: [resolve(process.cwd(), "src/assets/icons")],
      symbolId: "icon-[dir]-[name]",
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js",
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/var.scss";`,
      },
    },
  },
  server: {
      host: "0.0.0.0",
      port: viteEnv.VITE_PORT,
      open: viteEnv.VITE_OPEN,
      cors: true,
      // Load proxy configuration from .env.development
      proxy: createProxy(viteEnv.VITE_PROXY)
  },

}});
