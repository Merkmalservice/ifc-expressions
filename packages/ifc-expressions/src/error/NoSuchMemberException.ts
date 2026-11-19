import { ValidationException } from "./ValidationException.js";

export class NoSuchMemberException extends ValidationException {
  readonly memberName: string;
  readonly type: string;

  constructor(memberName: string, type: string, ctx) {
    super(`No member ${memberName} found for type ${type}`, ctx);
    this.memberName = memberName;
    this.type = type;
  }
}
