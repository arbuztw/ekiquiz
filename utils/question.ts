import { shuffleArray } from "@/utils/shuffle";
import lines from "@/data/lines.json";
import allStationsData from "@/data/stations.json";
import { GameMode } from "@/stores/configStores";

declare global {
  interface MapConstructor {
    groupBy<T, K>(
      items: Iterable<T>,
      keySelector: (item: T, index: number) => K
    ): Map<K, T[]>;
  }
}

interface Station {
  prefecture: number;
  lines: number[];
  names: string[];
}

interface Line {
  name: string;
}

interface Question {
  question: string[];
  answer: string[];
  choices?: string[];
}

const allStations: Record<string, Station> = allStationsData;
const allLines: Record<string, Line> = lines;

function generateMultipleChoiceOptions(
  currentStation: Station,
  matchedStations: Station[]
): string[] {
  const otherStations = Object.values(allStations).filter(
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

  let incorrectAnswers: string[] = [];
  // Try to get 2 incorrect answers with shared lines
  for (const { station } of stationsWithSimilarity) {
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
  numQuestions: number,
  selectedPrefectures: number[],
  stationLineThreshold: number,
  gameMode: GameMode
): Question[] {
  const matched_stations = Object.values(allStations).filter(
    (station) =>
      selectedPrefectures.includes(station.prefecture) &&
      station.lines.length >= stationLineThreshold
  );

  const stationsByLines = Map.groupBy(matched_stations, (station) =>
    station.lines.join(",")
  );

  return shuffleArray(
    Array.from(stationsByLines.entries())
      .filter(([_, stations]) => stations.length === 1)
      .map(([line_str, stations]) => {
        const question: Question = {
          question: line_str.split(",").map((line) => allLines[line].name),
          answer: stations[0].names,
        };

        if (gameMode === GameMode.MultipleChoice) {
          question.choices = generateMultipleChoiceOptions(
            stations[0],
            matched_stations
          );
        }
        return question;
      })
  ).slice(0, numQuestions);
}