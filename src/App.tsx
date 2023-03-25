import { useState, useRef } from "react";
import "./App.css";

type DirectionType = "N" | "E" | "S" | "W";
interface Robot {
  x: number;
  y: number;
  robotNumber: number;
  direction: DirectionType;
}

const initialRobot: Robot = { x: 0, y: 0, direction: "N", robotNumber: 1 };

function App() {
  const [robot, setRobot] = useState<Robot>(initialRobot);
  const instructionsRef = useRef<HTMLInputElement>(null);

  const executeInstructions = (instructions: string) => {
    const { x, y, direction, robotNumber } = robot;

    let updatedX = x;
    let updatedY = y;
    let updatedRobotNumber = robotNumber;
    let updatedDirection = direction;

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
        switch (updatedDirection) {
          case "N":
            updatedY++;
            break;
          case "E":
            updatedX++;
            break;
          case "S":
            updatedY--;
            break;
          case "W":
            updatedX--;
            break;
        }
      }
    }

    setRobot({
      x: updatedX,
      y: updatedY,
      robotNumber: updatedRobotNumber,
      direction: updatedDirection,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const instructionsValue = instructionsRef.current?.value;

    if (!instructionsValue) return;

    const upcasedTrimmedInstructions = instructionsValue.toUpperCase().replace(/\s/g, "");

    if (!/^[LRF]+$/.test(upcasedTrimmedInstructions)) {
      alert('Invalid input, provide a valid string of robot instructions: L, R or F.');
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
      <p>
        {robot.x} {robot.y} {robot.direction}
      </p>
    </div>
  );
}

export default App;
