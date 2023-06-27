import { Expr } from "../Expr.js";
import { ObjectAccessor } from "../../context/ObjectAccessor.js";

export interface ObjectReferenceExpr extends Expr<ObjectAccessor> {}
