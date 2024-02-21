// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/style/main.css'],

  runtimeConfig: {
    public: {
      keyWeather: process.env.NUXT_PUBLIC_WEATHER_KEY
    }
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  modules: [
    "@nuxtjs/tailwindcss", 
    '@pinia/nuxt',
  ],

  app: {
    baseURL: "/sono-nuxt/",
  },
})
