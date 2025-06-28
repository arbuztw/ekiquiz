<script setup>
import { useConfigStores, GameMode } from "@/stores/configStores";
import stations from "@/data/stations.json";
import Challenge from "@/components/game/Challenge.vue";
import MultipleChoice from "@/components/game/MultipleChoice.vue";
import Practice from "@/components/game/Practice.vue";
import { createQuestions } from "@/utils/question";

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

const nextQuestion = (correct) => {
  if (correct) {
    numCorrect.value += 1;
  }
  showAnswer.value = false;
  qid.value += 1;
};
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
    <Challenge
      v-if="config.gameMode === GameMode.Challenge"
      :question="questions[qid]"
      @nextQuestion="nextQuestion"
    />
    <MultipleChoice
      v-else-if="config.gameMode === GameMode.MultipleChoice"
      :question="questions[qid]"
      @nextQuestion="nextQuestion"
    />
    <Practice
      v-else-if="config.gameMode === GameMode.Practice"
      :question="questions[qid]"
      v-model:showAnswer="showAnswer"
      @nextQuestion="nextQuestion"
    />
    <div
      class="text-lg font-bold py-2"
      v-show="showAnswer && config.gameMode !== GameMode.MultipleChoice"
    >
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