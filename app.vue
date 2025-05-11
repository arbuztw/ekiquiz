<script setup>
import SelectPrefectures from "@/components/SelectPrefectures";
import Play from "@/components/Play";
import Options from "@/components/Options";

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
