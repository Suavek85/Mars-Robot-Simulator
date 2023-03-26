import { useState, useRef } from "react";
import MarsGrid from "./components/MarsGrid";
import {
  INVALID_INPUT_ALERT,
  INPUT_PLACEHOLDER,
  HEADER_TEXT,
  SUBMIT_BUTTON,
  ROBOT_OUTPUT,
  LOST,
} from "./constants";
import "./App.css";

type DirectionType = "N" | "E" | "S" | "W";

type TurnInstructionsType = "L" | "R";

type StatusType = "" | typeof LOST;

type EdgePositionsType = {
  [key in DirectionType]: { x: number; y: number }[];
};
interface Robot {
  currentX: number;
  currentY: number;
  robotNumber: number;
  direction: DirectionType;
  status: StatusType;
}

const initialRobot: Robot = {
  currentX: 0,
  currentY: 0,
  direction: "N",
  robotNumber: 1,
  status: "",
};

function App() {
  const [robot, setRobot] = useState<Robot>(initialRobot);
  const instructionsRef = useRef<HTMLInputElement>(null);
  const [edgePositions, setEdgePositions] = useState<EdgePositionsType>({
    N: [],
    E: [],
    S: [],
    W: [],
  });
  const { currentX, currentY, direction, robotNumber, status } = robot;

  console.log(edgePositions);

  const isRobotOnEdgePosition = (
    updatedDirection: DirectionType,
    updatedY: number,
    updatedX: number
  ) => {
    return edgePositions[updatedDirection].some(
      (position) => position.y === updatedY && position.x === updatedX
    );
  };

  const turnRobot = (
    direction: DirectionType,
    instruction: TurnInstructionsType
  ): DirectionType => {
    const directionMap: Record<
      DirectionType,
      Record<TurnInstructionsType, DirectionType>
    > = {
      N: { L: "W", R: "E" },
      E: { L: "N", R: "S" },
      S: { L: "E", R: "W" },
      W: { L: "S", R: "N" },
    };
    return directionMap[direction][instruction];
  };

  const moveRobot = (
    direction: DirectionType,
    x: number,
    y: number,
    status: StatusType
  ): [number, number, StatusType] => {
    let updatedX = x;
    let updatedY = y;
    let updatedStatus = status;

    switch (direction) {
      case "N":
        updatedY++;
        if (updatedY === 51) {
          updatedStatus = LOST;
          updatedY--;
        }
        break;
      case "E":
        updatedX++;
        if (updatedX === 51) {
          updatedStatus = LOST;
          updatedX--;
        }
        break;
      case "S":
        updatedY--;
        if (updatedY === -1) {
          updatedStatus = LOST;
          updatedY++;
        }
        break;
      case "W":
        updatedX--;
        if (updatedX === -1) {
          updatedStatus = LOST;
          updatedX++;
        }
        break;
    }
    return [updatedX, updatedY, updatedStatus];
  };

  const updateEdgePositions = (
    x: number,
    y: number,
    direction: DirectionType
  ): void => {
    setEdgePositions((prevEdgePositions: EdgePositionsType) => {
      const edgePositionExists = prevEdgePositions[direction].some(
        (position) => position.x === x && position.y === y
      );

      if (!edgePositionExists) {
        return {
          ...prevEdgePositions,
          [direction]: [...prevEdgePositions[direction], { x, y }],
        };
      }
      return prevEdgePositions;
    });
  };

  const executeInstructions = (instructions: string) => {
    const isRobotLost = status === LOST;
    let updatedX = isRobotLost ? initialRobot.currentX : currentX;
    let updatedY = isRobotLost ? initialRobot.currentY : currentY;
    let updatedRobotNumber = isRobotLost ? robotNumber + 1 : robotNumber;
    let updatedDirection = isRobotLost ? initialRobot.direction : direction;
    let updatedStatus = isRobotLost ? initialRobot.status : status;

    for (const instruction of instructions) {
      if (instruction === "L" || instruction === "R") {
        updatedDirection = turnRobot(updatedDirection, instruction);
      } else if (instruction === "F") {
        if (isRobotOnEdgePosition(updatedDirection, updatedY, updatedX)) {
          break;
        } else {
          [updatedX, updatedY, updatedStatus] = moveRobot(
            updatedDirection,
            updatedX,
            updatedY,
            updatedStatus
          );
        }
      }
    }

    if (updatedStatus === LOST) {
      updateEdgePositions(updatedX, updatedY, updatedDirection);
    }

    setRobot({
      currentX: updatedX,
      currentY: updatedY,
      robotNumber: updatedRobotNumber,
      direction: updatedDirection,
      status: updatedStatus,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const instructionsValue = instructionsRef.current?.value;

    if (!instructionsValue) return;

    const upcasedTrimmedInstructions = instructionsValue
      .toUpperCase()
      .replace(/\s/g, "");

    if (!/^[LRF]+$/.test(upcasedTrimmedInstructions)) {
      alert({ INVALID_INPUT_ALERT });
      return;
    } else {
      executeInstructions(upcasedTrimmedInstructions);
      instructionsRef.current?.value && (instructionsRef.current.value = "");
    }
  };

  return (
    <div className="app">
      <h1>{HEADER_TEXT}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          ref={instructionsRef}
          placeholder={INPUT_PLACEHOLDER}
        />
        <button type="submit">{SUBMIT_BUTTON}</button>
      </form>
      <p>
        {robotNumber}-{ROBOT_OUTPUT}
      </p>
      <p>
        {currentX} {currentY} {direction} {status}
      </p>
      <MarsGrid positionX={currentX} positionY={currentY} />
    </div>
  );
}

export default App;
