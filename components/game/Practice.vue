<script setup>
const props = defineProps(["question", "showAnswer"]);
const emit = defineEmits(["update:showAnswer", "nextQuestion"]);
</script>
<template>
  <div class="my-4">
    <button
      v-if="!showAnswer"
      @click="$emit('update:showAnswer', true)"
      class="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-4 py-3 mx-4 rounded-md"
    >
      {{ $t("play.buttons.showAnswer") }}
    </button>
    <div v-else>
      <button
        @click="$emit('nextQuestion', true)"
        class="bg-green-500 hover:bg-green-600 text-white px-4 py-3 mx-4 rounded-md"
      >
        {{ $t("play.buttons.correctAnswer") }}
      </button>
      <button
        @click="$emit('nextQuestion', false)"
        class="bg-red-500 hover:bg-red-600 text-white px-4 py-3 mx-4 rounded-md"
      >
        {{ $t("play.buttons.wrongAnswer") }}
      </button>
    </div>
  </div>
</template>