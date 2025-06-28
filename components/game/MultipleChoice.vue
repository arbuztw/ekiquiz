<script setup>
import { useGameInput } from "@/composables/useGameInput";

const props = defineProps(["question"]);
const emit = defineEmits(["nextQuestion"]);

const { userAnswer, answered, answerCorrect, checkAnswer, nextQuestion } =
  useGameInput(props, emit);
</script>

<template>
  <div class="my-4">
    <div class="w-max mx-auto">
      <div class="flex flex-col gap-3">
        <button
          v-for="choice in question.choices"
          :key="choice"
          @click="
            userAnswer = choice;
            checkAnswer();
          "
          :disabled="answered"
          class="bg-blue-500 text-white font-semibold px-4 py-3 rounded-md w-full"
          :class="{
            'hover:bg-blue-600': !answered,
            'bg-green-500': answered && question.answer.includes(choice),
            'bg-red-500':
              answered &&
              !question.answer.includes(choice) &&
              userAnswer === choice,
            'opacity-50 cursor-not-allowed':
              answered &&
              !question.answer.includes(choice) &&
              userAnswer !== choice,
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
  </div>
</template>
