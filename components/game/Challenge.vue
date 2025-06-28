<script setup>
import { useGameInput } from "@/composables/useGameInput";

const props = defineProps(["question"]);
const emit = defineEmits(["nextQuestion"]);

const { userAnswer, answered, answerCorrect, checkAnswer, nextQuestion } =
  useGameInput(props, emit);
</script>

<template>
  <div class="my-4">
    <input
      v-if="!answered"
      type="text"
      :placeholder="$t('play.stationName')"
      v-model="userAnswer"
      class="p-1 accent-emerald-500"
    />
    <div
      v-else
      class="py-1"
      :class="[answerCorrect ? 'text-green-500' : 'text-red-500']"
    >
      <span>{{ answerCorrect ? "&#x2713;" : "&#x2718;" }}</span
      >&nbsp;{{ userAnswer }}
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
      {{ $t("play.correctAnswer") }}：&nbsp;{{ question.answer.join(" / ") }}
    </div>
  </div>
</template>
