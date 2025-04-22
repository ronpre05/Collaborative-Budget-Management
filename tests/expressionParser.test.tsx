import template from "../template1.json"
import { CalculationType, CategoryType, FieldType, TemplateData } from "../src/types"
import { expect, test, vi } from 'vitest'
import { truthTemplate, emptyTemplate, emptyCategory, emptyField, emptyCalculation } from "./newTemplateParser.test"
import { AssocFromStr, isAlphabet, isNumeric, isOperator, isSpace, ofEqualPrec, ofGreaterPrec, precCheck, precFromStr, toOperator } from "../src/expressionParser";

/*
Tests will be ran against the base "Horizon RIA" template inside
"../template1.json"

A version as a TemplateData has been provided as imported from
"newTemplateParser.test.tsx"

Below are the given constants and types from "expressionParser.tsx"
which are used throughout the code. Also provided is an empty operator
to test return values
*/

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

const emptyOp : Operator = 
{
    symbol : "",
    precedence : 0,
    associativity : Associativity.Right
}

/* TEST PLAN
    - isSpace
        - is a space
        - is a blank string
        - is a normal string
    - isOperator
        - is an operator
        - is not an operator
    - toOperator
        - give an operator string
        - give a non-operator string
    - precFromStr
        - give operator from list (take string from object) and compare results
    - AssocFromStr
        - give operator from list (take string from object) and compare results
    - ofGreaterPrec
        - test op1 greater
        - test op2 greater
        - are equal
    - ofEqualPrec
        - test op1 and op2 equal
        - test not equal
    - precCheck
        - test op1 greater
        - test op2 greater
        - test them the same
    - isNumeric
        - test number
        - test decimal point
        - test not a number
    - isAlphabet
        - test captial A Z
        - test lower case a z
        - test _
        - test :
        - test number


    - prepString
        - give empty expression
        - give expression with spaces
        - give spaceless expression
        - give with long constant numbers to test handling of them
        - give with long variables to test handling of them
    - expressionToRPN
        - give empty expression
        - give expression with spaces
        - give spaceless expression
        - give with no closing bracket
        - give with no opening bracket
    - basicEvaluator (mock getVariable-getValue-getSubValue)
        - test with no variables
        - test divides by 0
        - test with getVariable with no sub entry
        - test with getVariable with a sub entry
        - test with two variables (no sub entry)
        - test with two variables (sub entry)
*/

test('isSpace: functional with space', () =>
{        
    expect(isSpace(" ")).toStrictEqual(true)
})

test('isSpace: functional with blank', () =>
{
    expect(isSpace("")).toStrictEqual(true)
})

test('isSpace: failure', () =>
{
    expect(isSpace("A")).toStrictEqual(false)
})

test('isOperator: functional', () =>
{
    expect(isOperator("+")).toStrictEqual(true)
})

test('isOperator: failure', () => 
{
    expect(isOperator(":")).toStrictEqual(false)
})

test('toOperator: functional', () => 
{
    expect(toOperator("+")).toStrictEqual(operators[0])
})

test('toOperator: failure', () =>
{
    expect(toOperator("")).toStrictEqual(emptyOp)
})

test('precFromStr: functional', () =>
{
    expect(precFromStr("+")).toStrictEqual(operators[0].precedence)
})

test('AssocFromStr: functional', () =>
{
    expect(AssocFromStr("+")).toStrictEqual(operators[0].associativity)
})

test('ofGreaterPrec: op1 greater', () =>
{
    expect(ofGreaterPrec("*", "+")).toStrictEqual(false)
})

test('ofGreaterPrec: op2 greater', () =>
{
    expect(ofGreaterPrec("+", "*")).toStrictEqual(true)
})

test('ofGreaterPrec: op1 equal op2', () =>
{
    expect(ofGreaterPrec("+", "-")).toStrictEqual(false)
})

test('ofEqualPrec: are equal', () =>
{
    expect(ofEqualPrec("+", "-")).toStrictEqual(true)
})

test('ofEqualPrec: are not equal', () =>
{
    expect(ofEqualPrec("+", "*")).toStrictEqual(false)
})

test('precCheck: op1 greater', () =>
{
    expect(precCheck("*", "+")).toStrictEqual(false)
})

test('precCheck: op2 greater', () =>
{
    expect(precCheck("+", "*")).toStrictEqual(true)
})

test('precCheck: op1 equal op2', () =>
{
    expect(precCheck("+", "-")).toStrictEqual(true)
})

test('isNumeric: with a number', () =>
{
    expect(isNumeric("1")).toStrictEqual(true)
})

test('isNumeric: with a deciaml point', () =>
{
    expect(isNumeric(".")).toStrictEqual(true)
})

test('isNumeric: with a string', () =>
{
    expect(isNumeric("a")).toStrictEqual(false)
})

test('isAlphabet: with captial letters', () =>
{
    expect(isAlphabet("A")).toStrictEqual(true)
    expect(isAlphabet("Z")).toStrictEqual(true)
})

test('isAlphabet: with lower case letters', () =>
{
    expect(isAlphabet("a")).toStrictEqual(true)
    expect(isAlphabet("z")).toStrictEqual(true)
})

test('isAlphabet: with _', () =>
{
    expect(isAlphabet("_")).toStrictEqual(true)
})

test('isAlphabetL with :', () =>
{
    expect(isAlphabet(":")).toStrictEqual(true)
})

test('isAlphabet: with a number', () =>
{
    expect(isAlphabet("1")).toStrictEqual(false)
})
