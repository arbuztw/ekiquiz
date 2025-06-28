<script setup>
import SelectPrefectures from "@/components/SelectPrefectures";
import Play from "@/components/Play";
import Options from "@/components/Options";
import Landing from "@/components/Landing";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const { t } = useI18n();

const config = useRuntimeConfig();

useHead({
  link: {
    rel: "icon",
    type: "image/png",
    href: "./favicon.png",
  },
  script: [
    config.public.disableAnalytics
      ? {}
      : {
          defer: true,
          src: "https://static.cloudflareinsights.com/beacon.min.js",
          "data-cf-beacon": '{"token": "5e2082703e974ba59581cb3fa70b5b23"}',
          body: true,
        },
  ],
});

if (config.app.cdnURL != "") {
  useSeoMeta({
    title: t("title"),
    ogTitle: t("title"),
    description: t("metadata.description"),
    ogDescription: t("metadata.description"),
    ogImage: new URL("favicon.png", config.app.cdnURL).toString(),
    ogUrl: config.app.cdnURL,
  });
}

class NavController {
  constructor() {
    this.currentPage = shallowRef(Landing);
  }

  showSelectPrefectures() {
    this.currentPage.value = SelectPrefectures;
  }

  showOptions() {
    this.currentPage.value = Options;
  }

  startPlay() {
    this.currentPage.value = Play;
  }
}

const navController = new NavController();

provide("navController", navController);
</script>
<template>
  <div class="flex flex-col h-full">
    <div
      class="flex justify-between items-center px-4 py-3 bg-emerald-600 text-white"
    >
      <h1 class="text-xl font-bold">
        <a href="./">{{ $t("title") }}</a>
      </h1>
      <LanguageSwitcher />
    </div>
    <div class="flex flex-col px-6 pb-14 items-center flex-1">
      <component :is="navController.currentPage.value" />
    </div>
  </div>
</template>