# Tablab - Parser <!-- omit in toc -->

The `Parser` class provides methods to parse a text input of instructions, converting them to structured data.

Check out:

- The [accepted instruction formats](#accepted-instructions);
- How to [write a tablature with the parsed instructions](#writing-a-tablature-with-the-parsed-instructions);
- The available [options](#parser-options) to customize the parser;
- The available [methods](#parser-methods) to parse instructions;

## Table of content <!-- omit in toc -->

- [Accepted instructions](#accepted-instructions)
  - [Basic instructions](#basic-instructions)
  - [Method instructions](#method-instructions)
    - [Available method instructions](#available-method-instructions)
- [Parsing instructions](#parsing-instructions)
- [Writing a tablature with the parsed instructions](#writing-a-tablature-with-the-parsed-instructions)
- [Handling invalid instructions](#handling-invalid-instructions)
- [Parser options](#parser-options)
  - [Mapped method instructions](#mapped-method-instructions)
    - [Method instructions identifiers](#method-instructions-identifiers)
    - [Disabling method instructions](#disabling-method-instructions)
    - [Changing the alias of method instructions](#changing-the-alias-of-method-instructions)
    - [Adding new aliases for method instructions](#adding-new-aliases-for-method-instructions)
  - [Enclosure type for method instructions arguments](#enclosure-type-for-method-instructions-arguments)
  - [Enclosure type for method instructions targets](#enclosure-type-for-method-instructions-targets)
- [Parser Methods](#parser-methods)
  - [Parse one instruction](#parse-one-instruction)
    - [Parse one instruction (async)](#parse-one-instruction-async)
  - [Parse all instructions](#parse-all-instructions)
    - [Parse all instructions (async)](#parse-all-instructions-async)

## Accepted instructions

### Basic instructions

A basic instruction has the format `{string}-{fret}` where the `fret` represents the instruction that should be written at the nth `string` of the tablature. Check out some examples below:

- `1-0`: First string, open;
- `2-0`: Second string, open;
- `3-5`: Fifth fret of the third string;
- `1-3`: Third fret of the first string;
- `4-5h7`: Fifth fret of the fourth string followed by a _hammer-on_ at the seventh fret;
- `3-5b6`: Fifth fret of the third string followed by a half bend.

Once written to a tablature, these instructions will be [written as notes](../tab/README.md#write-note) to the tablature.

### Method instructions

A method instruction is composed of up to 3 parts:

- The method **alias** (required): It is a text of alphanumeric characters used to identify the method instruction. It must not start with a number;
- The method **arguments** (optional): A set of values enclosed by brackets and separated by commas. These values may be used by some method instructions to perform the writing operation on a tablature. The default brackets for arguments are parentheses;
- The method **targets** (optional): A set of instructions, either basic or method ones, enclosed by brackets. These instructions will be parsed with the method instruction and may be used by some method instructions to perform the writing operation on a tablature. The default brackets for targets are curly braces.

#### Available method instructions

- <a id="method-instruction-break">`break`</a>: Once written to a tablature, this instruction will [add a tablature block](../tab/README.md#add-block) to it.
  - **Alias**: `break`.
  - **Arguments**: None.
  - **Targets**: None.
- <a id="method-instruction-footer">`footer ( footerMessage )`</a>: Once written to a tablature, this instruction will [write a footer](../tab/README.md#write-footer) to it.
  - **Alias**: `footer`.
  - **Arguments**:
    - `footerMessage`: The message to be written at the footer section of the tablature.
  - **Targets**: None.
- <a id="method-instruction-header">`header ( headerMessage )`</a>: Once written to a tablature, this instruction will [write a header](../tab/README.md#write-header) to it.
  - **Alias**: `header`.
  - **Arguments**:
    - `headerMessage`: The message to be written at the header section of the tablature.
  - **Targets**: None.
- <a id="method-instruction-merge">`merge { instructionsToMerge }`</a>: Once written to a tablature, this instruction will [write in parallel](../tab/README.md#write-parallel-notes) the given target instructions to the tablature.
  - **Alias**: `merge`.
  - **Arguments**: None.
  - **Targets**: The instructions to be written to the tablature in parallel. Only [basic instructions](#basic-instructions) are acceptted.
- <a id="method-instruction-repeat">`repeat ( numberOfRepetitions ) { instructionsToRepeat }`</a>: Once written to a tablature, this instruction will write the given target instructions to the tablature `n` times, where `n` is the given `numberOfRepetitions`.
  - **Alias**: `repeat`.
  - **Arguments**:
    - `numberOfRepetitions`: The number of repetitions.
  - **Targets**: The instructions to be written to the tablature.
- <a id="method-instruction-spacing">`spacing (spacingValue)`</a>: Once written to a tablature, this instruction will [set its spacing](../tab/README.md#spacing) property to the given spacing value.
  - **Alias**: `spacing`.
  - **Arguments**:
    - `spacingValue`: The new spacing value to be set at the tablature.
  - **Targets**: None.

## Parsing instructions

The `Parser` class provides a few strategies on how to parse [basic](#basic-instructions) and [method instructions](#method-instructions). In the following example, a `Parser` instance is created, and the [parseAll](#parse-all-instructions) method is used to parse all the instructions from a text input of instructions:

```js
const { Parser } = require('tablab');

const instructions =
  '1-0 2-0 3-5 1-3 4-5h7 3-5b6 break header(Example Header) ' +
  'footer(Example Footer) merge{ 1-0 2-0 } repeat(2){ 1-0 2-3h5 } ' +
  'spacing(2)';

const parser = new Parser();

const parsedInstructions = parser.parseAll(instructions);
```

Check out the [other](#parser-methods) strategies available for parsing instructions.

## Writing a tablature with the parsed instructions

With your text input of instructions [parsed](#parsing-instructions), use the `writeOnTab` method of the result to write each instruction to the tableture. Check out the example below:

```js
const { Tab } = require('tablab');

const tab = new Tab();
parsedInstructions.forEach((parsedInstruction) => {
  const writeResult = parsedInstruction.writeOnTab(tab);

  if (!writeResult.success) {
    console.log(
      `Failed to write instruction < ${parsedInstruction.value} > at position ` +
        `${parsedInstruction.readFromIndex}. ${writeResult.failureMessage} ` +
        `(${writeResult.failureReasonIdentifier})`
    );
  }
});

console.log(tab.format(50));
```

outputs

```
[
  [
    '                                                  ',
    '---0-----------3----------------------------------',
    '-------0------------------------------------------',
    '-----------5-------------5b6----------------------',
    '-------------------5h7----------------------------',
    '--------------------------------------------------',
    '--------------------------------------------------',
    '                                                  '
  ],
  [
    '   | Example Header   |                           ',
    '---|------------------|---0---0---------0---------',
    '---|------------------|---0-------3h5-------3h5---',
    '---|------------------|---------------------------',
    '---|------------------|---------------------------',
    '---|------------------|---------------------------',
    '---|------------------|---------------------------',
    '   |   Example Footer |                           '
  ]
]
```

## Handling invalid instructions

There are a few scenarios that could lead to an instruction not being written to your tablature, among which:

- The given instruction was not in a valid syntax;
- It was a method instruction with an invalid alias, parameters, or targets;
- It was not possible to be written to the given tablature.

Because of that, you should check the result of the `writeOnTab` method call to determine whether it was a successfully written instruction or a failed one.

Below, an example of the result for a **successfully** written instruction:

```js
const { Parser, Tab } = require('tablab');

const tab = new Tab();
const parser = new Parser();

const parsedInstruction = parser.parseOne('1-0');
const writeResult = parsedInstruction.writeOnTab(tab);

console.log(writeResult);
```

outputs

```
{
  failureReasonIdentifier: null,
  failureMessage: null
  success: true,
}
```

Below, an example of the result for a **failed** written one:

```js
const { Parser, Tab } = require('tablab');

const tab = new Tab();
const parser = new Parser();

const parsedInstruction = parser.parseOne('1'); // Basic instruction without the fret indication
const writeResult = parsedInstruction.writeOnTab(tab);

console.log(writeResult);
```

outputs

```
{
  failureReasonIdentifier: "BASIC_INSTRUCTION_INVALID",
  failureMessage: "Invalid basic instruction",
  success: false
}
```

The field `success` indicates whether the instruction was successfully written to the tablature (`true`) or not (`false`). The fields `failureReasonIdentifier` and `failureMessage` can be used to identify the failure reason. The former uniquely identifies a failure reason.

The list with all possible failure reasons can be verified [here](../instruction/failure-reasons.md).

## Parser options

The following options can be set to customize your tablature:

- [Mapped method instructions](#mapped-method-instructions);
- [Enclosure type for method instructions arguments](#enclosure-type-for-method-instructions-arguments);
- [Enclosure type for method instructions targets](#enclosure-type-for-method-instructions-targets).

### Mapped method instructions

The [available method instructions section](#available-method-instructions) lists the default method instructions that can be read by the parser. This list can be customized to [disable method instructions](#disabling-method-instructions), [change its aliases](#changing-the-alias-of-method-instructions) and [add new ones](#adding-new-aliases-for-method-instructions) to use them.

The `methodInstructionAlias2IdentifierMap` option is used to perform these customizations. Its value is an object where each key is an alias, and the associated value is the [method instruction identifier](#method-instructions-identifiers) mapped for it.

Its default value, indicated below, results in the mapping described in the [available method instructions section](#available-method-instructions).

```
{
  break: MethodInstructionIdentifier.Break,
  footer: MethodInstructionIdentifier.Footer,
  header: MethodInstructionIdentifier.Header,
  merge: MethodInstructionIdentifier.Merge,
  repeat: MethodInstructionIdentifier.Repeat,
  spacing: MethodInstructionIdentifier.Spacing
}
```

#### Method instructions identifiers

Each one of the method instructions described in the [available method instructions section](#available-method-instructions) has a unique string identifier. The `MethodInstructionIdentifier` enumerator can be used for easy access to the method instructions identifiers. Below, the identifier of each method instruction and the corresponding member value of the `MethodInstructionIdentifier` enumerator:

|           Method Instruction           | Method Instruction Identifier | `MethodInstructionIdentifier` Member |
| :------------------------------------: | :---------------------------: | :----------------------------------: |
|   [Break](#method-instruction-break)   |            `Break`            |               `Break`                |
|  [Footer](#method-instruction-footer)  |           `Footer`            |               `Footer`               |
|  [Header](#method-instruction-header)  |           `Header`            |               `Header`               |
|   [Merge](#method-instruction-merge)   |            `Merge`            |               `Merge`                |
|  [Repeat](#method-instruction-repeat)  |           `Repeat`            |               `Repeat`               |
| [Spacing](#method-instruction-spacing) |           `Spacing`           |              `Spacing`               |

The `MethodInstructionIdentifier` enumerator is available to be required, as indicated below:

```js
const { MethodInstructionIdentifier } = require('tablab');
```

#### Disabling method instructions

One of the use cases of the `methodInstructionAlias2IdentifierMap` option is to disable the parser to identify some method instructions.

In the following example, the parser is set to read the [repeat instruction](#method-instruction-repeat) only, under the alias `repeat`. The other aliases described in the [available method instructions section](#available-method-instructions) are disabled, resulting in unidentified method instructions.

```js
const { Parser, Tab, MethodInstructionIdentifier } = require('tablab');

const tab = new Tab();
const parser = new Parser({
  methodInstructionAlias2IdentifierMap: {
    repeat: MethodInstructionIdentifier.Repeat, // maps only the repeat instruction under the alias "repeat"
  },
});

const instructions = 'header(Example) repeat(2){ 1-0 2-0 } merge { 1-0 2-0 }';

parser.parseAll(instructions).forEach((parsedInstruction) => {
  const writeResult = parsedInstruction.writeOnTab(tab);

  if (!writeResult.success) {
    console.log(
      `Failed to write instruction < ${parsedInstruction.value} > at position ` +
        `${parsedInstruction.readFromIndex}. ${writeResult.failureMessage} ` +
        `(${writeResult.failureReasonIdentifier})`
    );
  }
});

console.log(tab.format(50));
```

outputs

```
Failed to write instruction < header(Example) > at position 0. Unidentified method instruction for alias "header" (UNIDENTIFIED_METHOD_INSTRUCTION)
Failed to write instruction < merge { 1-0 2-0 } > at position 37. Unidentified method instruction for alias "merge" (UNIDENTIFIED_METHOD_INSTRUCTION)
[
  [
    '                                                  ',
    '---0-------0--------------------------------------',
    '-------0-------0----------------------------------',
    '--------------------------------------------------',
    '--------------------------------------------------',
    '--------------------------------------------------',
    '--------------------------------------------------',
    '                                                  '
  ]
]
```

#### Changing the alias of method instructions

The `methodInstructionAlias2IdentifierMap` option can also be used to change the alias used for each method instruction.

In the following example, the parser is set to read the [repeat instruction](#method-instruction-repeat) under the alias `r` instead of the default `repeat` alias.

```js
const { Parser, Tab, MethodInstructionIdentifier } = require('tablab');

const tab = new Tab();

// copies the default mapping
const customAlias2IdentifierMap = Object.assign(
  {},
  Parser.DEFAULT_METHOD_INSTRUCTION_ALIAS_2_IDENTIFIER_MAP
);

delete customAlias2IdentifierMap.repeat; // removes the mapping for the alias "repeat"
customAlias2IdentifierMap.r = MethodInstructionIdentifier.Repeat; // maps the repeat instruction under the alias "r"

const parser = new Parser({
  methodInstructionAlias2IdentifierMap: customAlias2IdentifierMap,
});

const instructions = 'repeat(2){ 1-0 2-0 } r(2){ 1-0 2-0 }';

parser.parseAll(instructions).forEach((parsedInstruction) => {
  const writeResult = parsedInstruction.writeOnTab(tab);

  if (!writeResult.success) {
    console.log(
      `Failed to write instruction < ${parsedInstruction.value} > at position ` +
        `${parsedInstruction.readFromIndex}. ${writeResult.failureMessage} ` +
        `(${writeResult.failureReasonIdentifier})`
    );
  }
});

console.log(tab.format(50));
```

outputs

```
Failed to write instruction < repeat(2){ 1-0 2-0 } > at position 0. Unidentified method instruction for alias "repeat" (UNIDENTIFIED_METHOD_INSTRUCTION)
[
  [
    '                                                  ',
    '---0-------0--------------------------------------',
    '-------0-------0----------------------------------',
    '--------------------------------------------------',
    '--------------------------------------------------',
    '--------------------------------------------------',
    '--------------------------------------------------',
    '                                                  '
  ]
]
```

#### Adding new aliases for method instructions

Another use case of the `methodInstructionAlias2IdentifierMap` option is to add new custom aliases for the available method instructions.

In the following example, the parser is set to read all the predefined aliases as described in the [available method instructions section](#available-method-instructions) but with one difference: It can also read the [repeat instruction](#method-instruction-repeat) under the alias `r`, besides the default `repeat` alias.

```js
const { Parser, Tab, MethodInstructionIdentifier } = require('tablab');

const tab = new Tab();
const parser = new Parser({
  methodInstructionAlias2IdentifierMap: {
    ...Parser.DEFAULT_METHOD_INSTRUCTION_ALIAS_2_IDENTIFIER_MAP, // extends the default mapping
    r: MethodInstructionIdentifier.Repeat, // maps the repeat instruction under the alias "r"
  },
});

const instructions = 'repeat(2){ 1-5 2-5 } r(2){ 1-0 2-0 }';

parser.parseAll(instructions).forEach((parsedInstruction) => {
  const writeResult = parsedInstruction.writeOnTab(tab);

  if (!writeResult.success) {
    console.log(
      `Failed to write instruction < ${parsedInstruction.value} > at position ` +
        `${parsedInstruction.readFromIndex}. ${writeResult.failureMessage} ` +
        `(${writeResult.failureReasonIdentifier})`
    );
  }
});

console.log(tab.format(50));
```

outputs

```
[
  [
    '                                                  ',
    '---5-------5-------0-------0----------------------',
    '-------5-------5-------0-------0------------------',
    '--------------------------------------------------',
    '--------------------------------------------------',
    '--------------------------------------------------',
    '--------------------------------------------------',
    '                                                  '
  ]
]
```

### Enclosure type for method instructions arguments

As indicated in the [method instructions definition section](#method-instructions), the arguments of method instructions must be given inside enclosures. The `methodInstructionArgsEnclosure` option can be used to specify which type of enclosure should be used to identify the method instructions arguments. Its value must be a member of the `Enclosure` enumerator and must not have the same value indicated for the [enclosure type for the method instructions targets](#enclosure-type-for-method-instructions-targets) option. Below, a description of the available members of the `Enclosure` enumerator and its effect on the argument's representation:

| Enclosure Enumerator Member | Method Instruction Arguments Representation |
| :-------------------------: | :-----------------------------------------: |
|       `AngleBrackets`       |                `< ...args >`                |
|       `CurlyBrackets`       |                `{ ...args }`                |
|       `RoundBrackets`       |                `( ...args )`                |
|      `SquareBrackets`       |                `[ ...args ]`                |
|        `Parentheses`        |                `( ...args )`                |

Its default value is set to `Parentheses`.

In the following example, the parser is set to read the arguments of method instructions from within `SquareBrackets` enclosures:

```js
const { Parser, Enclosure } = require('tablab');

const parser = new Parser({
  methodInstructionArgsEnclosure: Enclosure.SquareBrackets,
});

const parsedInstruction = parser.parseOne('repeat [ 3 ] { 1-0 2-0 }');
```

### Enclosure type for method instructions targets

As indicated in the [method instructions definition section](#method-instructions), the targets of method instructions must be given inside enclosures. The `methodInstructionTargetsEnclosure` option can be used to specify which type of enclosure should be used to identify the method instructions targets. Its value must be a member of the `Enclosure` enumerator and must not have the same value indicated for the [enclosure type for the method instructions arguments](#enclosure-type-for-method-instructions-arguments) option. Below, a description of the available members of the `Enclosure` enumerator and its effect on the target's representation:

| Enclosure Enumerator Member | Method Instruction Targets Representation |
| :-------------------------: | :---------------------------------------: |
|       `AngleBrackets`       |             `< ...targets >`              |
|       `CurlyBrackets`       |             `{ ...targets }`              |
|       `RoundBrackets`       |             `( ...targets )`              |
|      `SquareBrackets`       |             `[ ...targets ]`              |
|        `Parentheses`        |             `( ...targets )`              |

Its default value is set to `CurlyBrackets`.

In the following example, the parser is set to read the targets of method instructions from within `AngleBrackets` enclosures:

```js
const { Parser, Enclosure } = require('tablab');

const parser = new Parser({
  methodInstructionTargetsEnclosure: Enclosure.AngleBrackets,
});

const parsedInstruction = parser.parseOne('repeat ( 3 ) < 1-0 2-0 >');
```

## Parser Methods

A parser instance exposes the following methods to parse the instructions from a text input of instructions:

- [Parse one](#parse-one-instruction);
- [Parse one (async)](#parse-one-instruction-async);
- [Parse all](#parse-all-instructions);
- [Parse all (async)](#parse-all-instructions-async).

### Parse one instruction

The `parseOne` method is responsible for parsing only the first instruction from a text input of instructions.

```js
const { Parser } = require('tablab');

const parser = new Parser();

const parsedInstruction = parser.parseOne('1-0');
```

#### Parse one instruction (async)

The `parseOneAsync` method is the asynchronous implementation of the `parseOne` method. It returns a `Promise` that will resolve to the parsed instruction.

```js
const { Parser } = require('tablab');

const parser = new Parser();

parser.parseOneAsync('1-0').then((parsedInstruction) => {
  // handle parsed instruction
});
```

### Parse all instructions

The `parseAll` method is responsible for parsing all the instructions from a text input of instructions, returning an array of parsed instructions.

```js
const { Parser } = require('tablab');

const parser = new Parser();

const instructions = '1-0 2-0 break 3-0 4-0 break 5-0 6-0';

const parsedInstructions = parser.parseAll(instructions);

parsedInstructions.forEach((parsedInstruction) => {
  // handle parsed instructions
});
```

#### Parse all instructions (async)

The `parseAllAsync` method is the asynchronous implementation of the `parseAll` method. It returns a `Promise` that will resolve to the array of parsed instructions.

```js
const { Parser } = require('tablab');

const parser = new Parser();

const instructions = '1-0 2-0 break 3-0 4-0 break 5-0 6-0';

parser.parseAllAsync(instructions).then((parsedInstructions) => {
  parsedInstructions.forEach((parsedInstruction) => {
    // handle parsed instructions
  });
});
```
