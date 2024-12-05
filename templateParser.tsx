import template from "./template1.json"

function main()
{
    let i=0, j=0;
    //Get Name feature and store as name
    let templateName : String = findTemplateName();
    //Get names of categories
    let catNames : String[] = findCategoryNames();
    let catFields : String[][] = [];
    let catTypes : String[][] = [];

    //Get names (and types) of fields for each category
    catNames.forEach(element => 
    {
        catFields[i] = findCategoryFields(element);
        i++;
    });

    catNames.forEach(element =>
    {
        catTypes[j] = findCategoryTypes(element);
        j++;
    });

    console.log(template);
    console.log(templateName);
    console.log(catNames);
    console.log(catFields);
    console.log(catTypes);
}

function findTemplateName() : String
{
    return template.templateName;
}

function findCategoryNames() : String[]
{
    let i = 1;
    let catNames : String[] = [];
    
    //Loop through each category and find its .Name entry and add it to an array
    while(template[i])
    {
        catNames[i-1] = template[i].Name;
    }
    
    return catNames;
}

function findCat(catName : String)
{
    let i = 1;

    while(template[i])
    {
        if(template[i].Name == catName)
        {
            return template[i];
        }
    }
}

function findCategoryFields(catName : String) : String[]
{
    //For the given category, go to its .Fields entry, and return an array containing the field names
    let i = 0;
    let fieldNames : String[] = [];
    let category = findCat(catName);

    while(category.Fields[i])
    {
        fieldNames[i] = category.Fields[i];
    }

    return fieldNames;
}

function findCategoryTypes(catName : String) : String[]
{
    //For the given category, go to its .Fields entry, and return an array containing the types
    //These shoiuld be in the same indexes as the field names so that they can be paired later
    let i=0;
    let fieldTypes : String[] = [];
    let category = findCat(catName);

    while(category.Fields[i])
    {
        fieldTypes[i] = category.Fields[i];
    }

    return fieldTypes;
}