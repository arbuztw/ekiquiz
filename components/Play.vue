<script setup>
import { useConfigStores, GameMode } from "@/stores/configStores";
import lines from "@/data/lines.json";
import stations from "@/data/stations.json";
import { shuffleArray } from "@/utils/shuffle";

const navController = inject("navController");

const config = useConfigStores();

const questions = createQuestions(
  config.numQuestions,
  config.selectedPrefectures,
  config.stationLineThreshold,
  stations,
  config.gameMode
);

const qid = ref(0);
const showAnswer = ref(false);
const numCorrect = ref(0);
const guessStation = ref("");
const selectedChoice = ref("");
const answered = ref(false);
const answerCorrect = ref(false);

const checkAnswer = () => {
  if (config.gameMode === GameMode.MultipleChoice) {
    answerCorrect.value = questions[qid.value].answer.includes(
      selectedChoice.value
    );
  } else {
    answerCorrect.value = questions[qid.value].answer.includes(
      guessStation.value
    );
  }
  answered.value = true;
};

const nextQuestion = (correct) => {
  if (correct) {
    numCorrect.value += 1;
  }
  showAnswer.value = false;
  guessStation.value = "";
  selectedChoice.value = "";
  answered.value = false;
  answerCorrect.value = false;
  qid.value += 1;
};

function createQuestions(
  numQuestions,
  selectedPrefectures,
  stationLineThreshold,
  stations,
  gameMode
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
      const question = {
        question: line_str.split(",").map((line) => lines[line].name),
        answer: stations[0].names,
      };

      if (gameMode === GameMode.MultipleChoice) {
        const allStationNames = matched_stations.flatMap((s) => s.names);
        const incorrectAnswers = shuffleArray(
          allStationNames.filter((name) => !question.answer.includes(name))
        ).slice(0, 3);
        question.choices = shuffleArray([
          question.answer[0],
          ...incorrectAnswers,
        ]);
      }
      return question;
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
    <div v-if="config.gameMode === GameMode.Challenge" class="my-4">
      <input
        v-if="!answered"
        type="text"
        :placeholder="$t('play.stationName')"
        v-model="guessStation"
        class="p-1 accent-emerald-500"
      />
      <div
        v-else
        class="py-1"
        :class="[answerCorrect ? 'text-green-500' : 'text-red-500']"
      >
        <span>{{ answerCorrect ? "&#x2713;" : "&#x2718;" }}</span
        >&nbsp;{{ guessStation }}
      </div>
      <div class="my-4">
        <button
          v-if="!answered"
          @click="checkAnswer"
          class="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-4 py-3 mx-4 rounded-md"
        >
          {{ $t("play.buttons.submit") }}
        </button>
        <button
          v-else
          @click="nextQuestion(answerCorrect)"
          class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-md"
        >
          {{ $t("play.buttons.next") }}
        </button>
      </div>
      <div v-if="answered && !answerCorrect" class="text-lg font-bold py-2">
        {{ $t("play.correctAnswer") }}：&nbsp;{{
          questions[qid].answer.join(" / ")
        }}
      </div>
    </div>
    <div v-else-if="config.gameMode === GameMode.MultipleChoice" class="my-4">
      <div class="w-max mx-auto">
        <div class="flex flex-col gap-4">
          <button
            v-for="choice in questions[qid].choices"
            :key="choice"
            @click="selectedChoice = choice; checkAnswer()"
            :disabled="answered"
            class="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-3 rounded-md w-full"
            :class="{
              'bg-green-500': answered && questions[qid].answer.includes(choice),
              'bg-red-500': answered && !questions[qid].answer.includes(choice) && selectedChoice === choice,
              'opacity-50 cursor-not-allowed': answered && !questions[qid].answer.includes(choice) && selectedChoice !== choice,
            }"
          >
            {{ choice }}
          </button>
        </div>
      </div>
      <div class="my-4">
        <button
          v-if="answered"
          @click="nextQuestion(answerCorrect)"
          class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-md"
        >
          {{ $t("play.buttons.next") }}
        </button>
      </div>
      <div v-if="answered && !answerCorrect && config.gameMode !== GameMode.MultipleChoice" class="text-lg font-bold py-2">
        {{ $t("play.correctAnswer") }}：&nbsp;{{
          questions[qid].answer.join(" / ")
        }}
      </div>
    </div>
    <div v-else-if="config.gameMode === GameMode.Practice" class="my-4">
      <button
        v-if="!showAnswer"
        @click="showAnswer = true"
        class="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-4 py-3 mx-4 rounded-md"
      >
        {{ $t("play.buttons.showAnswer") }}
      </button>
      <div v-else>
        <button
          @click="nextQuestion(true)"
          class="bg-green-500 hover:bg-green-600 text-white px-4 py-3 mx-4 rounded-md"
        >
          {{ $t("play.buttons.correctAnswer") }}
        </button>
        <button
          @click="nextQuestion(false)"
          class="bg-red-500 hover:bg-red-600 text-white px-4 py-3 mx-4 rounded-md"
        >
          {{ $t("play.buttons.wrongAnswer") }}
        </button>
      </div>
    </div>
    <div class="text-lg font-bold py-2" v-show="showAnswer && config.gameMode !== GameMode.MultipleChoice">
      {{ questions[qid].answer.join(" / ") }}
    </div>
  </div>
  <div v-else class="flex flex-col h-full justify-center">
    <div class="min-h-[50%] text-center">
      <div class="text-emerald-800 font-semibold text-xl">
        {{ $t("result.title") }}
      </div>
      <div class="py-8">
        <div class="text-lg text-slate-600">{{ $t("result.score") }}</div>
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
          {{ $t("result.buttons.replay") }}
        </button>
      </div>
    </div>
  </div>
</template>
