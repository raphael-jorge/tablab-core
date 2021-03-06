type IterationEndVerification = (idx: number) => boolean;

export class StringHelper {
  static format(thisString: string, replacers: string[]): string {
    const POSITION_MATHC_REGEX = /{(\d+)}/g;
    return thisString.replace(POSITION_MATHC_REGEX, (match: string, p1: string): string => {
      const replacerIndex = Number(p1);

      if (isNaN(replacerIndex) || replacerIndex >= replacers.length) return match;
      else return replacers[replacerIndex];
    });
  }

  static getIndexOfDifferent(
    thisString: string,
    searchString: string,
    position = 0,
    searchIteration = 1
  ): number {
    if (searchIteration === 0)
      throw Error('The parameter searchIteration must be a non zero integer.');

    if (position > thisString.length - 1 || position < -thisString.length) return -1;

    const startIdx = position >= 0 ? position : thisString.length + position;

    const positiveIterationEndVerification: IterationEndVerification = (idx) =>
      idx < thisString.length;
    const negativeIterationEndVerification: IterationEndVerification = (idx) => idx > 0;

    const hasEnded =
      searchIteration > 0 ? positiveIterationEndVerification : negativeIterationEndVerification;

    for (let i = startIdx; hasEnded(i); i = i + searchIteration) {
      if (thisString[i] !== searchString) {
        return i;
      }
    }

    return -1;
  }

  static isNumber(thisString: string): boolean {
    const trimmedArgument = thisString.trim();
    const argumentAsNumber = Number(trimmedArgument);
    const argumentIsNumber = trimmedArgument.length > 0 && !isNaN(argumentAsNumber);

    return argumentIsNumber;
  }

  static tryConvertToNumber(thisString: string): string | number {
    if (StringHelper.isNumber(thisString)) return Number(thisString);
    else return thisString;
  }
}
