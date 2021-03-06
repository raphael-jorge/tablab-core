import { StringHelper } from '../../src/helpers/string-helper';

describe(`[${StringHelper.name}]`, () => {
  describe('[format]', () => {
    it('should return the original string if no replacers are given', () => {
      const replacers: string[] = [];
      const str = 'the test parameter A is {0} and the test parameter B is {1}.';

      const formattedStr = StringHelper.format(str, replacers);

      expect(formattedStr).toBe(str);
    });

    it('should return the original string if no replacement markup is found', () => {
      const replacers: string[] = ['TEST_REPLACER1', 'TEST_REPLACER2'];
      const str = 'the test parameter A is EMPTY and the test parameter B is EMPTY.';

      const formattedStr = StringHelper.format(str, replacers);

      expect(formattedStr).toBe(str);
    });

    it('should replace the replacement markups with the given replacers', () => {
      const replacers: string[] = ['TEST_REPLACER1', 'TEST_REPLACER2'];
      const str = 'the test parameter A is {0} and the test parameter B is {1}.';

      const expectedFormattedStr =
        'the test parameter A is TEST_REPLACER1 and the test parameter B is TEST_REPLACER2.';

      const formattedStr = StringHelper.format(str, replacers);

      expect(formattedStr).toBe(expectedFormattedStr);
    });

    it('should replace the replacement markups with the matching given replacers', () => {
      const replacers: string[] = ['TEST_REPLACER1', 'TEST_REPLACER2'];
      const str = 'the test parameter A is {1} and the test parameter B is {0}.';

      const expectedFormattedStr =
        'the test parameter A is TEST_REPLACER2 and the test parameter B is TEST_REPLACER1.';

      const formattedStr = StringHelper.format(str, replacers);

      expect(formattedStr).toBe(expectedFormattedStr);
    });
  });

  describe('[getIndexOfDifferent]', () => {
    it('should throw if iteration is 0', () => {
      const str = 'test';

      expect(() => StringHelper.getIndexOfDifferent(str, ' ', 0, 0)).toThrow();
    });

    it('should return -1 if start index is greater than last character index', () => {
      const str = 'test';
      const indexOfDifferent = StringHelper.getIndexOfDifferent(str, ' ', str.length);

      expect(indexOfDifferent).toBe(-1);
    });

    it('should return -1 if start index is smaller than the string length negative', () => {
      const str = 'test';
      const indexOfDifferent = StringHelper.getIndexOfDifferent(str, ' ', -(str.length + 1));

      expect(indexOfDifferent).toBe(-1);
    });

    it('should return -1 if no character diferent than specified is found', () => {
      const str = 'tttt';
      const indexOfDifferent = StringHelper.getIndexOfDifferent(str, 't');

      expect(indexOfDifferent).toBe(-1);
    });

    it('should return -1 if no character diferent than specified is found, while reading from last string index', () => {
      const str = 'tttt';
      const indexOfDifferent = StringHelper.getIndexOfDifferent(str, 't', -1, -1);

      expect(indexOfDifferent).toBe(-1);
    });

    it('should return the index of the first character diferent from the one specified', () => {
      const str = 'test';
      const indexOfDifferent = StringHelper.getIndexOfDifferent(str, 't');

      expect(indexOfDifferent).toBe(1);
    });

    it('should return the index of the first character diferent from the one specified, while reading from last string index', () => {
      const str = 'test';
      const indexOfDifferent = StringHelper.getIndexOfDifferent(str, 't', -1, -1);

      expect(indexOfDifferent).toBe(2);
    });
  });

  describe('[isNumber]', () => {
    it('should return true if the string is a number value', () => {
      const str = '1234';

      expect(StringHelper.isNumber(str)).toBe(true);
    });

    it('should return false if the string is not a number value', () => {
      const str = 'test string';

      expect(StringHelper.isNumber(str)).toBe(false);
    });

    it('should return false if the string is empty', () => {
      const str = '';

      expect(StringHelper.isNumber(str)).toBe(false);
    });
  });

  describe('[tryConvertToNumber]', () => {
    it('should return the given string if it is not a valid number', () => {
      const str = ' test string ';

      expect(StringHelper.tryConvertToNumber(str)).toBe(str);
    });

    it('should return the expected number if the string is actually a number', () => {
      const number = 1234;

      expect(StringHelper.tryConvertToNumber(number.toString())).toBe(number);
    });

    it('should return the given string if it is empty', () => {
      const str = '';

      expect(StringHelper.tryConvertToNumber(str)).toBe(str);
    });
  });
});
