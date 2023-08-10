import { TextSpan } from "../src/util/TextSpan.js";

describe.each([
  ["abc abc abc", 1, 5, 1, 7, "abc abc abc\n    ~~~"],
  ["abc\nabc\nabc", 1, 2, 3, 2, "abc\n ~~\nabc\n~~~\nabc\n~~"],
  ["abc\nabc\nabc", 1, 1, 1, 3, "abc\n~~~\nabc\nabc"],
  ["abc\nabc\nabc", 2, 1, 2, 2, "abc\nabc\n~~\nabc"],
  [
    "SWITCH(\n" + "   [\n" + "     ['a',1],\n" + "     ['b',2]],\n" + "0)",
    2,
    3,
    4,
    13,
    "SWITCH(\n" +
      "   [\n" +
      "  ~~\n" +
      "     ['a',1],\n" +
      "~~~~~~~~~~~~~\n" +
      "     ['b',2]],\n" +
      "~~~~~~~~~~~~~\n" +
      "0)",
  ],
])(
  "underline ",
  (input, fromLine, fromColumn, toLine, toColumn, expectedResult) => {
    const span = TextSpan.of(fromLine, fromColumn, toLine, toColumn);

    it(`underline ${input} at ${span.toString()}`, () => {
      expect(span.underline(input)).toBe(expectedResult);
    });
  }
);
