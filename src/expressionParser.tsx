import { getAllCategoryEntries, getCategoryID, getFieldID, getGlobalEntryID, getValue, getValueID, updateIndividualField } from "./database";
import { readJsonFile, findCatObject } from "./newTemplateParser";
import { CalculationType, TemplateData, CategoryType } from "./types";

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

async function basicEvaluator(postfixExpr : string[], projectID : number, entryID : number) : Promise<number>
{
    let stack : string[] = []

    for(const token of postfixExpr)
    {
        if(isAlphabet(token[0]))
            {
                let num : number = await parseVariable(token, projectID, entryID);
                stack.push(num.toString());
                
            }
            else if(isOperator(token)) // is operator
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
                        break;
                    }
                }
                
                // push to stack
                stack.push(val.toString());            
            }
            else
            {
                stack.push(token); // is a number
            }
    }


    let val = stack.pop();
    if(val != undefined)
    {
        return Number.parseFloat(val);
    }

    return 0;
}


async function parseVariable(vari : string, projectID : number, entryID : number) : Promise<number>
{
    // Split the variable up into its constituent types
    const splitString : string[] = vari.split(":");

    let catName : string = splitString[0];
    let valName : string = splitString[1];

    return getVariable(catName, valName, projectID, entryID);
}

async function getVariable(catName : string, fieldName : string, projectID : number, entryID : number) : Promise<number>
{
    // Query the database to get the value, either in the field or calculation section
    // Can use the project and entry ids to do this

    // Get category id from name and projectid
    const catId : number = await getCategoryID(catName, projectID);

    // Use the catid and field name to get all matching field ids
    const fieldID : number = await getFieldID(catId, fieldName);

    // Get the value from field values with matching entry and field ids
    const value : number = await getValue(entryID, fieldID);

    // Return that value
    return value;

}



async function addResultToDataBase(entryID : number, outputField : string, catId : number, result : number)
{
    // Will take the entry id, the name of the output field and the value and add it to the database

    if(entryID == -1)
    {
        return;
    }

    // Check that the field exists so that it can be updated
    // MIGHT NEED ANOTHER NEW QUERY

    // Get the field ID
    const fieldID : number = await getFieldID(catId, outputField);

    // Run an update to change value (at field/entry) to be result
    const valueID :  number = await getValueID(entryID, fieldID);

    await updateIndividualField(valueID, result);

    return;
}



async function localEvaluator(calc : CalculationType, projectID : number, entryID : number) : Promise<number>
{
    let RPN : string[] = expressionToRPN(calc.expression);

    let result : number = await basicEvaluator(RPN, projectID, entryID);

    return result;
}

function extractCatName(expr : string) : string
{
    return expr.split(":")[0];
}

async function globalEvaluator(calc : CalculationType, projectID : number) : Promise<number>
{
    let catName : string = extractCatName(calc.expression);
    let categoryID : number = await getCategoryID(catName, projectID);
    // Get a list of entries in that category
    let entries : number[] = await getAllCategoryEntries(categoryID);
    let total : number = 0;

    // Now successfully gets the entries where there are entries added
    // So once it has the entry ids if should:
            // pass the entry id into the basic eval
            // That should calculate the expression
            // Has the entry id where it should pull the data from

    let RPN : string[] = expressionToRPN(calc.expression);

    for(let entry of entries)
    {
        total += await basicEvaluator(RPN, projectID, entry);
    }
    return total;
}

export function cleanString(str? : string) : string
{
    if(!str){
        return "";
    }
    return str.split("_").join(" ");
}

export async function categoryCalculation(catName : string, projectID : number, template : TemplateData)
{
    const cat : CategoryType = findCatObject(catName, template.categories);
    const catId : number = await(getCategoryID(catName, projectID));
    const calculations : CalculationType[] = cat.calculations;

    // For each calculation
    for(const calc of calculations)
        {
            let result : number = 0;

            if(calc.type == "Local")
            // If local
            {
                // Get a list of entries for the current category
                    // Find the category id in category entries (get a list of entry ids)
                    // Remove duplicates from that list
                const entries = await getAllCategoryEntries(catId);

                for(const entry of entries)
                // For each entry (in the current category cat)
                {
                    // do the calculation
                    result = await localEvaluator(calc, projectID, entry);
                    addResultToDataBase(entry, calc.output, catId, result);
                }
                    
            }
            else
            // If global
            {
                // Do the calculation
                result = await globalEvaluator(calc, projectID);
                // Need to do a check for a category entry
                    // If no entry make one and return its id
                    // If one return its id
                // Replace the -1 below with that
                addResultToDataBase(await getGlobalEntryID(catId, projectID), calc.output, catId, result);
            }

        }
}

// main();

// async function main()
// {
//     // console.log(await getCategoryID("Personnel", 88)); // Gives 35
//     // console.log(await getAllCategoryEntries(1)); // Gives 36,37,38,39,40,41,42,46,48,49,54
//     // console.log(await getFieldID(28, "personMonth")); // 64
//     // console.log(await getValue(46, 57)) // Gives 100 
//     // console.log(await getValueID(46, 57)); // Gives 89
//     // console.log(await updateIndividualField(105, 10000)); // Observed to work when rls off

//     // console.log("");

//     // Some tests for get variable, global and local evaluator

//     console.log(await getVariable("Internally Invoiced Services", "amount", 99, 58)); // Gives 100

//     const template : TemplateData = await readJsonFile("./template1.json");

//     const cats = template.categories;

//     console.log(cats[5].calculations[0]);

//     console.log(await localEvaluator(cats[5].calculations[0], 99, 58)) // Gives 100

//     console.log(await basicEvaluator(expressionToRPN("10 +Internally_Invoiced_Services:F:amount"), 99, 58));

//     //await(categoryCalculation("Internally_Invoiced_Services", 99, template));
// }


