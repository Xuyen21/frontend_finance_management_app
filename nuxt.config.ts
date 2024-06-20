// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    "@nuxt/ui", 
    "@nuxtjs/supabase",
    "@nuxtjs/tailwindcss",
  ],
  components: {
    dirs: [
      '~/components',
      '~/components/settings'
    ]
  },
  supabase: {
    redirect: true,
    redirectOptions: {
        login: '/login',
        callback: '/confirmation',
        include: undefined,
        exclude: [],
        cookieRedirect: false,
      }
  },
  runtimeConfig: {
    public: {
      SUPABASE_URL: process.env.SUPABASE_URL,
    }
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  css: [
    '~/assets/css/main.css',
  ],
  tailwindcss: {
    configPath: 'tailwind.config.js',
    viewer: true,
  },
  vite: {
    plugins: [],
    server: {
      watch: {
        usePolling: true,
      },
      hmr: {
        protocol: 'ws',
        host: 'localhost',
        port: 3000,
        clientPort: 3000,
      },
    },
  },

})
