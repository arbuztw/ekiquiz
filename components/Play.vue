<script setup>
import { useConfigStores } from "@/stores/configStores";
import lines from "@/data/lines.json";
import stations from "@/data/stations.json";
import { shuffleArray } from "@/utils/shuffle";

const { showPage } = defineProps({
  showPage: Function,
});

const config = useConfigStores();

const questions = createQuestions(
  config.numQuestions,
  config.selectedPrefectures,
  config.stationLineThreshold,
  stations
);

const qid = ref(0);
const showAnswer = ref(false);
const numCorrect = ref(0);

const nextQuestion = (correct) => {
  if (correct) {
    numCorrect.value += 1;
  }
  showAnswer.value = false;
  qid.value += 1;
};

function createQuestions(
  numQuestions,
  selectedPrefectures,
  stationLineThreshold,
  stations
) {
  const matched_stations = Object.entries(stations)
    .map(([_, station]) => station)
    .filter(
      (station) =>
        selectedPrefectures.includes(station.prefecture) &&
        station.lines.length >= stationLineThreshold
    );
  const questions = Map.groupBy(matched_stations, (station) =>
    station.lines.join(",")
  )
    .entries()
    .filter(([_, stations]) => stations.length == 1)
    .map(([line_str, stations]) => {
      return {
        question: line_str.split(",").map((line) => lines[line].name),
        answer: stations[0].name,
      };
    })
    .toArray();
  shuffleArray(questions);
  return questions.slice(0, numQuestions);
}
</script>

<template>
  <div
    v-if="qid < questions.length"
    class="flex-col text-center h-screen overflow-auto p-6"
  >
    <div class="min-h-[20em] flex flex-col justify-center items-center">
      <div class="flex" v-for="line in questions[qid].question" :key="line">
        {{ line }}
      </div>
    </div>
    <div class="my-2">
      <button
        v-if="!showAnswer"
        @click="showAnswer = true"
        class="bg-blue-500 text-white px-3 py-3 mx-4 rounded-md"
      >
        看答案
      </button>
      <div v-else>
        <button
          @click="nextQuestion(true)"
          class="bg-green-500 text-white px-3 py-3 mx-4 rounded-md"
        >
          答對
        </button>
        <button
          @click="nextQuestion(false)"
          class="bg-red-500 text-white px-3 py-3 mx-4 rounded-md"
        >
          答錯
        </button>
      </div>
    </div>
    <div class="font-bold py-2" v-show="showAnswer">
      {{ questions[qid].answer }}
    </div>
  </div>
  <div v-else class="flex flex-col h-full justify-center">
    <div class="min-h-[50%] text-center">
      <div class="text-lg">恭喜回答完所有問題</div>
      <div class="py-6">
        <div class="text-xl">分數</div>
        <div class="text-xl font-bold">
          {{ numCorrect }} / {{ questions.length }}
        </div>
      </div>
      <div class="text-center">
        <button
          @click="showPage('SelectPrefectures')"
          class="bg-blue-500 text-white px-3 py-3 rounded-md"
        >
          重來
        </button>
      </div>
    </div>
  </div>
</template>
