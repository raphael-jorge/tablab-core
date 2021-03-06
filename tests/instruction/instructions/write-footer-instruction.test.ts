import { WriteFooterInstruction } from '../../../src/instruction/instructions/write-footer-instruction';
import { MergeableInstruction } from '../../../src/instruction/instructions/mergeable-instruction';
import { Tab } from '../../../src/tab/tab';
import { InvalidInstructionReason } from '../../../src/instruction/enums/invalid-instruction-reason';

describe(`[${WriteFooterInstruction.name}]`, () => {
  it('should not be a mergeable instruction', () => {
    const instruction = new WriteFooterInstruction('test footer');

    expect(instruction).not.toBeInstanceOf(MergeableInstruction);
  });

  describe('[writeOnTab]', () => {
    it('should write the footer to the tab on write, returning a success write result', () => {
      const footer = 'test footer';
      const instruction = new WriteFooterInstruction(footer);
      const tab = new Tab();

      tab.writeFooter = jest.fn();
      const writeResult = instruction.writeOnTab(tab);

      expect(tab.writeFooter).toHaveBeenCalledWith(footer);
      expect(writeResult.success).toBe(true);
    });

    it('should return a failed write result on error', () => {
      const errorMessage = 'footer: an unexpected error occurred';
      const instruction = new WriteFooterInstruction('');
      const tab = new Tab();

      tab.writeFooter = jest.fn(() => {
        throw new Error(errorMessage);
      });
      const writeResult = instruction.writeOnTab(tab);

      expect(tab.writeFooter).toHaveBeenCalled();
      expect(writeResult.success).toBe(false);
      expect(writeResult.failureReasonIdentifier).toBe(InvalidInstructionReason.UnknownReason);
      expect(writeResult.failureMessage).toContain(errorMessage);
    });
  });
});
