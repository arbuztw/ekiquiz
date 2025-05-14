<script setup>
import { useConfigStores } from "@/stores/configStores";
import lines from "@/data/lines.json";
import stations from "@/data/stations.json";
import { shuffleArray } from "@/utils/shuffle";

const navController = inject("navController");

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
const guessStation = ref("");
const answered = ref(false);
const answerCorrect = ref(false);

const checkAnswer = () => {
  answerCorrect.value = questions[qid.value].answer.includes(
    guessStation.value
  );
  answered.value = true;
};

const nextQuestion = (correct) => {
  if (correct) {
    numCorrect.value += 1;
  }
  showAnswer.value = false;
  guessStation.value = "";
  answered.value = false;
  answerCorrect.value = false;
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
        answer: stations[0].names,
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
    <div v-if="config.isAnswerMode" class="my-4">
      <input
        v-if="!answered"
        type="text"
        placeholder="車站名稱"
        v-model="guessStation"
        class="p-1 accent-emerald-500"
      />
      <div
        v-else
        class="py-1"
        :class="[answerCorrect ? 'text-green-500' : 'text-red-500']"
      >
        <span>{{ answerCorrect ? "\u2713" : "\u2718" }}</span
        >&nbsp;{{ guessStation }}
      </div>
      <div class="my-4">
        <button
          v-if="!answered"
          @click="checkAnswer"
          class="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-4 py-3 mx-4 rounded-md"
        >
          送出
        </button>
        <button
          v-else
          @click="nextQuestion(answerCorrect)"
          class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-md"
        >
          下一題
        </button>
      </div>
      <div v-if="answered && !answerCorrect" class="text-lg font-bold py-2">
        正確答案：&nbsp;{{ questions[qid].answer.join(" / ") }}
      </div>
    </div>
    <div v-else class="my-4">
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
      {{ questions[qid].answer.join(" / ") }}
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
          @click="navController.showSelectPrefectures"
          class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-md"
        >
          再玩一次
        </button>
      </div>
    </div>
  </div>
</template>
