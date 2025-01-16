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

    // Find the templateName entry inside the given string
    while(template[i])
    {
        if(template[i] == "templateName")
        {
            // Return its value
            return template.templateName;
        }
        
        i++;
    }

    // Error if no template name found
        
    return "";
}

function getCategoryNames(template : any) : string[]
{
    // Find the string section representing categories
    let i = 0;

    while(template[i])
    {
        if(template[i] == "Categories")
        {
            // Get an array ready to return
            let catNames : string[] = [];
            let j = 0;

            while(template[i][j])
            // Loop through this section
            {
                // Find each entry
                // Save as String[] temporarily
                let cat : any;
                cat = template[i][j];

                // Find its name entry
                // Add to an array
                catNames.push(cat.Name);

                j++;
            }

            // Return the array
            return catNames;
        }

        i++;
    }
    // Error if not such section found
    
    return [""];
}

function getFieldNames(template : any, category : string) : string[]
{
        // Find the string section representing categories
        let i = 0;

        while(template[i])
        {
            if(template[i] == "Categories")
            {
                let j = 0;

                while(template[i][j])
                // Loop through the categories section and find one with the name matching
                {
                    if(template[i][j].Name == category)
                    {
                        let k = 0;

                        while(template[i][j][k])
                        {
                            if(template[i][j][k] == "Fields")
                            // Find its fields section
                            {
                                // Get an array ready to return
                                let fieldNames : string[] = [];
                                let l = 0;

                                while(template[i][j][k][l])
                                // Loop through this section
                                {
                                    // Find each entry
                                    // Save as string[] temporarily
                                    let field : any;
                                    field = template[i][j][k][l];

                                    // Find its name entry
                                    // Add to an array
                                    fieldNames.push(field.Name);

                                    l++;
                                }
                                // Return the array
                                return fieldNames;
                            }
                            k++;
                        }
                        // Error if doesnt exist
                    }
                    j++;
                }
                // Error if no matching
            }
            i++;
        }
        // Error if not such section found
        
    return [""];
}

function getFieldType(template : any, category : string, field : string) : string
{
    let i = 0;

    while(template[i])
    {
        // Find the string section representing categories
        if(template[i] == "Categories")
        {
            let j = 0;

            while(template[i][j])
            {
                // Loop through the categories section and find one with the name matching
                if(template[i][j].Name == category)
                {
                    let k = 0;

                    while(template[i][j][k])
                    {
                        if(template[i][j][k] == "Fields")
                        // Find the string section representing fields
                        {
                            let l = 0;

                            while(template[i][j][k][l])
                                // Loop through this section
                            {
                                // Find each entry
                                    // Check if matches field name
                                if(template[i][j][k][l].Name == field)
                                {
                                    // If so, find the type entry
                                        // If doesn't exist give error
                                    return template[i][j][k][l].Type;
                                    // Return the type
                                }

                                l++;
                            }
                        }
                        k++;
                    }
                    // Error if not such section found
                }
                j++;
            }
            // Error if no matching
        }
        i++;
    }
    // Error if not such section found
        
    return "";
}   

function getCalulationNames(template : any, category : string) : string[]
{
    // Find the string section representing categories
    let i = 0;

    while(template[i])
    {
        if(template[i] == "Categories")
        {
            let j = 0;

            while(template[i][j])
            // Loop through the categories section and find one with the name matching
            {
                if(template[i][j].Name == category)
                {
                    let k = 0;

                    while(template[i][j][k])
                    {
                        if(template[i][j][k] == "Calculations")
                        // Find its calculations section
                        {
                            // Get an array ready to return
                            let calcNames : string[] = [];
                            let l = 0;

                            while(template[i][j][k][l])
                            // Loop through this section
                            {
                                // Find each entry
                                // Save as string[] temporarily
                                let calc : any;
                                calc = template[i][j][k][l];

                                // Find its name entry
                                // Add to an array
                                calcNames.push(calc.Name);

                                l++;
                            }
                            // Return the array
                            return calcNames;
                        }
                        k++;
                    }
                    // Error if doesnt exist
                }
                j++;
            }
            // Error if no matching
        }
        i++;
    }
    // Error if not such section found
    
    return [""];
}

function getExpression(template : any, category : string, calculation : string) : string
{
    let i = 0;

    while(template[i])
    {
        // Find the string section representing categories
        if(template[i] == "Categories")
        {
            let j = 0;

            while(template[i][j])
            {
                // Loop through the categories section and find one with the name matching
                if(template[i][j].Name == category)
                {
                    let k = 0;

                    while(template[i][j][k])
                    {
                        if(template[i][j][k] == "Calculations")
                        // Find the string section representing calculations
                        {
                            let l = 0;

                            while(template[i][j][k][l])
                                // Loop through this section
                            {
                                // Find each entry
                                    // Check if matches calculation name
                                if(template[i][j][k][l].Name == calculation)
                                {
                                    // If so, find the expression entry
                                        // If doesn't exist give error
                                    return template[i][j][k][l].Expression;
                                    // Return the type
                                }

                                l++;
                            }
                        }
                        k++;
                    }
                    // Error if not such section found
                }
                j++;
            }
            // Error if no matching
        }
        i++;
    }
    // Error if not such section found
        
    return "";
}

function getVisible(template : any, category : string, field : string) : boolean
{
    let i = 0;

    while(template[i])
    {
        // Find the string section representing categories
        if(template[i] == "Categories")
        {
            let j = 0;

            while(template[i][j])
            {
                // Loop through the categories section and find one with the name matching
                if(template[i][j].Name == category)
                {
                    let k = 0;

                    while(template[i][j][k])
                    {
                        if(template[i][j][k] == "Fields")
                        // Find the string section representing fields
                        {
                            let l = 0;

                            while(template[i][j][k][l])
                                // Loop through this section
                            {
                                // Find each entry
                                    // Check if matches field name
                                if(template[i][j][k][l].Name == field)
                                {
                                    // If so, find the visible entry
                                        // If doesn't exist give error
                                    return template[i][j][k][l].Visible;
                                    // Return the type
                                }

                                l++;
                            }
                        }
                        k++;
                    }
                    // Error if not such section found
                }
                j++;
            }
            // Error if no matching
        }
        i++;
    }
    // Error if not such section found
        
    return false;
}


