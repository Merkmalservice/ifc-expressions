import { BooleanValue } from "../src/value/BooleanValue.js";
import { isNullish } from "../src/util/IfcExpressionUtils.js";
import { Logical, LogicalValue } from "../src/value/LogicalValue.js";
import { Value } from "../src/value/Value.js";
import { ExpressionValue } from "../src/IfcExpression.js";

function p(val: Value<any> | Logical): string {
  if (isNullish(val)) {
    return "";
  }
  if (val === true || val === false || LogicalValue.isUnknown(val)) {
    return "" + val;
  }
  if (typeof val["getValue"] === "function") {
    return "" + (val as Value<any>).getValue();
  } else if (typeof val["name"] !== undefined) {
    return "" + val["name"];
  } else if (typeof val.constructor != undefined) {
    return val.constructor.name;
  } else {
    return "" + val;
  }
}

function testName(left: any, right: any, method: any, result: any) {
  if (!isNullish(left) && !isNullish(method) && !isNullish(result)) {
    return p(left) + "." + p(method) + "(" + p(right) + ") = " + p(result);
  }
}

const logicalInst = LogicalValue.true();
const boolInst = BooleanValue.true();

describe.each([
  [BooleanValue, BooleanValue.true, null, BooleanValue.true()],
  [BooleanValue, BooleanValue.false, null, BooleanValue.false()],

  [BooleanValue.true(), boolInst.not, null, BooleanValue.false()],
  [BooleanValue.false(), boolInst.not, null, BooleanValue.true()],

  [BooleanValue.true(), boolInst.and, BooleanValue.true(), BooleanValue.true()],
  [
    BooleanValue.true(),
    boolInst.and,
    BooleanValue.false(),
    BooleanValue.false(),
  ],
  [
    BooleanValue.false(),
    boolInst.and,
    BooleanValue.true(),
    BooleanValue.false(),
  ],
  [
    BooleanValue.false(),
    boolInst.and,
    BooleanValue.false(),
    BooleanValue.false(),
  ],

  [BooleanValue.true(), boolInst.or, BooleanValue.true(), BooleanValue.true()],
  [BooleanValue.true(), boolInst.or, BooleanValue.false(), BooleanValue.true()],
  [BooleanValue.false(), boolInst.or, BooleanValue.true(), BooleanValue.true()],
  [
    BooleanValue.false(),
    boolInst.or,
    BooleanValue.false(),
    BooleanValue.false(),
  ],

  [
    BooleanValue.true(),
    boolInst.xor,
    BooleanValue.true(),
    BooleanValue.false(),
  ],
  [
    BooleanValue.true(),
    boolInst.xor,
    BooleanValue.false(),
    BooleanValue.true(),
  ],
  [
    BooleanValue.false(),
    boolInst.xor,
    BooleanValue.true(),
    BooleanValue.true(),
  ],
  [
    BooleanValue.false(),
    boolInst.xor,
    BooleanValue.false(),
    BooleanValue.false(),
  ],

  [
    BooleanValue.true(),
    boolInst.implies,
    BooleanValue.true(),
    BooleanValue.true(),
  ],
  [
    BooleanValue.true(),
    boolInst.implies,
    BooleanValue.false(),
    BooleanValue.false(),
  ],
  [
    BooleanValue.false(),
    boolInst.implies,
    BooleanValue.true(),
    BooleanValue.true(),
  ],
  [
    BooleanValue.false(),
    boolInst.implies,
    BooleanValue.false(),
    BooleanValue.true(),
  ],

  [LogicalValue, LogicalValue.true, null, LogicalValue.true()],
  [LogicalValue, LogicalValue.false, null, LogicalValue.false()],

  [LogicalValue.true(), logicalInst.not, null, LogicalValue.false()],
  [LogicalValue.false(), logicalInst.not, null, LogicalValue.true()],

  [
    LogicalValue.true(),
    logicalInst.and,
    LogicalValue.true(),
    LogicalValue.true(),
  ],
  [
    LogicalValue.true(),
    logicalInst.and,
    LogicalValue.false(),
    LogicalValue.false(),
  ],
  [
    LogicalValue.true(),
    logicalInst.and,
    LogicalValue.unknown(),
    LogicalValue.unknown(),
  ],
  [
    LogicalValue.false(),
    logicalInst.and,
    LogicalValue.true(),
    LogicalValue.false(),
  ],
  [
    LogicalValue.false(),
    logicalInst.and,
    LogicalValue.false(),
    LogicalValue.false(),
  ],
  [
    LogicalValue.false(),
    logicalInst.and,
    LogicalValue.unknown(),
    LogicalValue.false(),
  ],
  [
    LogicalValue.unknown(),
    logicalInst.and,
    LogicalValue.true(),
    LogicalValue.unknown(),
  ],
  [
    LogicalValue.unknown(),
    logicalInst.and,
    LogicalValue.false(),
    LogicalValue.false(),
  ],
  [
    LogicalValue.unknown(),
    logicalInst.and,
    LogicalValue.unknown(),
    LogicalValue.unknown(),
  ],

  [
    LogicalValue.true(),
    logicalInst.or,
    LogicalValue.true(),
    LogicalValue.true(),
  ],
  [
    LogicalValue.true(),
    logicalInst.or,
    LogicalValue.false(),
    LogicalValue.true(),
  ],
  [
    LogicalValue.true(),
    logicalInst.or,
    LogicalValue.unknown(),
    LogicalValue.true(),
  ],
  [
    LogicalValue.false(),
    logicalInst.or,
    LogicalValue.true(),
    LogicalValue.true(),
  ],
  [
    LogicalValue.false(),
    logicalInst.or,
    LogicalValue.false(),
    LogicalValue.false(),
  ],
  [
    LogicalValue.false(),
    logicalInst.or,
    LogicalValue.unknown(),
    LogicalValue.unknown(),
  ],
  [
    LogicalValue.unknown(),
    logicalInst.or,
    LogicalValue.true(),
    LogicalValue.true(),
  ],
  [
    LogicalValue.unknown(),
    logicalInst.or,
    LogicalValue.false(),
    LogicalValue.unknown(),
  ],
  [
    LogicalValue.unknown(),
    logicalInst.or,
    LogicalValue.unknown(),
    LogicalValue.unknown(),
  ],

  [
    LogicalValue.true(),
    logicalInst.xor,
    LogicalValue.true(),
    LogicalValue.false(),
  ],
  [
    LogicalValue.true(),
    logicalInst.xor,
    LogicalValue.false(),
    LogicalValue.true(),
  ],
  [
    LogicalValue.true(),
    logicalInst.xor,
    LogicalValue.unknown(),
    LogicalValue.unknown(),
  ],
  [
    LogicalValue.false(),
    logicalInst.xor,
    LogicalValue.true(),
    LogicalValue.true(),
  ],
  [
    LogicalValue.false(),
    logicalInst.xor,
    LogicalValue.false(),
    LogicalValue.false(),
  ],
  [
    LogicalValue.false(),
    logicalInst.xor,
    LogicalValue.unknown(),
    LogicalValue.unknown(),
  ],
  [
    LogicalValue.unknown(),
    logicalInst.xor,
    LogicalValue.true(),
    LogicalValue.unknown(),
  ],
  [
    LogicalValue.unknown(),
    logicalInst.xor,
    LogicalValue.false(),
    LogicalValue.unknown(),
  ],
  [
    LogicalValue.unknown(),
    logicalInst.xor,
    LogicalValue.unknown(),
    LogicalValue.unknown(),
  ],

  [
    LogicalValue.true(),
    logicalInst.implies,
    LogicalValue.true(),
    LogicalValue.true(),
  ],
  [
    LogicalValue.true(),
    logicalInst.implies,
    LogicalValue.false(),
    LogicalValue.false(),
  ],
  [
    LogicalValue.true(),
    logicalInst.implies,
    LogicalValue.unknown(),
    LogicalValue.unknown(),
  ],
  [
    LogicalValue.false(),
    logicalInst.implies,
    LogicalValue.true(),
    LogicalValue.true(),
  ],
  [
    LogicalValue.false(),
    logicalInst.implies,
    LogicalValue.false(),
    LogicalValue.true(),
  ],
  [
    LogicalValue.false(),
    logicalInst.implies,
    LogicalValue.unknown(),
    LogicalValue.true(),
  ],
  [
    LogicalValue.unknown(),
    logicalInst.implies,
    LogicalValue.true(),
    LogicalValue.true(),
  ],
  [
    LogicalValue.unknown(),
    logicalInst.implies,
    LogicalValue.false(),
    LogicalValue.unknown(),
  ],
  [
    LogicalValue.unknown(),
    logicalInst.implies,
    LogicalValue.unknown(),
    LogicalValue.unknown(),
  ],

  // Boolean -> logical

  [BooleanValue.true(), boolInst.and, LogicalValue.true(), LogicalValue.true()],
  [
    BooleanValue.true(),
    boolInst.and,
    LogicalValue.false(),
    LogicalValue.false(),
  ],
  [
    BooleanValue.true(),
    boolInst.and,
    LogicalValue.unknown(),
    LogicalValue.unknown(),
  ],
  [
    BooleanValue.false(),
    boolInst.and,
    LogicalValue.true(),
    LogicalValue.false(),
  ],
  [
    BooleanValue.false(),
    boolInst.and,
    LogicalValue.false(),
    LogicalValue.false(),
  ],
  [
    BooleanValue.false(),
    boolInst.and,
    LogicalValue.unknown(),
    LogicalValue.false(),
  ],

  [BooleanValue.true(), boolInst.or, LogicalValue.true(), LogicalValue.true()],
  [BooleanValue.true(), boolInst.or, LogicalValue.false(), LogicalValue.true()],
  [
    BooleanValue.true(),
    boolInst.or,
    LogicalValue.unknown(),
    LogicalValue.true(),
  ],
  [BooleanValue.false(), boolInst.or, LogicalValue.true(), LogicalValue.true()],
  [
    BooleanValue.false(),
    boolInst.or,
    LogicalValue.false(),
    LogicalValue.false(),
  ],
  [
    BooleanValue.false(),
    boolInst.or,
    LogicalValue.unknown(),
    LogicalValue.unknown(),
  ],

  [
    BooleanValue.true(),
    boolInst.xor,
    LogicalValue.true(),
    LogicalValue.false(),
  ],
  [
    BooleanValue.true(),
    boolInst.xor,
    LogicalValue.false(),
    LogicalValue.true(),
  ],
  [
    BooleanValue.true(),
    boolInst.xor,
    LogicalValue.unknown(),
    LogicalValue.unknown(),
  ],
  [
    BooleanValue.false(),
    boolInst.xor,
    LogicalValue.true(),
    LogicalValue.true(),
  ],
  [
    BooleanValue.false(),
    boolInst.xor,
    LogicalValue.false(),
    LogicalValue.false(),
  ],
  [
    BooleanValue.false(),
    boolInst.xor,
    LogicalValue.unknown(),
    LogicalValue.unknown(),
  ],

  [
    BooleanValue.true(),
    boolInst.implies,
    LogicalValue.true(),
    LogicalValue.true(),
  ],
  [
    BooleanValue.true(),
    boolInst.implies,
    LogicalValue.false(),
    LogicalValue.false(),
  ],
  [
    BooleanValue.true(),
    boolInst.implies,
    LogicalValue.unknown(),
    LogicalValue.unknown(),
  ],
  [
    BooleanValue.false(),
    boolInst.implies,
    LogicalValue.true(),
    LogicalValue.true(),
  ],
  [
    BooleanValue.false(),
    boolInst.implies,
    LogicalValue.false(),
    LogicalValue.true(),
  ],
  [
    BooleanValue.false(),
    boolInst.implies,
    LogicalValue.unknown(),
    LogicalValue.true(),
  ],

  // Logical -> boolean

  [
    LogicalValue.true(),
    logicalInst.and,
    BooleanValue.true(),
    LogicalValue.true(),
  ],
  [
    LogicalValue.true(),
    logicalInst.and,
    BooleanValue.false(),
    LogicalValue.false(),
  ],
  [
    LogicalValue.false(),
    logicalInst.and,
    BooleanValue.true(),
    LogicalValue.false(),
  ],
  [
    LogicalValue.false(),
    logicalInst.and,
    BooleanValue.false(),
    LogicalValue.false(),
  ],
  [
    LogicalValue.unknown(),
    logicalInst.and,
    BooleanValue.true(),
    LogicalValue.unknown(),
  ],
  [
    LogicalValue.unknown(),
    logicalInst.and,
    BooleanValue.false(),
    LogicalValue.false(),
  ],

  [
    LogicalValue.true(),
    logicalInst.or,
    BooleanValue.true(),
    LogicalValue.true(),
  ],
  [
    LogicalValue.true(),
    logicalInst.or,
    BooleanValue.false(),
    LogicalValue.true(),
  ],
  [
    LogicalValue.false(),
    logicalInst.or,
    BooleanValue.true(),
    LogicalValue.true(),
  ],
  [
    LogicalValue.false(),
    logicalInst.or,
    BooleanValue.false(),
    LogicalValue.false(),
  ],
  [
    LogicalValue.unknown(),
    logicalInst.or,
    BooleanValue.true(),
    LogicalValue.true(),
  ],
  [
    LogicalValue.unknown(),
    logicalInst.or,
    BooleanValue.false(),
    LogicalValue.unknown(),
  ],

  [
    LogicalValue.true(),
    logicalInst.xor,
    BooleanValue.true(),
    LogicalValue.false(),
  ],
  [
    LogicalValue.true(),
    logicalInst.xor,
    BooleanValue.false(),
    LogicalValue.true(),
  ],
  [
    LogicalValue.false(),
    logicalInst.xor,
    BooleanValue.true(),
    LogicalValue.true(),
  ],
  [
    LogicalValue.false(),
    logicalInst.xor,
    BooleanValue.false(),
    LogicalValue.false(),
  ],
  [
    LogicalValue.unknown(),
    logicalInst.xor,
    BooleanValue.true(),
    LogicalValue.unknown(),
  ],
  [
    LogicalValue.unknown(),
    logicalInst.xor,
    BooleanValue.false(),
    LogicalValue.unknown(),
  ],

  [
    LogicalValue.true(),
    logicalInst.implies,
    BooleanValue.true(),
    LogicalValue.true(),
  ],
  [
    LogicalValue.true(),
    logicalInst.implies,
    BooleanValue.false(),
    LogicalValue.false(),
  ],
  [
    LogicalValue.false(),
    logicalInst.implies,
    BooleanValue.true(),
    LogicalValue.true(),
  ],
  [
    LogicalValue.false(),
    logicalInst.implies,
    BooleanValue.false(),
    LogicalValue.true(),
  ],
  [
    LogicalValue.unknown(),
    logicalInst.implies,
    BooleanValue.true(),
    LogicalValue.true(),
  ],
  [
    LogicalValue.unknown(),
    logicalInst.implies,
    BooleanValue.false(),
    LogicalValue.unknown(),
  ],
])("check", (left, method, right, result) => {
  test(testName(left, right, method, result), () => {
    if (isNullish(right)) {
      expect(method.call(left)).toStrictEqual(result);
    } else {
      expect(method.call(left, right)).toStrictEqual(result);
    }
  });
});
