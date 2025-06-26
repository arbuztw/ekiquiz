<script setup>
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
    <select
      v-model="locale"
      @change="switchLocale($event.target.value)"
      class="bg-emerald-600 text-white cursor-pointer"
    >
      <option
        v-for="lang in availableLocales"
        :key="lang.code"
        :value="lang.code"
      >
        {{ lang.name }}
      </option>
    </select>
  </div>
</template>
