<script setup>
import SelectPrefectures from "@/components/SelectPrefectures";
import Play from "@/components/Play";
import Options from "@/components/Options";
import Landing from "@/components/Landing";

useHead({
  link: {
    rel: "icon",
    type: "image/png",
    href: "./favicon.png",
  },
});

useSeoMeta({
  title: "駅QUIZ",
  ogTitle: "駅QUIZ",
  description: "日本鐵道知識大考驗！從經過路線猜車站名稱",
  ogDescription: "日本鐵道知識大考驗！從經過路線猜車站名稱",
  ogImage: "https://arbuztw.github.io/ekiquiz/favicon.png",
  ogUrl: "https://arbuztw.github.io/ekiquiz/",
});

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
      <h1 class="text-xl font-bold"><a href="./">駅QUIZ</a></h1>
    </div>
    <div class="flex flex-col px-6 pb-14 items-center flex-1">
      <component :is="navController.currentPage.value" />
    </div>
  </div>
</template>

<style lang="postcss">
html,
body,
#__nuxt {
  height: 100%;
}
html {
  @apply bg-slate-50 text-slate-700;
}
</style>
