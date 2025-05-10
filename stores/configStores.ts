import { defineStore } from "pinia";
import { prefectures } from "~/data/prefectures";

const codeToNameMap = new Map(prefectures.map((p) => [p.code, p.name]));

export const useConfigStores = defineStore("config", {
  state: () => ({
    selectedPrefectures: [] as number[],
    stationLineThreshold: 4 as number,
    numQuestions: 10 as number,
  }),
  getters: {
    selectedPrefectureNames(state) {
      return state.selectedPrefectures.map((code) => codeToNameMap.get(code));
    },
  },
});
