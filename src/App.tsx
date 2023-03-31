import { useState, useRef } from "react";
import {
  HEADER_TEXT,
  SUBMIT_BUTTON,
  ROBOT_OUTPUT,
  LOST,
  INVALID_INPUT_WARNING,
} from "./constants";
import { cleanAndValidateInput } from "./inputValidation";
import {
  getInitialPositionInputs,
  getInstructionsInputs,
} from "./inputHandling";
import {
  updateEdgePositions,
  moveRobot,
  turnRobot,
  isRobotNotOnEdgePosition,
} from "./robotLogic";
import { generateUniqueId } from "./utils/generateUniqueId";
import "./App.css";

type DirectionType = "N" | "E" | "S" | "W";

type EdgePositionType = {
  x: number;
  y: number;
};

type EdgePositionsType = {
  [key in DirectionType]: EdgePositionType[];
};
interface Robot {
  currentX: number;
  currentY: number;
  direction: DirectionType;
  status: string;
  id: string;
}

function App() {
  const [robots, setRobots] = useState<Robot[]>([]);
  const [isInputValid, setInputValidity] = useState(true);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const worldSizeInputRef = useRef<string>();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setRobots([]);

    const { areAllInputLinesValid, cleanedLines } = cleanAndValidateInput(
      inputRef.current?.value || ""
    );
    setInputValidity(areAllInputLinesValid);

    if (areAllInputLinesValid) {

      let updatedEdgePositions: EdgePositionsType = {
        N: [],
        E: [],
        S: [],
        W: [],
      };

      worldSizeInputRef.current = cleanedLines[0];
      const initialPositionInputs = getInitialPositionInputs(cleanedLines);
      const instructionsInputs = getInstructionsInputs(cleanedLines);

      for (let i = 0; i < initialPositionInputs.length; i++) {
        if (instructionsInputs[i] && initialPositionInputs[i]) {
          executeInstructions(
            initialPositionInputs[i],
            instructionsInputs[i],
            updatedEdgePositions,
            // eslint-disable-next-line no-loop-func
            (edgePositions) => {
              updatedEdgePositions = edgePositions;
            }
          );
        } else {
          break;
        }
      }
    }
  };

  const executeInstructions = (
    initialPosition: string,
    instructions: string,
    updatedEdgePositions: EdgePositionsType,
    onEdgePositionsUpdated: (edgePositions: EdgePositionsType) => void
  ) => {
    const [initialX, initialY, initialDirection] = initialPosition.split(" ");
    const [worldSizeX = "", worldSizeY = ""] =
      worldSizeInputRef.current?.split(" ") || [];
    let updatedX = Number(initialX);
    let updatedY = Number(initialY);
    let updatedDirection = initialDirection as DirectionType;
    let updatedStatus = "";

    if (Number(worldSizeX) > updatedX || Number(worldSizeY) > updatedY) {
      for (const instruction of instructions) {
        if (instruction === "L" || instruction === "R") {
          updatedDirection = turnRobot(updatedDirection, instruction);
        }
        if (
          instruction === "F" &&
          isRobotNotOnEdgePosition(
            updatedDirection,
            updatedY,
            updatedX,
            updatedEdgePositions
          )
        ) {
          [updatedX, updatedY, updatedStatus] = moveRobot(
            updatedDirection,
            updatedX,
            updatedY,
            updatedStatus,
            worldSizeX,
            worldSizeY
          );
          if (updatedStatus === LOST) {
            updateEdgePositions(
              updatedX,
              updatedY,
              updatedDirection,
              updatedEdgePositions
            );
            onEdgePositionsUpdated(updatedEdgePositions);
            break;
          }
        }
      }
    } else {
      updatedStatus = "Robot deployed outside of the world and LOST";
    }

    setRobots((prevRobots) => {
      const newRobot = {
        id: generateUniqueId(),
        currentX: updatedX,
        currentY: updatedY,
        direction: updatedDirection,
        status: updatedStatus,
      };
      return [...prevRobots, newRobot];
    });
  };

  return (
    <div className="app">
      <h1>{HEADER_TEXT}</h1>
      <form onSubmit={handleSubmit}>
        <textarea cols={50} rows={10} ref={inputRef} />
        {!isInputValid && <p>{INVALID_INPUT_WARNING}</p>}
        <button type="submit">{SUBMIT_BUTTON}</button>
      </form>
      <p>{ROBOT_OUTPUT}</p>
      {robots.map((robot) => (
        <p key={robot.id}>
          {robot.currentX} {robot.currentY} {robot.direction} {robot.status}
        </p>
      ))}
    </div>
  );
}

export default App;
