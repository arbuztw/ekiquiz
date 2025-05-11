import { defineStore } from "pinia";
import { prefectures } from "~/data/prefectures";

export const useConfigStores = defineStore("config", {
  state: () => ({
    selectedPrefectures: [] as object[],
    stationLineThreshold: 4 as number,
    numQuestions: 10 as number,
  }),
});
