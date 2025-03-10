// import { readFile } from "fs/promises";
import { TemplateData, CategoryType, FieldType, CalculationType } from "./types";

// main();

// async function main()
// {
//     const template : TemplateData = await readJsonFile("./template1.json");
//     console.log(template);
//     console.log(getCatNames(template));
//     console.log(getFieldsNames(template.categories[0]));
//     console.log(findCatObject("Personnel", template.categories));
//     console.log(findFieldObject("amount", template.categories[0]));
//     console.log(findCalcObject("Total", template.categories[0]));
// }

/**
 * Function to read in a JSON file in the template format from the disk and store in inside a TemplateData structure
 * This uses the getTemplate function to accquire all of the internal types for categories etc so that you don't have
 * to handle it yourself
 * @param path string containing the path name of the relevant JSON file
 * @returns when awaited returns the chosen template in a type with all categories and fields already processed
 */
export async function readJsonFile(path: string): Promise<TemplateData> 
{
    // const file = await readFile(path, "utf8");
    // return getTemplate(await(JSON.parse(file)));

    const response = await fetch(path);
    return getTemplate(await response.json());
}

/**
 * Generates a TemplateData structure from a raw JSON template file, gathering the CategoryTypes and other internal structures
 * NO NEED TO EXPORT THIS FUNCTION "readJsonFile" CALLS THIS ALREADY
 * @param template The raw template JSON that has been read in from readJsonFile
 * @returns A complete TemplateData structure which contains the categories list filled out
 */
function getTemplate(template : any) : TemplateData
{
    let temp = 
    {
        templateName : template.templateName,
        categories : getCategoriesFromRaw(template)
    };

    return temp;
}

/**
 * Gets the raw categoires section from a template, loop through each category and creates a CategoryType out of it in order
 * to populate the TemplateData type requested by the user for a project.
 * NO NEED TO EXPORT THIS FUNCTION, IT IS NOT PROPERLY TYPED, GET TYPES FROM "readJsonFile"
 * @param template the raw template file to extract the categories from
 * @returns a list of category types which are correctly populated with FieldType and CalculationType lists
 */
function getCategoriesFromRaw(template : any) : CategoryType[]
{
    const rawCategories : any = template.Categories;
    let categories : CategoryType[] = [];

    if(rawCategories == undefined)
    {
        return [];
    }

    Object.values(rawCategories).forEach(category =>
    // Loop getCategoryData over the template catgeory section
    {
        categories.push(getCategoryData(category));
    }
    );
        
    return categories;
}


/**
 * Generates a type safe category with its fields and calculations ready to form a list for the category list in the
 * TemplateData structure
 * NO NEED TO EXPORT THIS FUNCTION, IT IS NOT PROPERLY TYPED, GET TYPES FROM "readJsonFile"
 * @param category a raw category from the template
 * @returns a correctly populated CategoryType object which has fields and calculations read in
 */
function getCategoryData(category : any) : CategoryType
{
    let cat : CategoryType = 
    {
        name : category.Name,
        fields : getFieldsFromRaw(category),
        calculations : getCalculationsFromRaw(category)
    };

    return cat;
}

/**
 * Generates a list of FieldType from a raw category in order to populate the CatgegoryType object of the passed in raw category
 * NO NEED TO EXPORT THIS FUNCTION, IT IS NOT PROPERLY TYPED, GET TYPES FROM "readJsonFile"
 * @param category a raw category from the JSON to extract the fields out of 
 * @returns a list of FieldType as extracted from the JSON
 */
function getFieldsFromRaw(category : any) : FieldType[]
{
    const rawFields : any = category.Fields;
    let fields : FieldType[] = [];

    Object.values(rawFields).forEach(field =>
    // Loop get field data over the field section in category
    {
        fields.push(getFieldData(field));
    }
    );

    return fields;
}

/**
 * Generates a list of CalculationType from a raw category in order to populate the CatgegoryType object of the passed in raw category
 * NO NEED TO EXPORT THIS FUNCTION, IT IS NOT PROPERLY TYPED, GET TYPES FROM "readJsonFile"
 * @param category a raw category from the JSON to extract the calculations out of 
 * @returns a list of CalculationType as extracted from the JSON
 */
