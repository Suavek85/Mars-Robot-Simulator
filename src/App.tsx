import { useState, useRef } from "react";
import MarsGrid from './components/MarsGrid';
import "./App.css";

const LOST = "LOST";

type DirectionType = "N" | "E" | "S" | "W";

type StatusType = "" | typeof LOST;

type EdgePositionsType = {
  [key in DirectionType]: { x: number; y: number }[];
};
interface Robot {
  x: number;
  y: number;
  robotNumber: number;
  direction: DirectionType;
  status: StatusType;
}

const initialRobot: Robot = {
  x: 0,
  y: 0,
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
  const { x, y, direction, robotNumber, status } = robot;

  const isRobotOnEdgePosition = (
    updatedDirection: DirectionType,
    updatedY: number,
    updatedX: number
  ) => {
    return edgePositions[updatedDirection].some(
      (position) => position.y === updatedY && position.x === updatedX
    );
  };

  const executeInstructions = (instructions: string) => {
    
    const isRobotLost = status === LOST;

    let updatedX = isRobotLost ? initialRobot.x : x;
    let updatedY = isRobotLost ? initialRobot.y : y;
    let updatedRobotNumber = isRobotLost ? robotNumber + 1 : robotNumber;
    let updatedDirection = isRobotLost ? initialRobot.direction : direction;
    let updatedStatus = isRobotLost ? initialRobot.status : status;

    for (const instruction of instructions) {
      if (instruction === "L" || instruction === "R") {
        const directionMap: Record<
          DirectionType,
          Record<"L" | "R", DirectionType>
        > = {
          N: { L: "W", R: "E" },
          E: { L: "N", R: "S" },
          S: { L: "E", R: "W" },
          W: { L: "S", R: "N" },
        };

        updatedDirection = directionMap[updatedDirection][instruction];
      } else if (instruction === "F") {

        if (isRobotOnEdgePosition(updatedDirection, updatedY, updatedX)) {
          break;
        }

        switch (updatedDirection) {
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
      }
    }

    if (updatedStatus === LOST) {
      setEdgePositions((prevEdgePositions) => {
        const edgePositionExists = prevEdgePositions[updatedDirection].some(
          (position) => position.x === updatedX && position.y === updatedY
        );

        if (!edgePositionExists) {
          return {
            ...prevEdgePositions,
            [updatedDirection]: [
              ...prevEdgePositions[updatedDirection],
              { x: updatedX, y: updatedY },
            ],
          };
        }
        return prevEdgePositions;
      });
    }

    setRobot({
      x: updatedX,
      y: updatedY,
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
      alert(
        "Invalid input, provide a valid string of robot instructions: L, R or F."
      );
      return;
    }

    executeInstructions(upcasedTrimmedInstructions);

    instructionsRef.current?.value && (instructionsRef.current.value = "");
  };

  return (
    <div className="app">
      <h1>ROBOTS ON MARS</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          ref={instructionsRef}
          placeholder="Enter input: L, R, F"
        />
        <button type="submit">SUBMIT INSTRUCTIONS</button>
      </form>
      <p>ROBOT{robot.robotNumber} output:</p>
      <p>{x} {y} {direction} {status}</p>
      <MarsGrid positionX={x} positionY={y} />
    </div>
  );
}

export default App;
