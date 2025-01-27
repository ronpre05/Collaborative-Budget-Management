import { readFile } from "fs/promises";

main();

function main()
{
    const template : Promise<any> = readJsonFile(".\template1.json");
    console.log(template);
}

async function readJsonFile(path : string) : Promise<any>
{
    const file = await readFile(path, "utf8");
    return JSON.parse(file);
}

function getTemplateName(template : any) : string
{
    let i = 0;

    
    while(template[i])
    // Loop through each entry inside the template
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
    let i = 0;

    while(template[i])
    // Loop through the template
    {
        if(template[i] = "Categories")
        // Find the section called "Categories"
        {
            // Return it
            return template[i];
        }

        i++;
    }
    
}

function getCategoryNames(categories : any) : string[]
{
    let i = 0;
    let catNames : string[] = [];

    while(categories[i])
    // Loop through the categories section
    {
        // Save each section in a variable
        let cat : any = categories[i];

        // Add to an array
        catNames.push(cat.Name);

        i++;
    }
    
    // Return the array
    return catNames;
}

function getIndividualCategory(categories : any, categoryName : string) : any
{
    let i = 0;
    
    while(categories[i])
    // Loop through the categories
    {
        // Save each category
        let cat : any = categories[i];

        if(cat.Name == categoryName)
        // Check if its Name entry matches the categoryName
        {
            // If so return it
            return cat;
        }

        i++;
    }
    
}

function getFieldsSection(category : any) : any
{
    let i = 0;

    while(category[i])
    // Loop through the categories entries
    {
        if(category[i] = "Fields")
        // Find the one called "Fields"
        {
            // Return it
            return category[i];
        }

        i++;
    }
}

function getFieldNames(fields : any) : string[]
{
    let i = 0;
    let fieldNames : string[] = [];

    while(fields[i])
    // Loop through the fields section
    {
        // Save each section in a variable
        let field : any = fields[i];

        // Add to an array
        fieldNames.push(field.Name);

        i++;
    }
    
    // Return the array
    return fieldNames;
}

function getIndividualField(fields : any, fieldName : string) : any
{
    let i = 0;

    while(fields[i])
    // Loop through the fields
    {
        // Save each field
        let field : any = fields[i];

        if(field.Name == fieldName)
        // Check if its Name entry matches the fieldName
        {
            // If so return it
            return field;
        }

        i++;
    }
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
    let i = 0;

    while(category[i])
    // Loop through the categories entries
    {
        if(category[i] = "Calculations")
        // Find the one called "Calculations"
        {
            // Return it
            return category[i];
        }

        i++;
    }
}

function getCalculationNames(calculations : any) : string[]
{
    let i = 0;
    let calcNames : string[] = [];

    while(calculations[i])
    // Loop through the calculations section
    {
        let calc : any = calculations[i];

        // Add to an array
        calcNames.push(calc.Name);

        i++;
    }
    
    // Return the array
    return calcNames;

}

function getIndividualCalculations(calculations : any, calcName : string) : any
{
    let i = 0;

    while(calculations[i])
    // Loop through the calculations
    {
        // Save each calculation
        let calc : any = calculations[i];

        if(calc.Name == calcName)
        // Check if its Name entry matches the calcName
        {
            // If so return it
            return calc;
        }
    
        i++;
    }
}

function getFieldExpression(calc : any) : string
{
    return calc.Expression;
}
