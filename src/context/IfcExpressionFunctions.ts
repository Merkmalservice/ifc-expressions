export class IfcExpressionFunctions {
  /*
    public static applyFunction(name: string, functionArgs: Array<LiteralValueAnyArity>): LiteralValueAnyArity{
        
    }
    
    
    
    
}

const builtinFunctions = new Map<string, Func>();

class IfcExpressionFunctionConfigException extends Error {
    constructor(message: string) {
        super(message)
    }
}

abstract class Func {
    protected name: string;
    protected formalArguments: FuncArgs;
    
    constructor(name: string, args: FuncArgs) {
        this.name = name;
        this.formalArguments = args;
        if (isNullish(this.name)){
            throw new IfcExpressionFunctionConfigException("Function must have a name");
        }
        if (! Array.isArray(this.formalArguments)){
            throw new IfcExpressionFunctionConfigException("Formal function arguments is not an array");
        }
    }

    protected evaluate(funcArgs: Array<LiteralValueAnyArity>): LiteralValueAnyArity {
    }
}

abstract class FuncArg {
    protected _required: boolean;
    protected _name: string;

    constructor(required: boolean, name: string, value: LiteralValueAnyArity) {
        this._required = required;
        this._name = name;
    }

    abstract getValue(callArgument: LiteralValueAnyArity);
    
    get required(): boolean {
        return this._required;
    }

    get name(): string {
        return this._name;
    }
    
}

class FuncArgs {
    private args: Array<FuncArg>

    constructor(args: Array<FuncArg>) {
        this.args = args;
        let optionalArgsReached: boolean = false;
        for (let i = 0; i < this.args.length; i++) {
            if (optionalArgsReached){
                if (this.args[i].required){
                    throw new IfcExpressionFunctionConfigException(`Optional arguments must follow required ones. Argument '${this.args[i].name}' is required but follows an optional one`);
                }
            } else {
                if (!this.args[i].required) {
                    optionalArgsReached = true;
                }
            }
        }
    }

    public getArgumentValues(provided: Array<LiteralValueAnyArity>): Array<LiteralValueAnyArity> {
        const result = [];
        const numProvided = provided.length;
        if (!isNullish(this.args) ) {
            let j = 0;
            for (let i = 0; i < this.args.length; i++) {
                const currentArg: FuncArg = this.args[i];
                if (numProvided > i ) {
                    result.push(currentArg.getValue(provided[i]));
                } else {
                    if (currentArg.required){
                        throw new IfcExpressionEvaluationException(`Required argument ${currentArg.name} is missing`);
                    }
                }
            }
        }
        return result;
    }
}

class FuncMap extends Func {
    
    
    public evaluate(funcArgs): LiteralValueAnyArity{
        const input = LiteralValue, 
            const mappings: Array<Array<LiteralValue>>, defaultValue: LiteralValue
        if (isNullish(mappings)) {
            this.throwMappingsException(mappings);
        }
        if (mappings.length !== 2){
            this.throwMappingsException(mappings);
        }
        if (mappings[0].length !== mappings[1].length){
            this.throwMappingsException(mappings)
        }
        if (isNullish(input)){
            return defaultValue;
        }
        const firstMatch = mappings.find(m => m[0] === input);
        if (isNullish(firstMatch)){
            return defaultValue;
        }
        return firstMatch[1];
    }

    private static throwMappingsException(mappings: Array<Array<LiteralValue>>) {
        throw new IfcExpressionEvaluationException(`Argument 'mappings' must be an 2xN matrix. This does not qualify: ${JSON.stringify(mappings)}`);
    }

     */
}
