type CleanedAndValidatedInputType = {
  areAllInputLinesValid: boolean;
  cleanedLines: string[];
}

const validateWorldDimensionsInput = (worldDimensions: string) => {
  return /^(?:[1-9]|[1-4]\d|50) (?:[1-9]|[1-4]\d|50)$/.test(worldDimensions);
};

const validateInitialPositionInput = (initialPosition: string) => {
  return /^([0-9]|[1-4][0-9]|50) ([0-9]|[1-4][0-9]|50) [EWSN]$/.test(initialPosition);
};

const validateInstructionsInput = (instructions: string) => {
  return /^[FRL]+$/.test(instructions);
};

const validateInputLine = (index: number, line: string) => {
  if (line === "") {
    return true;
  } else if (index === 0) {
    return validateWorldDimensionsInput(line);
  } else if (index % 2 === 1) {
    return validateInitialPositionInput(line);
  } else if (index % 2 === 0) {
    return validateInstructionsInput(line);
  } else {
    return true;
  }
};

export const cleanAndValidateInput = (inputValue: string): CleanedAndValidatedInputType => {
  const lines = inputValue.split("\n");
  
  const cleanedLines = lines.map(line => {
    const trimmedLine = line.trim();
    return trimmedLine !== '' ? trimmedLine : null;
  }).filter(Boolean) as string[];

  const areAllInputLinesValid = cleanedLines.every((line, index) => validateInputLine(index, line));

  return {
    areAllInputLinesValid,
    cleanedLines: areAllInputLinesValid ? cleanedLines : []
  };
}
