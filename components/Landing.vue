<script setup>
const navController = inject("navController");
</script>
<template>
  <div>
    <div
      class="text-lg font-bold text-emerald-600 my-3 text-center whitespace-pre-line"
    >
      {{ $t("slogan") }}
    </div>
    <h2 class="text-xl font-bold mb-2">{{ $t("flow.title") }}</h2>
    <div class="mb-3">
      <h3 class="text-lg font-semibold text-emerald-800">
        {{ $t("flow.optionFlow.title") }}
      </h3>
      <ol class="list-decimal ps-6 leading-7">
        <li>{{ $t("flow.optionFlow.selectRegions") }}</li>
        <li>{{ $t("flow.optionFlow.minLines") }}</li>
        <li>{{ $t("flow.optionFlow.selectQuestions") }}</li>
        <i18n-t keypath="flow.optionFlow.chooseMode" tag="li">
          <template v-slot:practiceMode>
            <span class="font-bold">{{ $t("options.practiceMode") }}</span>
          </template>
          <template v-slot:challengeMode>
            <span class="font-bold">{{ $t("options.challengeMode") }}</span>
          </template>
        </i18n-t>
      </ol>
    </div>
    <div class="mb-4">
      <h3 class="text-lg font-semibold text-emerald-800">
        {{ $t("flow.gameFlow.title") }}
      </h3>
      {{ $t("flow.gameFlow.description") }}
      <ol class="list-[lower-alpha] ps-6 leading-7">
        <li>
          {{ $t("options.practiceMode") }}
          <ul class="list-disc ps-6">
            <li>
              {{
                $t("flow.gameFlow.practice.showAnswer", {
                  showAnswer: $t("play.buttons.showAnswer"),
                })
              }}
            </li>
            <li>
              {{
                $t("flow.gameFlow.practice.markAnswer", {
                  correctAnswer: $t("play.buttons.correctAnswer"),
                  wrongAnswer: $t("play.buttons.wrongAnswer"),
                })
              }}
            </li>
          </ul>
        </li>
        <li>
          {{ $t("options.challengeMode") }}
          <ul class="list-disc ps-6">
            <li>{{ $t("flow.gameFlow.challenge.inputExact") }}</li>
          </ul>
        </li>
      </ol>
    </div>
    <div class="text-center py-4">
      <button
        @click="navController.showSelectPrefectures"
        class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-md"
      >
        {{ $t("flow.buttons.ready") }}
      </button>
    </div>
  </div>
</template>
