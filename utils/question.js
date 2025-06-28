import { shuffleArray } from "@/utils/shuffle";
import lines from "@/data/lines.json";
import { GameMode } from "@/stores/configStores";

export function createQuestions(
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
        ).slice(0, 2);
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