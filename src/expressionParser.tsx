type CalculationType =
{
    name : string;
    expression : string;
};

enum Associativity
{
    Left,
    Right,
};

type Operator = 
{
    symbol : string;
    precedence : number;
    associativity : Associativity;
};

const operators : Operator[] = 
[
    {symbol : "+", precedence : 2, associativity : Associativity.Left},
    {symbol : "-", precedence : 2, associativity : Associativity.Left},
    {symbol : "*", precedence : 3, associativity : Associativity.Left},
    {symbol : "/", precedence : 3, associativity : Associativity.Left},
    {symbol : "^", precedence : 4, associativity : Associativity.Right},
]

console.log(expressionToRPN("12 + 4 * ( 3 - 1 )"));
console.log("");
console.log(expressionToRPN("50 + b * ( c ^ 2 - e )"));

// split string at spaces into a list of strings
// Need to create a stack/queue - do with arrays and pop/pus

function isSpace(element : string) : boolean
// Checks if an elements is a space or a blank string
{
    if(element == " " || element == "")
    {
        return false;
    }
    
    return true;
}

function isOperator(value : string) : boolean
{
    let ret : boolean = false;

    Object.values(operators).forEach(operator =>
    {
        if(operator.symbol === value)
        {
            ret = true
            return;
        }

    }
    );

    return ret;
}

function toOperator(value : string) : Operator
{
    let ret : Operator = 
    {
        symbol : "",
        precedence : 0,
        associativity : Associativity.Right
    };

    Object.values(operators).forEach(operator =>
    {
        if(operator.symbol == value)
        {
            ret = operator;
            return;
        }
    }
    );

    return ret;
}

function precFromStr(op : string) : number
{
    return (toOperator(op)).precedence;
}

function AssocFromStr(op : string) : Associativity
{
    return (toOperator(op)).associativity;
}

function ofGreaterPrec(op1 : string, op2 : string) : boolean
{
    if(precFromStr(op1) < precFromStr(op2))
    {
        return true;
    }

    return false;
}

function ofEqualPrec(op1 : string, op2 : string) : boolean
{
    if(precFromStr(op1) === precFromStr(op2) && AssocFromStr(op1) === Associativity.Left)
    {
        return true;
    }

    return false;
}

function precCheck(op1 : string, op2 : string) : boolean
{
    if(ofGreaterPrec(op1, op2) || ofEqualPrec(op1,op2))
    {
        return true;
    }

    return false;
    
}

function prepString(expression : string) : string[]
{
    let tokens : string[] = expression.split(" ").filter(isSpace);

    return tokens;
}

function expressionToRPN(expression : string) : string[]
{
    // Splits the given expression into a list of string tokens, filtering out any extra spaces
    const tokens : string [] = prepString(expression);
    let opStack : string[] = []
    let outQueue : string[] = []

    Object.values(tokens).forEach(token =>
        // For each token in the string
    {
        if(token == "(") // token is a (
        {
            opStack.push(token);
            return;
        }

        if(token == ")") // token is a )
        {
            while(opStack[opStack.length - 1] != "(")
            {
                let val = opStack.pop();
                if(val != undefined)
                {
                    outQueue.push(val);
                }
            }

            opStack.pop();
            return;
        }

        if(isOperator(token)) // an operator
        {
            while(opStack.length && precCheck(token, opStack[opStack.length - 1]))
            {
                let val = opStack.pop();
                if(val != undefined)
                {
                    outQueue.push(val);
                }
            }

            opStack.push(token);
            return;
        }

        // Else is a number or a variable
        outQueue.push(token);
        

    }
    );

    // pop rest of stack to output
    while(opStack.length)
    {
        let val = opStack.pop();
        if(val != undefined)
        {
            outQueue.push(val);
        }
        
    }

    return outQueue;
}

function basicEvaluator(postfixExpr : string[]) : number
{

    return 0;
}