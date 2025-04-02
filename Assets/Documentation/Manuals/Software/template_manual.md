# Templates

## JSON Templates

### Introduction to templates

The data is stored inside the database as defined by the template that is assigned to the project. Templates themselves are not meant to be user-facing, they should just be given a name which denotes which project funding type they represent. It is up to the PI of the project to know what the contents of the project would look like. Therefore it is up to the developers to provide the templates that a PI may want to create projects for. 

### General Layout

Templates are stored in the form of a JSON file within the database, and when a project is created by a PI, this template is copied into the project's template entry inside the database (pending). The result of this is that all projects have their own copy of their template, such that if the master copy changes, their database layout remains intact. The top level of the JSON object has one object and one attribute as shown below:

```json
{
    "templateName" : "Sample Name",
    
    "Categories" : 
    {
        …
        …
    }
}
```

The template name is simply the display name of the template and should be recognised by a potential PI of a project. This will allow them to choose the appropriate template type for their project. The categories section (explained below) defines how the data should be structured and what tables/fields the user should be able to interact with.

### Categories

In the template the "Categories" section is made up of a list of objects, each forming single category. A category defines a table inside the database where the user would like to store data. These categories are separate from each other and cannot be linked together to form a joined table. However data can be linked together by way of calculations (as described in the Calculations section below). In the JSON templates, the categories section will be populated with objects as below:

```json
"Categories" :
{
    "Category Abbreviation" :
    {
        "Name" : "Underscore_Separated_Name",
        "HasSubEntry" : Boolean Value,
        "Fields" : 
        {
            …
        },
        "SubEntries" :
        {
            … (Only present if "HasSubEntry" is True)
        },
        "Calculations" :
        {
            …
        }
    },
    …
}
```

The "Category Abbreviation" can be anything, it doesn’t impact the internal workings of the template, nor does it get displayed to the user and so it can be disregarded. Internally, a category has two attributes and between 2 and 3 objects. The number of objects is dependent on one of the attributes. The first attribute is the "Name", which stores the name of the attribute and must not use spaces. Instead you should use underscores (which can be easily removed for display). Underscores are used to allow expressions (discussed later) to reference category names easily. The second attribute is "HasSubEntry", which is used to express whether the category contains "SubEntries". (SubEntries are discussed in more detail later on). If this attribute reads true, then the category contains a "SubEntries" object, else this object can be omitted. The two remaining objects are "Fields" and "Calculations". Fields holds the actual data points that can be added as part of a single entry to the database. Calculations holds the predefined ways in which values can be added together or processed within that category. Both of these are discussed in further detail later on.

### Fields

In the template the "Fields" section of a category is again made up of a list of objects, each forming a single field in the database as part of the table defined in the category. In the JSON template, the fields section will be populated with objects as below:

```json
"Fields" : 
{
    "Field Abbreviation" : 
    {
        "Name" : "Underscore_Separated_Name",
        "Prefix" : "Symbol or word to prefix the header",
        "Value" : "Placeholder value in entry",
        "Postfix" : "Symbol or word to postfix header",
        "Type" : "Data type of the field",
        "DisplayVisibility" : "If visible on data retrieval as boolean",
        "EntryVisibility" : "If visible on data entry as boolean"
    },
    …
}
```

The "Field Abbreviation" can be anything, it doesn't impact the internal workings of the template, nor does it get displayed to the user and so it can be disregarded. Internally a field has 7 attributes and no internal objects. The first attribute is "Name", which must not contain spaces, underscores should be used instead (which can be removed for display). Underscores make it easier for the expression parser (discussed later) to recognise variables which contain the field names. The next two are "Prefix" and "Postfix" which will append the supplied characters to the front and end of the header respectively. For example, placing £ in the prefix means you can tell users that the field's data should be in pounds. The "Value" attribute stores what will be placed in the textbox for entry as a placeholder, giving the user extra instruction about what to fill that field in with. Next, the "Type" attribute is used to define the data type of the field such as "String", "Int" etc. The final two are "DisplayVisibility" and "EntryVisibility", which define what data should be visible and what data shouldn't be visible. Display defines whether the data should be displayed as read in from the database, or if that column should be hidden. This will mostly be useful to hide some intermediate calculation results (as explained later). Entry defines whether the user should be given a textbox to enter the data into the database in the first place. This is useful when you don't want a user to enter data into the result of a calculation as the data will get overwritten. Both of these attributes are booleans.


### Calculations

In the template the "Calculations" section of a category is again made up of a list of objects, each forming a single calculation that can be carried out in that category. In the JSON template, the calculations section will be populated with objects as below:

```json
"Calculations" :
{
    "Calculation Abbreviation" : 
    {
        "Name" : "Underscore_Separated_Name",
        "Expression" : "String expression",
        "Type" : "How it should be evaluated",
        "Output" : "Name of field to output to"
    },
    …
}
```

