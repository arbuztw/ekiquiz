// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  css: ["@/assets/app.css"],
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt", "@nuxtjs/i18n"],
  runtimeConfig: {
    public: {
      disableAnalytics: process.env.DISABLE_ANALYTICS === "true",
    },
  },
  i18n: {
    defaultLocale: "ja",
    locales: [
      { code: "zh-TW", name: "繁體中文", file: "zh-TW.json" },
      { code: "ja", name: "日本語", file: "ja.json" },
    ],
  },
});
