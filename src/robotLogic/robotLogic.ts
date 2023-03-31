import { LOST } from "../constants";

type DirectionType = "N" | "E" | "S" | "W";

type TurnInstructionsType = "L" | "R";

type EdgePositionType = {
  x: number;
  y: number;
};

type EdgePositionsType = {
  [key in DirectionType]: EdgePositionType[];
};

export const turnRobot = (
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

export const moveRobot = (
  direction: DirectionType,
  x: number,
  y: number,
  status: string,
  worldSizeX: string,
  worldSizeY: string
): [number, number, string] => {
  let updatedX = x;
  let updatedY = y;
  let updatedStatus = status;

  switch (direction) {
    case "N":
      updatedY++;
      if (updatedY === Number(worldSizeY) + 1) {
        updatedStatus = LOST;
        updatedY--;
      }
      break;
    case "E":
      updatedX++;
      if (updatedX === Number(worldSizeX) + 1) {
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

export const updateEdgePositions = (
  x: number,
  y: number,
  direction: DirectionType,
  edgePositionsObject: EdgePositionsType
): void => {
  const edgePositionExists = edgePositionsObject[direction].some(
    (position) => position.x === x && position.y === y
  );

  if (!edgePositionExists) {
    edgePositionsObject[direction].push({ x, y });
  }
};

/*
Checks if a robot is on a safe position, not on an already saved 
edgePosition facing direction that will make him fall with next move
*/

export const isRobotNotOnEdgePosition = (
  updatedDirection: DirectionType,
  updatedY: number,
  updatedX: number,
  edgePositions: EdgePositionsType
) => {
  return !edgePositions[updatedDirection].some(
    (position: EdgePositionType) =>
      position.y === updatedY && position.x === updatedX
  );
};
