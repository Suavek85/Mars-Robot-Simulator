export const getInitialPositionInputs = (cleanedLines: string[]): string[] => {
  return cleanedLines.filter((_, i) => i === 1 || (i % 2 === 1 && i > 2));
};

export const getInstructionsInputs = (cleanedLines: string[]): string[] => {
  return cleanedLines.filter((_, i) => i === 2 || (i % 2 === 0 && i > 2));
};
