<script setup>
import { useConfigStores } from "@/stores/configStores";
import stations from "@/data/stations.json";

const { showPage } = defineProps({
  showPage: Function,
});

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
  <h1 class="text-xl font-bold text-emerald-800 text-center my-3">遊戲設定</h1>
  <div class="grid grid-cols-[max-content_1fr] gap-4 w-max mb-6">
    <label class="font-semibold text-slate-800 content-center"
      >車站路線數:</label
    >
    <div>
      至少&nbsp;<select v-model="config.stationLineThreshold" class="p-1">
        <option v-for="numLine in maxNumLines" :value="numLine">
          {{ numLine }}
        </option></select
      >&nbsp;條路線經過
    </div>

    <label class="font-semibold text-slate-800 content-center">問題數:</label>
    <div>
      <select v-model="config.numQuestions" class="p-1">
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="25">25</option>
      </select>
    </div>
  </div>
  <div class="text-center p-2">
    <button
      @click="showPage('Play')"
      class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-md"
    >
      開始
    </button>
  </div>
</template>
