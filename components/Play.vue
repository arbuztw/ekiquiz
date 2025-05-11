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
  <div v-if="qid < questions.length" class="flex-col text-center pt-6">
    <div
      class="min-h-[22rem] min-w-[22rem] flex flex-col justify-center items-center mb-6 p-4 bg-white rounded-lg shadow-sm"
    >
      <div
        class="flex text-slate-800"
        v-for="line in questions[qid].question"
        :key="line"
      >
        {{ line }}
      </div>
    </div>
    <div class="my-4">
      <button
        v-if="!showAnswer"
        @click="showAnswer = true"
        class="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-4 py-3 mx-4 rounded-md"
      >
        看答案
      </button>
      <div v-else>
        <button
          @click="nextQuestion(true)"
          class="bg-green-500 hover:bg-green-600 text-white px-4 py-3 mx-4 rounded-md"
        >
          答對
        </button>
        <button
          @click="nextQuestion(false)"
          class="bg-red-500 hover:bg-red-600 text-white px-4 py-3 mx-4 rounded-md"
        >
          答錯
        </button>
      </div>
    </div>
    <div class="text-lg font-bold py-2" v-show="showAnswer">
      {{ questions[qid].answer }}
    </div>
  </div>
  <div v-else class="flex flex-col h-full justify-center">
    <div class="min-h-[50%] text-center">
      <div class="text-emerald-800 font-semibold text-xl">挑戰成功</div>
      <div class="py-8">
        <div class="text-lg text-slate-600">分數</div>
        <div class="text-emerald-600 text-3xl font-bold">
          {{ String(numCorrect).padStart(2, "&nbsp;") }} /
          {{ String(questions.length).padStart(2, "&nbsp;") }}
        </div>
      </div>
      <div class="text-center my-4">
        <button
          @click="showPage('SelectPrefectures')"
          class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-md"
        >
          再玩一次
        </button>
      </div>
    </div>
  </div>
</template>
