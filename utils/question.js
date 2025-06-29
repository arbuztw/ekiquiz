import { shuffleArray } from "@/utils/shuffle";
import lines from "@/data/lines.json";
import allStationsData from "@/data/stations.json";
import { GameMode } from "@/stores/configStores";

function generateMultipleChoiceOptions(currentStation, matchedStations) {
  const otherStations = Object.values(allStationsData).filter(
    (s) => s.names[0] !== currentStation.names[0]
  );

  // Calculate similarity based on shared lines
  const currentStationLines = new Set(currentStation.lines);
  const stationsWithSimilarity = otherStations
    .map((s) => {
      const sharedLines = s.lines.filter((line) =>
        currentStationLines.has(line)
      ).length;
      const editDistance =
        Math.max(currentStationLines.size, s.lines.length) - sharedLines;
      return { station: s, editDistance };
    })
    .sort((a, b) => a.editDistance - b.editDistance); // Smaller edit distance first

  console.log(`currentStation: ${currentStation.names[0]}`);
  let incorrectAnswers = [];
  // Try to get 2 incorrect answers with shared lines
  for (const { station, editDistance } of stationsWithSimilarity) {
    console.log(`editDistance: ${station.names[0]} ${editDistance}`);
    if (incorrectAnswers.length < 2) {
      incorrectAnswers.push(station.names[0]);
    } else {
      break;
    }
  }

  // Fallback: get any remaining from all matched stations
  if (incorrectAnswers.length < 2) {
    const allMatchedStationNames = matchedStations.flatMap((s) => s.names);
    const remainingIncorrect = shuffleArray(
      allMatchedStationNames.filter(
        (name) =>
          !currentStation.names.includes(name) &&
          !incorrectAnswers.includes(name)
      )
    );
    for (const name of remainingIncorrect) {
      if (incorrectAnswers.length < 2) {
        incorrectAnswers.push(name);
      } else {
        break;
      }
    }
  }
  return shuffleArray([currentStation.names[0], ...incorrectAnswers]);
}

export function createQuestions(
  numQuestions,
  selectedPrefectures,
  stationLineThreshold,
  gameMode
) {
  const matched_stations = Object.entries(allStationsData)
    .map(([_, station]) => station)
    .filter(
      (station) =>
        selectedPrefectures.includes(station.prefecture) &&
        station.lines.length >= stationLineThreshold
    );
  return shuffleArray(
    Map.groupBy(matched_stations, (station) => station.lines.join(","))
      .entries()
      .filter(([_, stations]) => stations.length == 1)
      .toArray()
  )
    .slice(0, numQuestions)
    .map(([line_str, stations]) => {
      const question = {
        question: line_str.split(",").map((line) => lines[line].name),
        answer: stations[0].names,
      };

      if (gameMode === GameMode.MultipleChoice) {
        question.choices = generateMultipleChoiceOptions(
          stations[0],
          matched_stations
        );
      }
      return question;
    });
}
