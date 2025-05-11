<script setup>
import SelectPrefectures from "@/components/SelectPrefectures";
import Play from "@/components/Play";
import Options from "@/components/Options";

useHead({
  title: "駅QUIZ",
});

const currentPage = shallowRef(SelectPrefectures);

const showPage = (page) => {
  switch (page) {
    case "SelectPrefectures":
      currentPage.value = SelectPrefectures;
      break;
    case "Play":
      currentPage.value = Play;
      break;
    case "Options":
      currentPage.value = Options;
      break;
    default:
      currentPage.value = SelectPrefectures;
  }
};
</script>
<template>
  <div
    class="flex justify-between items-center px-4 py-3 bg-emerald-600 text-white"
  >
    <h1 class="text-xl font-bold">駅QUIZ</h1>
  </div>
  <div class="flex flex-col p-6 items-center h-full">
    <component :is="currentPage" :showPage="showPage" />
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
