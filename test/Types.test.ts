import { ExprType } from "../src/type/ExprType.js";
import { Type, Types } from "../src/type/Types.js";

describe.each([
  [Type.NUMERIC, Type.ANY, false, false, true, true],
  [Type.NUMERIC, Type.NUMERIC, false, true, false, true],
  [Type.NUMERIC, Type.STRING, false, false, false, false],
  [Types.or(Type.NUMERIC, Type.STRING), Type.STRING, true, false, false, true],
  [Types.or(Type.NUMERIC, Type.STRING), Type.NUMERIC, true, false, false, true],
  [
    Types.or(Type.NUMERIC, Type.STRING),
    Types.or(Type.NUMERIC, Type.STRING),
    false,
    true,
    false,
    true,
  ],
  [
    Types.or(Type.NUMERIC, Type.STRING),
    Types.or(Type.STRING, Type.NUMERIC),
    false,
    true,
    false,
    true,
  ],
  [
    Types.or(Type.NUMERIC, Type.STRING, Type.BOOLEAN),
    Types.or(Type.STRING, Type.NUMERIC),
    true,
    false,
    false,
    true,
  ],
  [Type.IFC_OBJECT_REF, Type.IFC_PROPERTY_REF, true, false, false, true],
  [
    Types.or(Type.IFC_PROPERTY_REF, Type.IFC_PROPERTY_SET_REF),
    Type.IFC_TYPE_OBJECT_REF,
    false,
    false,
    false,
    false,
  ],
  [
    Types.or(Type.IFC_PROPERTY_REF, Type.IFC_PROPERTY_SET_REF),
    Type.IFC_OBJECT_REF,
    false,
    false,
    true,
    true,
  ],
  [
    Types.or(Type.IFC_PROPERTY_REF, Type.IFC_PROPERTY_SET_REF),
    Types.or(Type.IFC_TYPE_OBJECT_REF, Type.IFC_PROPERTY_REF),
    false,
    false,
    false,
    true,
  ],
  [
    Types.array(Type.STRING),
    Types.array(Type.STRING),
    false,
    true,
    false,
    true,
  ],
  [
    Types.array(Type.IFC_PROPERTY_REF),
    Types.array(Type.IFC_OBJECT_REF),
    false,
    false,
    true,
    true,
  ],
  [
    Types.tuple(Type.STRING, Type.NUMERIC),
    Types.tuple(Type.STRING, Type.NUMERIC),
    false,
    true,
    false,
    true,
  ],
  [
    Types.tuple(Type.IFC_PROPERTY_REF, Type.IFC_PROPERTY_REF),
    Types.tuple(Type.IFC_OBJECT_REF, Type.IFC_OBJECT_REF),
    false,
    false,
    true,
    true,
  ],
  [
    Types.tuple(
      Types.tuple(Type.STRING, Type.STRING),
      Types.tuple(Type.STRING, Type.STRING),
      Types.tuple(Type.STRING, Type.STRING)
    ),
    Types.array(Types.or(Types.tuple(Type.STRING, Type.STRING))),
    false,
    false,
    true,
    true,
  ],
  [
    Types.tuple(
      Types.tuple(Type.STRING, Type.STRING),
      Types.tuple(Type.STRING, Type.STRING),
      Types.tuple(Type.STRING, Type.STRING)
    ),
    Types.array(Types.tuple(Type.STRING, Type.STRING)),
    false,
    false,
    true,
    true,
  ],
])(
  "checking isSuperTypeOf",
  (
    left: ExprType,
    right: ExprType,
    resultSuper,
    resultSame,
    resultSub,
    resultOverlap: boolean
  ) => {
    it(`${left.getName()}.isSuperTypeOf(${right.getName()}) = ${resultSuper}`, () => {
      expect(left.isSuperTypeOf(right)).toBe(resultSuper);
    });
    it(`${left.getName()}.isSameTypeAs(${right.getName()}) = ${resultSame}`, () => {
      expect(left.isSameTypeAs(right)).toBe(resultSame);
    });
    it(`${left.getName()}.isSubTypeOf(${right.getName()}) = ${resultSub}`, () => {
      expect(left.isSubTypeOf(right)).toBe(resultSub);
    });
    it(`${left.getName()}.overlapsWith(${right.getName()}) = ${resultOverlap}`, () => {
      expect(left.overlapsWith(right)).toBe(resultOverlap);
    });
  }
);
