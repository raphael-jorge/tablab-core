import { Tab } from '../../tab/tab';
import { Instruction } from './instruction';
import { InstructionWriteResult, SuccessInstructionWriteResult } from '../instruction-write-result';

export class WriteFooterInstruction extends Instruction {
  readonly footer: string;

  /**
   * Creates a write footer instruction instance.
   * @param footer - The footer to be written.
   */
  constructor(footer: string) {
    super();

    this.footer = footer;
  }

  /**
   * Writes the `footer` to the tablature.
   * @param tab - The tablature to write the footer.
   * @returns The result of the writing operation.
   */
  writeOnTab(tab: Tab): InstructionWriteResult {
    let result: InstructionWriteResult;

    try {
      tab.writeFooter(this.footer);

      result = new SuccessInstructionWriteResult();
    } catch (e) {
      result = this.getFailureResultOnError(e);
    }

    return result;
  }
}