function getCalculationsFromRaw(category : any) : CalculationType[]
{
    const rawCalulations : any = category.Calculations;
    let calculations : CalculationType[] = [];

    Object.values(rawCalulations).forEach(calculation =>
    // Loop get calc data over the calc section in category
    {
        calculations.push(getCalcData(calculation));
    }
    );
        
    return calculations;
}

/**
 * Extracts the field data from the JSON and create a FieldType.
 * NO NEED TO EXPORT THIS FUNCTION, IT IS NOT PROPERLY TYPED, GET TYPES FROM "readJsonFile"
 * @param field the field object to extract from
 * @returns a FieldType object with the data taken from the JSON
 */
function getFieldData(field : any) : FieldType
{
    let ret : FieldType = 
    {
        name : field.Name,
        prefix : field.Prefix,
        value : field.Value,
        postfix : field.Postfix,
        type : field.Type,
        displayvisible : field.DisplayVisiblity,
        entryvisible : field.EntryVisibility
    };

    return ret;
}

/**
 * Extracts the calculation data from the JSON and create a CalculationType.
 * NO NEED TO EXPORT THIS FUNCTION, IT IS NOT PROPERLY TYPED, GET TYPES FROM "readJsonFile"
 * @param calc the calculation object to extract from
 * @returns a CalculationType object with the data taken from the JSON
 */
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

// All other operations require use on the types rather than on the raw data

/**
 * Uses a TemplateData structure and iterates through its CategoryType list, producing a list of category names which can be
 * used elsewhere
 * @param template a TemplateData structure to extract the category names from
 * @returns A list of category names to be displayed where needed (or processed elsewhere)
 */
export function getCatNames(template : TemplateData) : string[]
{
    const cats : CategoryType[] = template.categories;
    let catNames : string[] = [];

    if(cats == undefined)
    {
        return catNames;
    }

    for(let cat of cats)
    {
        catNames.push(cat.name);
    }

    return catNames;
}

// Get field names from a category
/**
 * Returns a list of the field names from a given CategoryType object
 * @param category the chosen CategoryType object
 * @returns a list of field names
 */
export function getFieldsNames(category : CategoryType) : string[]
{
    const fields : FieldType[] = category.fields;
    let fieldNames : string[] = [];

    if(fields == undefined)
    {
        return fieldNames;
    }

    for(let field of fields)
    {
        fieldNames.push(field.name);
    }

    return fieldNames;
}

// From a cat name, get the object
/**
 * From a given category name, find the category object
 * @param catName the category name you are searching for
 * @param categories the list of categories inside the template
 * @returns the CategoryType object with that name
 */
export function findCatObject(catName : string, categories : CategoryType[]) : CategoryType
{
    let ret : CategoryType = {name : "", fields : [], calculations : []};

    if(categories == undefined)
    {
        return ret;
    }

    for(let cat of categories)
    {
        if(cat.name == catName)
        {
            return cat;
        }
    }

    return ret;
}

// From a field name and category get the object
/**
 * From a given field name, find the field object
 * @param fieldName the field name that you are searching for
 * @param category the category you are searching the fields of
 * @returns the FieldType object with that name
 */
export function findFieldObject(fieldName : string, category : CategoryType) : FieldType
{
    const fields : FieldType[] = category.fields;
    let ret : FieldType = {name : "", prefix : "", value : "", postfix : "", type : "", displayvisible : false, entryvisible : false};

    if(fields == undefined)
    {
        return ret;
    }

    for(let field of fields)
    {
        if(field.name == fieldName)
        {
            return field;
        }
    }

    return ret;
}

// From a calc name and category get the object
/**
 * From a given calculation name, find the calculation object
 * @param calcName the calculation name that you are searching for
 * @param category the category you are searching the calculations of
 * @returns the CalculationType object with that name
 */
export function findCalcObject(calcName : string, category : CategoryType) : CalculationType
{
    const calcs : CalculationType[] = category.calculations;
    let ret : CalculationType = {name : "", expression : "", type : "", output : ""};

    if(calcs == undefined)
    {
        return ret;
    }

    for(let calc of calcs)
    {
        if(calc.name == calcName)
        {
            return calc;
        }
    }

    return ret;
}