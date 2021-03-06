import { Tab } from '../../tab/tab';
import { Instruction } from './instruction';
import { InstructionWriteResult, SuccessInstructionWriteResult } from '../instruction-write-result';

export class RepeatInstruction extends Instruction {
  readonly instructions: Instruction[];
  readonly repetitions: number;

  /**
   * Creates a repeat instruction instance.
   * @param instructions - The instruction instances to be repeated.
   * @param repetitions - The number of repetitions.
   */
  constructor(instructions: Instruction[], repetitions: number) {
    super();

    this.instructions = instructions;
    this.repetitions = repetitions;
  }

  /**
   * Writes the `instructions` to the tablature `n` times, where `n`
   * is the `repetitions` value.
   * @param tab - The tablature to write the instructions.
   * @returns The result of the writing operation.
   */
  writeOnTab(tab: Tab): InstructionWriteResult {
    let result: InstructionWriteResult = new SuccessInstructionWriteResult();

    try {
      for (let i = 0; i < this.repetitions; i++) {
        for (let j = 0; j < this.instructions.length; j++) {
          const instruction = this.instructions[j];

          result = instruction.writeOnTab(tab);

          if (i === 0 && !result.success) break;
        }
      }
    } catch (e) {
      result = this.getFailureResultOnError(e);
    }

    return result;
  }
}
