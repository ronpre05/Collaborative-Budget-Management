import { readFile } from "fs/promises";

const template : Promise<any> = readJsonFile(".\template1.json");
console.log(template);

async function readJsonFile(path : string) : Promise<any>
{
    const file = await readFile(path, "utf8");
    return JSON.parse(file);
}

function getTemplateName(template : any) : string
{
    let i = 0;

    
    while(template[i])
    // Loopp through each entry inside the template
    {
        if(template[i] == "templateName")
        // Check if its the templateName entry
        {
            // Return its value
            return template.templateName;
        }
        
        i++;
    }

    // Error if no template name found
        
    return "";
}

function getCategoriesSection(template : any) : any
{
    // Loop through the template
    // Find the section called "Categories"
    // Store that section in a variable
    // Return it
}

function getCategoryNames(categories : any) : string[]
{
    // Loop through the categories section
    // Save each section in a variable
    // Find its "Name" entry
    // Add to an array
    // Return the array

    return [""];
}

function getIndividualCategory(categories : any, categoryName : string) : any
{
    // Loop through the categories
    // Save each category
    // Check if its Name entry matches the categoryName
        // If so return it
}

function getFieldsSection(category : any) : any
{
    // Loop through the categories entries
    // Find the one called "Fields"
    // Store in a variable and return it
}

function getFieldNames(fields : any) : string[]
{
    // Loop through the fields section
    // Save each section in a variable
    // Find its "Name" entry
    // Add to an array
    // Return the array

    return [""];
}

function getIndividualField(fields : any, fieldName : string) : any
{
    // Loop through the fields
    // Save each field
    // Check if its Name entry matches the fieldName
        // If so return it
}

function getFieldPrefix(field : any) : string
{
    return field.Prefix;
}

function getFieldValue(field : any) : string
{
    return field.Value;
}

function getFieldPostfix(field : any) : string
{
    return field.Postfix;
}

function getFieldType(field : any) : string
{
    return field.Type;
}

function getFieldVisible(field : any) : boolean
{
    return field.Visible;
}

function getCalculationsSection(category : any) : any
{
    // Loop through the categories entries
    // Find the one called "Calculations"
    // Store in a variable and return it
}

function getCalculationNames(calculations : any) : string[]
{
    // Loop through the calculations section
    // Save each section in a variable
    // Find its "Name" entry
    // Add to an array
    // Return the array

    return [""];
}

function getIndividualCalculations(calculations : any, calcName : string) : any
{
    // Loop through the calculations
    // Save each calculation
    // Check if its Name entry matches the calcName
        // If so return it
}

function getFieldExpression(calc : any) : string
{
    return calc.Expression;
}
