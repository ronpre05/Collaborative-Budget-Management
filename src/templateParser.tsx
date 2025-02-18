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
export function getTemplateName(template : any) : string
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
    });
    return ret;
}

 //Gets an array of category objects from the template.
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
    });
    return catObs;
}


//Gets the Fields section from a category.
export function getFieldsSection(category: any): any {
    return category.Fields;
}


//Gets an array of field names from a fields object.
export function getFieldNames(fields: any): string[] {
    let fieldNames: string[] = [];
    Object.values(fields).forEach(value => {
        fieldNames.push((value as any).Name);
    });
    return fieldNames;
}


//Gets a single field object by field name.
export function getFieldObject(fields: any, fieldName: string): any {
    let ret: any = [];
    Object.values(fields).forEach(value => {
        let field: any = value;
        if (field.Name == fieldName) {
            ret = field;
        }
    });
    return ret;
}

//Gets an array of field objects from a category.
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


//Converts a field object into a FieldType structure.
export function getFieldData(field: any): FieldType {
    let ret: FieldType = {
        name: field.Name,
        prefix: field.Prefix,
        value: field.Value,
        postfix: field.Postfix,
        type: field.Type,
        visible: field.Visible
    };
    return ret;
}


//Gets an array of FieldType structures from a category.
export function getAllFieldData(category: any): FieldType[] {
    let fields: any[] = getFieldObjectsFromCategory(category);
    let fieldData: FieldType[] = [];
    Object.values(fields).forEach(value => {
        fieldData.push(getFieldData(value));
    });
    return fieldData;
}

//Gets the Calculations section from a category.
export function getCalculationsSection(category: any): any {
    return category.Calculations;
}


//Gets an array of calculation names from the Calculations section.
export function getCalculationNames(calculations: any): string[] {
    let calcNames: string[] = [];
    Object.values(calculations).forEach(value => {
        calcNames.push((value as any).Name);
    });
    return calcNames;
}


//Gets a single calculation object by calculation name.
 export function getCalculationObject(calculations: any, calcName: string): any {
    let ret: any = [];
    Object.values(calculations).forEach(value => {
        let calc: any = value;
        if (calc.Name == calcName) {
            ret = calc;
        }
    });
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


//Gets an array of CalculationType structures from a category.
 
export function getAllCalcData(category: any): CalculationType[] {
    let calcs: any[] = getCalcObjectsFromCategory(category);
    let calcData: CalculationType[] = [];
    Object.values(calcs).forEach(value => {
        calcData.push(getCalcData(value));
    });
    return calcData;
}

/*
  Recursively flattens a (possibly nested) fields object.
  For nested fields, the keys are combined in dot notation.
 
  Example:
  {
    "Days": { ... },
    "Entry": {
       "Amount": { ... },
       "What": { ... }
    }
  }
 
  becomes:
  {
    "Days": { ... },
    "Entry.Amount": { ... },
    "Entry.What": { ... }
  }
 */
export function flattenFields(
  fields: Record<string, any>,
  parentKey: string = ""
): Record<string, FieldType> {
  let result: Record<string, FieldType> = {};
  for (const key in fields) {
    const value = fields[key];
    const compoundKey = parentKey ? `${parentKey}.${key}` : key;
    if (value && typeof value === "object" && "Type" in value) {
      result[compoundKey] = value as FieldType;
    } else if (value && typeof value === "object") {
      result = { ...result, ...flattenFields(value, compoundKey) };
    }
  }
  return result;
}
