import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      dts: "./src/types/auto-imports.d.ts",
      imports:[
        'vue', 
        'vue-router',
        { 'pinia': ['storeToRefs'] },
        { from: 'element-plus', imports: ['FormInstance'], type: true },
        { from: 'element-plus/es/form', imports: ['Rule'], type: true }
      ],
      resolvers: [ElementPlusResolver()],
      dirs: ['./src/api', './src/store', './src/hooks']
    }),
    Components({
      dts: "./src/types/components.d.ts",
      resolvers: [ElementPlusResolver()]
    }),
],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3002",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/images": {
        target: "http://localhost:3002",
        changeOrigin: true
      }
    },
  }
})
