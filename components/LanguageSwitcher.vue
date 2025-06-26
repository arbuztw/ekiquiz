<script setup>
import { LanguageIcon, ChevronDownIcon } from '@heroicons/vue/24/solid'
const { locale, locales, setLocale } = useI18n();

const availableLocales = computed(() => {
  return locales.value;
});

const switchLocale = (lang) => {
  setLocale(lang);
};
</script>

<template>
  <div class="relative">
    <LanguageIcon class="absolute top-1/2 left-2 -translate-y-1/2 w-5 h-5 text-white pointer-events-none" />
    <select
      v-model="locale"
      @change="switchLocale($event.target.value)"
      class="bg-emerald-600 text-white cursor-pointer pl-8 pr-8 appearance-none"
    >
      <option
        v-for="lang in availableLocales"
        :key="lang.code"
        :value="lang.code"
      >
        {{ lang.name }}
      </option>
    </select>
    <ChevronDownIcon class="absolute top-1/2 right-2 -translate-y-1/2 w-5 h-5 text-white pointer-events-none" />
  </div>
</template>
