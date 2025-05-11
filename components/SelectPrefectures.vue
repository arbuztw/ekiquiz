<script setup>
import { ref, computed } from "vue";
import { prefectures } from "@/data/prefectures";
import { useConfigStores } from "@/stores/configStores";

const { showPage } = defineProps({
  showPage: Function,
});

const config = useConfigStores();

const allPrefectures = Object.values(prefectures)
  .flat()
  .map((pref) => pref.code);

const isRegionFullySelected = (region) =>
  prefectures[region].every((pref) =>
    config.selectedPrefectures.includes(pref.code)
  );

const toggleRegion = (region) => {
  const prefs = prefectures[region].map((pref) => pref.code);
  if (isRegionFullySelected(region)) {
    config.selectedPrefectures = config.selectedPrefectures.filter(
      (pref) => !prefs.includes(pref)
    );
  } else {
    const newPrefs = prefs.filter(
      (pref) => !config.selectedPrefectures.includes(pref)
    );
    config.selectedPrefectures = [...config.selectedPrefectures, ...newPrefs];
  }
};

const isAllSelected = computed(() =>
  allPrefectures.every((pref) => config.selectedPrefectures.includes(pref))
);

const toggleAll = () => {
  if (isAllSelected.value) {
    config.selectedPrefectures = [];
  } else {
    config.selectedPrefectures = [...allPrefectures];
  }
};

const numLines = ref(1);
const validSelection = computed(() => config.selectedPrefectures.length > 0);

const startPlay = () => {
  window.scrollTo({ top: 0, left: 0 });
  showPage("Options");
};
</script>
<template>
  <div>
    <h1 class="text-xl font-bold text-center text-violet-600">選擇地區</h1>
    <div class="mb-2">
      <label class="text-xl font-semibold space-x-1">
        <input
          type="checkbox"
          :checked="isAllSelected"
          @change="toggleAll"
        /><span>全国</span>
      </label>
    </div>
    <div v-for="(prefs, region) in prefectures" :key="region" class="mb-4">
      <div class="flex justify-between items-center mb-2">
        <label class="text-xl font-semibold space-x-1">
          <input
            type="checkbox"
            :checked="isRegionFullySelected(region)"
            @change="toggleRegion(region)"
          /><span>{{ region }}</span>
        </label>
      </div>

      <div class="flex flex-wrap gap-2">
        <label v-for="pref in prefs" :key="pref.code" class="space-x-1">
          <input
            type="checkbox"
            :value="pref.code"
            v-model="config.selectedPrefectures"
            class="accent-blue-500"
          />
          <span>{{ pref.name }}</span>
        </label>
      </div>
    </div>
  </div>
  <div class="text-center pb-20">
    <button
      @click="startPlay"
      :disabled="!validSelection"
      class="text-white px-3 py-3 rounded-md"
      :class="[validSelection ? 'bg-blue-500' : 'bg-gray-300']"
    >
      確定
    </button>
  </div>
</template>
