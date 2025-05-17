<script setup>
import { useConfigStores } from "@/stores/configStores";
import stations from "@/data/stations.json";

const navController = inject("navController");

const config = useConfigStores();

const maxNumLines = Math.max(
  ...Object.values(stations)
    .filter((station) =>
      config.selectedPrefectures.includes(station.prefecture)
    )
    .map((station) => station.lines.length)
);
config.stationLineThreshold = Math.min(
  config.stationLineThreshold,
  maxNumLines
);
</script>
<template>
  <h1 class="text-xl font-bold text-emerald-800 text-center mt-3">
    {{ $t("options.title") }}
  </h1>
  <div class="grid grid-cols-[max-content_1fr] gap-4 w-max my-6">
    <label class="option-name">{{ $t("options.numLines.title") }}:</label>
    <i18n-t keypath="options.numLines.content" tag="div">
      <template v-slot:numLines>
        &nbsp;<select v-model="config.stationLineThreshold" class="p-1">
          <option v-for="numLines in maxNumLines" :value="numLines">
            {{ numLines }}
          </option></select
        >&nbsp;
      </template>
    </i18n-t>
    <label class="option-name">{{ $t("options.numQuestions.title") }}：</label>
    <div>
      <select v-model="config.numQuestions" class="p-1">
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="25">25</option>
      </select>
    </div>
    <label class="option-name">{{ $t("options.mode") }}：</label>
    <div>
      <label class="pe-2">
        <input
          type="radio"
          :value="false"
          v-model="config.isAnswerMode"
          class="accent-emerald-500"
        />
        {{ $t("options.practiceMode") }}
      </label>
      <label>
        <input
          type="radio"
          :value="true"
          v-model="config.isAnswerMode"
          class="accent-emerald-500"
        />
        {{ $t("options.challengeMode") }}
      </label>
    </div>
  </div>
  <div class="text-center p-2">
    <button
      @click="navController.startPlay"
      class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-md"
    >
      {{ $t("options.buttons.start") }}
    </button>
  </div>
</template>

<style scoped lang="postcss">
label.option-name {
  @apply font-semibold text-slate-800 content-center;
}
</style>