The "Calculation Abbreviation" can be anything, it doesn't impact the internal workings of the template, nor does it get displayed to the user and so it can be disregarded. Internally a calculation has 4 attributes and no internal objects. The first attribute is "Name". This should not contain spaces and should instead use underscores to maintain consistency with the field names. Next is the "Expression" which stores what calculation should be carried out. Further details on how these work are available in the Expression section. Then there is the "Type", which defines how the calculation should be carried out. This can either be "Local", "Global" or "SubGlobal" and how these work will be explained in the Expression Parsing section. Finally there is the "Output" which states which field in the category the output should be saved to. This must be a field within the category.

### Sub Entries

A sub entry is a small collection of fields inside a category for which a single database entry may require them to have more than one value, and the groups of values entered together should be maintained. For example, in a "Travel_Costs" entry, you may require more than one entry for "What" and "Amount" for a single main entry of "Days" etc. Sub entries provide a way to allow for multiple "What" and "Amount" pairs to be added along with a single entry for the category. Not every category will have a "SubEntries" section. Any category that needs a "SubEntries" section must also have the "HasSubEntry" flag set to true, else the sub entries will be ignored. The "SubEntries" section is made up of a list of objects in exactly the same way that "Fields" is, and also contains a list of fields which follow the same format as in the "Fields" section. For data entry, retrieval and expressions to function as intended, sub entries and fields should not be given the same name within the same category

## Template Parsing

### Template Data Types

Provided to make interacting with the template's information easier are a number of types (located in types.ts) which capture the sections of the template. Generating these types is explained in the next section. 

We will look at the types in a bottom up fashion instead of the top down fashion they are generated in, so that those which are expressed in terms of another type appear later than the type it contains.


This stores the fields of a category within the template, holding each of its attributes. This is also the type used to hold a sub entry as a sub entry contains all of the same attributes as a field.

```typescript
export interface FieldType 
{
    name : string;
    prefix : string;
    value : string;
    postfix : string;
    type : string;
    displayvisible : boolean;
    entryvisible : boolean;
}
```

This stores the calculations of a category within the template, holding each of its attributes.

```typescript
export interface CalculationType 
{
    name : string;
    expression : string;
    type : string;
    output : string;
}

```

This stores the categories of a template, holding each of its attributes. It contains lists of FieldType and CalcualtionType for the fields, sub entries and calculations of the category. If hassubentry is False, then the subentries will be []

```typescript
export interface CategoryType 
{
  name : string;
  hassubentry : boolean;
  fields : FieldType[];
  calculations : CalculationType[];
  subentries : FieldType[];
}
```

This stores the overall template, holding the name attribute and the list of the CategoryType's that make up the categories of the template.

```typescript
export interface TemplateData
{
  templateName : string;
  categories : CategoryType[];
}
```

### How to use the Template Parser

In order to parse the JSON templates into a consistent format for the code to oeprate on, there is a template parser in newTemplateParser.tsx. The main function of this is to turn the JSON template into a data structure formed of bespoke types. The types themselves are descibed in more detail in the previous section. The parser also provides some functions for operations on these structures for some common tasks such as listing the names of the categories in said template. 

The most important function of the template parser is:

```typescript
/**
 * Generates a TemplateData structure from a raw JSON template file, gathering the CategoryTypes and other internal structures
 * @param template The raw template JSON that has been read in from readJsonFile
 * @returns A complete TemplateData structure which contains the categories list filled out
 */
export function getTemplate(template : any) : TemplateData
{
    let temp = 
    {
        templateName : template.templateName,
        categories : getCategoriesFromRaw(template)
    };

    return temp;
}
```

which generates the main TemplateData object in a top down fashion, storing all of the provided information in the JSON in a simpler format. It operates on the template's text either read in from a file, or more likely from the database itself.
This starts a chain of function calls which find each category inside the JSON and generate the lists of its fields etc, and then creates the list of categories for the TemplateData type. Elsewhere in the code these should never be used as you should already have use the "getTemplate" function which handles the raw template for you. 

#### Provided functions to operate on the types

| Function Name | Parameters | Return | Description |
| ------------- | ---------- | ------ | ----------- |
| getCatNames | TemplateData | string[] | Returns a list of names of the categories inside the given template |
| getFieldsNames | CategoryType | string[] | Returns a list of names of the fields inside the given category |
| findCatObject | string, CategoryType[] | CategoryType | Returns the category with the given name from the list of CategoryType given using a linear search |
| findFieldObject | string, CategoryType | FieldType | Returns the field with the given name from the list of FieldType inside the given category using a linear search |
| findCalcObject | string, CategoryType | CalculationType | Returns the calculation with the given name from the list of CalculationType inside the given category using a linear search |
| getSubEntryNames | CategoryType | string[] | Returns a list of names of the sub entries insde the given category, or the empty list if no sub entries are present |
| findSubEntryObject | string, CategoryType | FieldType | Returns the sub entry with the given name from the list of FieldType (sub entries) inside the given category using a linear search. Returns an empty FieldType if there are no subentries |

