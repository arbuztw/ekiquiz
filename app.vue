<script setup>
import SelectPrefectures from "@/components/SelectPrefectures";
import Play from "@/components/Play";
import Options from "@/components/Options";
import Landing from "@/components/Landing";

const config = useRuntimeConfig();

useHead({
  link: {
    rel: "icon",
    type: "image/png",
    href: "./favicon.png",
  },
  script: [
    {
      defer: true,
      src: "https://static.cloudflareinsights.com/beacon.min.js",
      "data-cf-beacon": '{"token": "5e2082703e974ba59581cb3fa70b5b23"}',
      body: true,
    },
  ],
});

if (config.app.cdnURL != "") {
  useSeoMeta({
    title: "駅QUIZ",
    ogTitle: "駅QUIZ",
    description: "日本鐵道知識大考驗！從經過路線猜車站名稱",
    ogDescription: "日本鐵道知識大考驗！從經過路線猜車站名稱",
    ogImage: new URL("favicon.png", config.app.cdnURL).toString(),
    ogUrl: new URL(config.app.baseURL, config.app.cdnURL).toString(),
  });
}

class NavController {
  constructor() {
    this.currentPage = shallowRef(Landing);
  }

  showSelectPrefectures() {
    this.currentPage.useRuntimeConfig().public.cdnUrlvalue = SelectPrefectures;
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
      <h1 class="text-xl font-bold"><a href="./">駅QUIZ</a></h1>
    </div>
    <div class="flex flex-col px-6 pb-14 items-center flex-1">
      <component :is="navController.currentPage.value" />
    </div>
  </div>
</template>
