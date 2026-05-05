import { fileURLToPath, URL } from 'node:url'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'esnext',
  },
  server: {
    proxy: {
      '/dev-api': {
        target: 'http://154.201.77.135:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/dev-api/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log(`➡ 代理请求: ${req.method} ${req.url}`)
            console.log(`🧾 真实发送目标: ${proxyReq.getHeader('host')}`)
            console.log(`🔗 Origin: ${proxyReq.getHeader('origin')}`)
          })
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log(`✅ 后端响应: ${req.method} ${req.url} → ${proxyRes.statusCode}`)
          })
          proxy.on('error', (err, req, res) => {
            console.error(`❌ 代理错误: ${req.method} ${req.url}`, err)
          })
        },
      },
    },
  },
})
