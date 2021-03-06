import { InvalidInstruction } from '../../../src/instruction/instructions/invalid-instruction';
import { MergeableInstruction } from '../../../src/instruction/instructions/mergeable-instruction';

describe(`[${InvalidInstruction.name}]`, () => {
  it('should not be a mergeable instruction', () => {
    const invalidationReasonIdentifier = 'TEST_REASON';
    const instruction = new InvalidInstruction(invalidationReasonIdentifier);

    expect(instruction).not.toBeInstanceOf(MergeableInstruction);
  });

  describe('[writeOnTab]', () => {
    it('should return a failed write result with the given reasonIdentifier', () => {
      const reasonIdentifier = 'TEST_REASON';
      const instruction = new InvalidInstruction(reasonIdentifier);

      const writeResult = instruction.writeOnTab();

      expect(writeResult.success).toBe(false);
      expect(writeResult.failureReasonIdentifier).toBe(reasonIdentifier);
      expect(writeResult.failureMessage).toBe(null);
    });

    it('should return a failed write result with the given description if one is given', () => {
      const reasonIdentifier = 'TEST_REASON';
      const message = 'Test Message';
      const instruction = new InvalidInstruction(reasonIdentifier, message);

      const writeResult = instruction.writeOnTab();

      expect(writeResult.success).toBe(false);
      expect(writeResult.failureReasonIdentifier).toBe(reasonIdentifier);
      expect(writeResult.failureMessage).toBe(message);
    });
  });
});