## Expressions

### How expressions are formed

Expressions are stored as strings as defined in the template. You should simply write out the expression that must be calculated, including brackets where necessary (following "order of operations" rules). You do not have to worry about where spaces occur within the expression as long as they are not inside of a variable. You also don't have to worry about the output and = signs as this is handled inside the "Output" attribute of the calculation as explained in the calculations section of the template manual.
An example expression is given inside the "How variables are formed" section below.

Should you wish to include calculations which sum up parts of entries together, this is not defined inside an expression, you should instead look at "Different Evaluator Types" inside the expression parsing section.

<em> How expressions handle dates needs to be added, but implementation is not yet complete and method not fully decided </em>


#### Elements you can include

| Elements | Symbol |
| -------- | ------ |
| Add | + |
| Subtract | - |
| Multiply | * |
| Divide | / |
| Exponential | ^ |
| Brackets | () |
| Variables | Category:Field |

To add more operations, see the "How to add more operations if required" section later

### How variables are formed

A variable is simply formed of the category you are currently in and the field within that category, separated by a :, for example

```json
    "Expression" : "Travel_Costs:Days*Travel_Costs:Accomodation + Travel_Costs:Days*Travel_Costs:Sustinance"
```

where the variables are "Travel_Costs:Days", "Travel_Costs:Accomodation" and "Travel_Costs:Sustinance".

The category in the variable does not have to refer to the current category you are writing an expression for, but as variables are found on an entry-level, it is best to use a "Global" calcuation if you refer to outside the current category. This will be further explained in the "Expression Parsing" section.




## Expression Parsing

The code which evaluates the expressions is given inside "expressionParser.tsx". It operates by calling the "categoryCalculation" function whenever a categories calculations need to be updated. It will run thorugh each of the calculations and carry out the calulations within each, choosing which type of evaluator to use and what entries need to be included in the calculation. 

### How variables are evaluated

A single variable is evaluated by first breaking down the variable, and then finding the variable within the database.
This is done with the "parseVariable" and "getVariable" functions. First you call parseVariable giving the variable name, the ID of the project, the ID of the entry and whether its a sub entry or not. If it is a sub entry, then the entryID should be used as a sub entry ID instead. (This is explained further in the SubGlobal evaluator type later on). Then the string is split to extract the category and field name from around the :. This then calls getVariable with the two extracted names along with the rest of the parameters. getVariable will then find the category and field ID inside the database and will call on of two functions, either getValue or getSubValue (depending on the status of the isSubEntry parameter), giving both the entry and field IDs. This will return the value of the variable in the provided context for use in the calculation.


### Expression evaluation steps

#### Prepping the expression

The first step in the process of evaluating an expression is to prep the expression. This is the process of turning the expression into an array of tokens in the expression, where each token is a string that is either a number, variable or operator that has been found in the expression. This is done by the function "prepString" which takes an string expression and returns a list of strings. prepString works by looping through each character in the expression.

| Character type | How it is parsed |
| -------------- | ---------------- |
| isSpace | Skip the character and move on |
| isOperator | Push the token to the output list and move on |
| isNumeric | Continue to loop through, gathering all numbers into an extra list, then when you reach a non-numeric character, place the whole number into the output list and move on, going back to the character you just parsed that wasn't a number |
| isAlphabet | As above, but with isAlphabet characters instead of numbers |

These are the function which define what type each parsed character belongs to. Notably isAlphabet only includes a-z, A-Z, : and _, all other characters are ignored.

```typescript
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
```

Once the full expression has been parsed, you will be left with a list of the tokens in the expression. Using the example in "How variables are formed" you would get:

```typescript
    ["Travel_Costs:Days", "*", "Travel_Costs:Accomodation", "+", "Travel_Costs:Days", "*", "Travel_Costs:Sustinance"]
```

note the spaces have been removed.

#### Conversion to RPN

Before the expression can be properly evaluated, is must be converted in Reverse Polish Notation (also known as postfix expressions). This is carried out using the "expressionToRPN" function which takes the whole string expression and returns the expression as a list of strings in postfix form. Note that this function takes the expression string and not the prepped list of tokens as it carries out the prepString itself.
It converts an expressino to RPN using the Shunting Yard algorithm utilising an operator stack and an output queue. It will loop through the prepped tokens and will do one of four things:

| Token type | Operation |
| ---------- | --------- | 
| "(" | Pushes to operator stack |
| ")" | Pops from operator stack to output until a "(" is found |
| isOperator | Pops from operator stack to output until it finds an operator with less precedence then pushes to operator stack |
| Otherwise | Must be a variable or number so push to output |

