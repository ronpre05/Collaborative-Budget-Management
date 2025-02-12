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
    {symbol : "+", precedence : 1, associativity : Associativity.Left},
    {symbol : "-", precedence : 1, associativity : Associativity.Left},
    {symbol : "*", precedence : 2, associativity : Associativity.Left},
    {symbol : "/", precedence : 2, associativity : Associativity.Left},
    {symbol : "^", precedence : 3, associativity : Associativity.Right},
]

console.log(expressionToRPN("12+4*(3-1)"));
console.log("");
console.log(basicEvaluator(expressionToRPN("12+4*(3-1)")));
console.log("");
console.log(expressionToRPN("50 +b:e:c * (c^2 - e)"));
console.log(" ");
console.log(basicEvaluator(expressionToRPN("3 + 2")));
console.log("");
console.log(basicEvaluator(expressionToRPN("3 - 2")));
console.log("");
console.log(basicEvaluator(expressionToRPN("3 * 2")));
console.log("");
console.log(basicEvaluator(expressionToRPN("3 / 2")));
console.log("");
console.log(basicEvaluator(expressionToRPN("3 ^ 2")));
console.log("");

function isSpace(element : string) : boolean
// Checks if an elements is a space or a blank string
{
    if(element == " " || element == "")
    {
        return true;
    }
    
    return false;
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

function isNumeric(c : string) : boolean
{
    if((Number.isFinite(+c) || c === ".") && !isSpace(c))
    {
        return true;
    }

    return false;
}

function isAlphabet(c : string) : boolean
{
    if(((c >= "a" && c <= "z") || (c >= "A" && c <= "Z") || c === ":" || c === "_") && !isSpace(c))
    {
        return true;
    }
    
    return false;
}

function prepString(expression : string) : string[]
{
    let tokens : string[] = [];
    let i = 0;

    for(i = 0; i < expression.length; i++)
        // Loop through each character
    {
        // if its a space, ignore it
        if(isSpace(expression[i]))
        {
            continue;
        }
        // if its a bracket / operator push to tokens
        else if(isOperator(expression[i]) || expression[i] == "(" || expression[i] == ")")
        {
            tokens.push(expression[i]);
            continue;
        }
        // if its a number, create a new loop and loop until there isn't another number value, add this as a whole into tokens
        else if(isNumeric(expression[i]))
        {
            // Create another string[]
            let num : string[] = [];
            let j = i;

            // Loop through until find something not a number adding all to new string[]
            for(j = i; j < expression.length ; j++)
            {
                if(isNumeric(expression[j]))
                {
                    num.push(expression[j]);
                }
                else
                {
                    break;
                }
            }

            // add to tokens
            tokens.push(num.join(""));

            i = j - 1;
            continue;
        }
        // if its a letter, create a new loop until there isn't another letter value, add this as a whole into tokens
        else if(isAlphabet(expression[i]))
        {
            // Create another string[]
            let vari : string[] = [];
            let j = i;

            // Loop through until find something not a letter adding all to new string[]
            for(j = i; j < expression.length ; j++)
            {
                if(isAlphabet(expression[j]))
                {
                    vari.push(expression[j]);
                }
                else
                {
                    break;
                }
            }

            // add to tokens
            tokens.push(vari.join(""));

            i = j - 1;
            continue;
        }
        
    }

    //let tokens : string[] = expression.split(" ").filter(isSpace);
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
    let stack : string[] = []

    Object.values(postfixExpr).forEach(token =>
    {
        if(!isOperator(token)) // not an operator
        {
            stack.push(token);
        }
        else // is operator
        {
            let sOp1 = stack.pop();
            let sOp2 = stack.pop();
            let op1 : number = 0;
            let op2 : number = 0;

            // pop two more from stack
            if(sOp1 != undefined)
            {
                op1 = Number.parseFloat(sOp1);

            }
            else
            {   
                op1 = 1;
            }

            if(sOp2 != undefined)
            {
                op2 = Number.parseFloat(sOp2);
            }
            else
            {
                op2 = 1;
            }

            let val : number = 0;

            // evaluate the thing
            switch (token)
            {
                case "+":
                {
                    val = op2 + op1;
                    break;
                }

                case "-":
                {
                    val = op2- op1;
                    break;
                }

                case "*":
                {
                    val = op2 * op1;
                    break;
                }

                case "/":
                {
                    if(op2 == 0)
                    {
                        val = 0;
                    }
                    else
                    {
                        val = op2 / op1;
                    }

                    break;
                }

                case "^":
                {
                    val = op2 ** op1;
                }
            }
            
            // push to stack
            stack.push(val.toString());            
        }
    }
    );

    let val = stack.pop();
    if(val != undefined)
    {
        return Number.parseFloat(val);
    }

    return 0;
}