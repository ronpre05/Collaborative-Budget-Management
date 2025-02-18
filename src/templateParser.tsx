import { readFile } from "fs/promises";

type FieldType =
{
    name : string;
    prefix : string;
    value : string;
    postfix : string;
    type : string;
    visible : boolean;
};

type CalculationType =
{
    name : string;
    expression : string;
    type : string;
    output : string;
};

// main("template1.json");

// async function main(templateName : string)
// {
//     const template : any = await(readJsonFile(templateName));

//     // Get the Name of the template
//     console.log(getTemplateName(template));
//     console.log("");

//     // List all category names
//     console.log(getCatNamesFromTemplate(template));
//     console.log("");

//     // List all category objects
//     let catObs : any[] = getCategoriesObjectsFromTemplate(template);
//     console.log(catObs);
//     console.log("");

//     // List all of the fields in personnel costs
//     let fieldObs : FieldType[] = getFieldObjectsFromCategory(catObs[0]);
//     console.log(fieldObs);
//     console.log("");

//     // List the field data for amount in personnel costs
//     console.log(getFieldData(fieldObs[0]));
//     console.log("");

//     // List the calculations for travel costs
//     let calcObs : CalculationType[] = getCalcObjectsFromCategory(catObs[3]);
//     console.log(calcObs);
//     console.log("");

//     // List the calculation data for the base total of travel costs
//     console.log(getCalcData(calcObs[0]));
// } 

export async function readJsonFile(path: string): Promise<any> {
    const response = await fetch(path);
    return await response.json();
}


// Gets the value in the "templateName" section of the JSON
function getTemplateName(template : any) : string
{
    // Returns the name
    return template.templateName;
}

// Gets the whole Categories object from the JSON
export function getCategoriesSection(template : any) : any[]
{
    return template.Categories;
}

// Gets the names of the categories from the Categories object
export function getCategoryNames(categories : any) : string[]
{
    let catNames : string[] = [];

    Object.values(categories).forEach(value => 
    // Loop through the categories
    {
        // Add each category name to the array
        catNames.push((value as any).Name);
    });

    // Return the array
    return catNames;
}

// Gets an array of categoru names from the template directly
export function getCatNamesFromTemplate(template : any) : string[]
{
    // Return the categories names after gathering the categories section
    return getCategoryNames(getCategoriesSection(template));
}

// Bet the object of each individual category by name
export function getCategoryObject(categories : any, catName : string) : any
{
    // Create a value to hold the return
    let ret : any = [];

    Object.values(categories).forEach(value =>
    // Loop through the categories object
    {
        // Take each entry
        let cat : any = value;

        // Check if the name matches the goal
        if(cat.Name == catName)
        {
            // If so set the return value
            ret = cat;
        }
    }
    )

    // Return the value
    return ret;
}

export function getCategoriesObjectsFromTemplate(template : any) : any[]
{
    // Gather the required names and categories object
    let catNames : string[] = getCatNamesFromTemplate(template);
    let categories : any = getCategoriesSection(template);

    // Create a return array
    let catObs : any[] = [];

    Object.values(catNames).forEach(value =>
    // Loop through each of the names
    {
        // Get the object for that name
        let cat : any = getCategoryObject(categories, value)

        // Add the object to an array
        catObs.push(cat);
    }
    )

    // Return the array
    return catObs;
}

export function getFieldsSection(category : any) : any
{
    return category.Fields;
}

export function getFieldNames(fields : any) : string[]
{
    let fieldNames : string[] = [];

    Object.values(fields).forEach(value =>
    // Loop through the fields section
    {
        // Add to an array
        fieldNames.push((value as any).Name);
    }
    )
    
    // Return the array
    return fieldNames;

}

function getFieldObject(fields : any, fieldName : string) : any
{
    // Create a value to hold the return
    let ret : any = [];

    Object.values(fields).forEach(value =>
    // Loop through the fields
    {
        // Save each field
        let field : any = value;

        if(field.Name == fieldName)
        // Check if its Name entry matches the fieldName
        {
            // If so it to the return value
            ret = field;
        }
    }
    )

    return ret;

}

function getFieldObjectsFromCategory(category : any) : FieldType[]
{
    // Gather the required names and fields object
    let fieldNames : string[] = getFieldNames(getFieldsSection(category));
    let fields : any = getFieldsSection(category);

    // Create a return array
    let fieldObs : FieldType[] = [];

    Object.values(fieldNames).forEach(value =>
    // Loop through each of the names
    {
        // Get the object for that name
        let field : any = getFieldObject(fields, value)

        // Add the object to an array
        fieldObs.push(getFieldData(field));
    }
    )

    // Return the array
    return fieldObs;

}

function getFieldData(field : any) : FieldType
{
    let ret : FieldType = 
    {
        name : field.Name,
        prefix : field.Prefix,
        value : field.Value,
        postfix : field.Postfix,
        type : field.Type,
        visible : field.Visible
    };

    return ret;
}

function getCalculationsSection(category : any) : any
{
    return category.Calculations;
}

function getCalculationNames(calculations : any) : string[]
{
    let calcNames : string[] = [];

    Object.values(calculations).forEach(value =>
    // Loop through the calculations section
    {
        // Add to an array
        calcNames.push((value as any).Name);
    }
    )

    // Return the array
    return calcNames;

}

function getCalculationObject(calculations : any, calcName : string) : CalculationType
{
    // Create a value to hold the return
    let ret : any = [];

    Object.values(calculations).forEach(value =>
    // Loop through the calculations
    {
        // Save each calculation
        let calc : any = value;

        if(calc.Name == calcName)
        // Check if its Name entry matches the calcName
        {
            // If so it to the return value
            ret = calc;
        }
    }
    )
    
    return ret;
}

export function getCalcObjectsFromCategory(category : any) : CalculationType[]
{
    // Gather the required names and calc object
    let calcNames : string[] = getCalculationNames(getCalculationsSection(category));
    let calcs : any = getCalculationsSection(category);

    // Create a return array
    let calcObs : CalculationType[] = [];

    Object.values(calcNames).forEach(value =>
    // Loop through each of the names
    {
        // Get the object for that name
        let calc : CalculationType = getCalculationObject(calcs, value)

        // Add the object to an array
        calcObs.push(getCalcData(calc));
    }
    )

    // Return the array
    return calcObs;

}

function getCalcData(calc : any) : CalculationType
{
    let ret : CalculationType = 
    {
        name : calc.Name,
        expression : calc.Expression,
        type : calc.Type,
        output : calc.Output
    };

    return ret;
}