#### Basic evaluator

Now the expression can be evaluated. This is done by the "basicEvaluator" function which takes the postfix expression, the projectID, entryID and isSubEntry and returns the number asynchronously using a stack for the numbers. You would never typically use this function alone as it would be a part of an evaluator which are described alter on. It requires the IDs of the project involved as it must parse the variables within the expression and gather the values from the database. To evaluate an expression it will loop through the postfix expression:

| Token type | Operation |
| ---------- | --------- | 
| isAlphabet | Call parse variable to get the numerical value and push to the number stack |
| isOperator | Pop two values from the stack, convert them into floating point numbers then apply the operation in the token |
| Otherwise | It is a number and should be placed on the number stack |

Once the whole expression has been dealt with, there should be a single number remaining on the stack which is returned else 0 is returned.

#### Updating the database

Once the expression has been evaluated the value should be placed into the database using the "addResultToDataBase" function which takes the entryID, the output field as a string, the categoryID and the number that is must be updated with. It is assumed that the results to a calcualtion cannot be inside a sub entry and so this should be avoided. 
The function will simply find the field and entry IDs then update the field inside the database using the "updateIndividualField" query


### Different evaluator types

There are three different types of evaluator provided which are described in the section below. There are different types of evaluator to allow you to calculate within an entry, such as person months, to sum up values such as totals and to sum up sub entries such as in "Travel_Costs". These all require the basicEvaluator to be applied in different ways, possibly with loops etc so are split into different evaluators. Which evaluator is applied to which calculation is defined in the type of the calculation within the template and must contain either "Local", "Global", or "SubGlobal".
While different they all follow a similar pattern. Firstly the expression in the given CalculationType must be converted to postfix using "expressionToRPN", then you must call the "basicEvaluator" either in a loop of some form, or just on its own, dependent on the type of evaluator, then finally you must return the result of the calculation.

#### Local

A "Local" calculation type is one that happens within a single database entry (think within the fields of a single row). Its evaluator therefore is very simple, just converting to RPN then calling the basicEvaluator and returning the result. To run a local evaluation for a whole category, you must place it inside a loop which calls the evaluator once for each entryID in the chosen category as per "categoryCalculations" function, adding to the database after each one. These can appear in any category, even among global calculations should they be required.

#### Global

A "Global" calculation type is one that happens along all entries inside a project, used to sum up values possibly from local calculations. A calculation of this type will typically only contain a single variable, and the category it uses the entries of is determined by the first category it comes across in the string expression. It is therefore best practise to use a local calculation for small calculations then sum up the results of those rather than doing all in one go. The evaluator will get all entries of the category it determines, will convert the expression to RPN then run the evaluator for each entryID keeping a running total before returning that total. To run a global evaluation for a whole category, you can simply call the global evaluator and add to the database as per "categoryCalculations". However as global calculations are not coupled to an entry, you must call getGlobalEntryID which will maintain a singleton entry for that category to place the results of global calculations. Therefore it is advised that global calculations end up inside a category of their own such as "Totals" away from typical data entry categories.

#### SubGlobal

A "SubGlobal" calculation type is one that happens within a single database entry but which also contains sub entries and is used to sum up values inside the sub entry. It must therefore act as a global evaluator inside a local area. Its evalutor acts very much like the global evaluator, instead looping through sub entries for the chosen entry id, and giving the basic evaluator a flag of true instead of false. It can also include some local calculations such as adding number together as long as they appear inside the same sub entry. To run a subglobal evaluation for a whole category, you must place it insde a loop which calls the evaluator once for every entryID in the category as per "categoryCalculations". As they are still tied to an entry, they can simply add the result into the database at the entry it operated on. These can be used in any category which has a sub entry.

### How to use evaluators in general

Whichever evaluator type you use, there is a general pattern to use. This involves calling the evaluator you wish to use, then adding it to the database. Depending on the evaluator you have chosen this may be carried out inside of a loop or be done inside of a single entry.

### How to add more operations if required

You may wish to add more operations to expressions for more complex calculations such as a modulus operator. You can do this by updating the operators list inside "expressionParser.tsx", ensuring that the precedence and associatvity is correct relative to the other operators.

```typescript
const operators : Operator[] = 
[
    {symbol : "+", precedence : 1, associativity : Associativity.Left},
    {symbol : "-", precedence : 1, associativity : Associativity.Left},
    {symbol : "*", precedence : 2, associativity : Associativity.Left},
    {symbol : "/", precedence : 2, associativity : Associativity.Left},
    {symbol : "^", precedence : 3, associativity : Associativity.Right},
]
```

You must also update the switch case basic evaluator which handles applying the operators to include a case for the new operator as shown below

```typescript
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
```