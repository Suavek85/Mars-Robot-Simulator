# Mars Robot Simulator

## Problem Description

The surface of Mars can be modelled by a rectangular grid. Robots are able to move around the grid following instructions that are sent from Earth.

### Objective

The program's goal is to determine the sequence of robot positions and report the final position of each robot.

### Robot Position

- A robot's position is defined by a grid coordinate (x, y) and an orientation (N, S, E, W).
- Instructions are given as a string of letters: "L" (turn left 90 degrees), "R" (turn right 90 degrees), and "F" (move forward one grid point in the current orientation).

### Instructions

- **Left (L)** - The robot turns left 90 degrees but remains on the current grid point.
- **Right (R)** - The robot turns right 90 degrees but remains on the current grid point.
- **Forward (F)** - The robot moves forward one grid point in the direction of the current orientation without changing its orientation.

### Grid and Boundaries

- The grid is rectangular and bounded. If a robot moves off the edge of the grid, it is considered lost.
- A "scent" is left at the last grid position occupied by a lost robot, preventing future robots from falling off at the same point.

## Input

- The first line of input specifies the upper-right coordinates of the grid (the lower-left coordinates are assumed to be 0, 0).
- Subsequent input consists of sequences of robot positions and instructions. Each robot's position is given on one line, followed by a line with instructions.

## Output

- For each robot, the output includes the final grid position and orientation.
- If a robot falls off the edge, the word "LOST" is appended to the output.

## Sample Input

5 3
1 1 E
RFRFRFRF

3 2 N
FRRFLLFFRRFLL

0 3 W
LLFFFLFLFL

## Sample Output

1 1 E
3 3 N LOST
2 3 S


## Additional Requirements

- The maximum value for any coordinate is 50.
- All instruction strings will be less than 100 characters in length.


## Requirements
Node v16 or higher

## Available scripts
In the project directory, you can run:

### `npm start`
Runs the app in development mode on [http://localhost:3000](http://localhost:3000).

### `npm run build`
Builds the app for production to the build folder.

### `npm run type-check`
Checks the TypeScript type declarations for the project.

### `npm run eject`
Ejects the app from Create React App allowing you to customize config files.