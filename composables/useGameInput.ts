import { ref } from "vue";

export function useGameInput(props, emit) {
  const userAnswer = ref("");
  const answered = ref(false);
  const answerCorrect = ref(false);

  const checkAnswer = () => {
    answerCorrect.value = props.question.answer.includes(userAnswer.value);
    answered.value = true;
  };

  const nextQuestion = (correct) => {
    userAnswer.value = "";
    answered.value = false;
    answerCorrect.value = false;
    emit("nextQuestion", correct);
  };

  return {
    userAnswer,
    answered,
    answerCorrect,
    checkAnswer,
    nextQuestion,
  };
}
