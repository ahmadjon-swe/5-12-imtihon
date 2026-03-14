export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4001', 
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        cookieDomainRewrite: 'localhost', // ✅ qo'shing
      },  
      '/uploads': {
        target: 'http://localhost:4001',
        changeOrigin: true,
<<<<<<< HEAD
=======
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/uploads': {
        target: 'http://localhost:4001',
        changeOrigin: true,
>>>>>>> 2f0ce334e2f27ff2e0ef23c2963c889b0c33b4e5
      }
    }
  }
})