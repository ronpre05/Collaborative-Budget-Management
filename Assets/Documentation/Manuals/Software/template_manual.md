# Templates

Note that sections on parsing templates, expression and expression parsing are not currently present

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
        "Expression" : "String expression"
        "Type" : "How it should be evaluated"
        "Output" : "Name of field to output to"
    },
    …
}
```

The "Calculation Abbreviation" can be anything, it doesn't impact the internal workings of the template, nor does it get displayed to the user and so it can be disregarded. Internally a calculation has 4 attributes and no internal objects. The first attribute is "Name". This should not contain spaces and should instead use underscores to maintain consistency with the field names. Next is the "Expression" which stores what calculation should be carried out. Further details on how these work are available in the Expression section. Then there is the "Type", which defines how the calculation should be carried out. This can either be "Local", "Global" or "SubGlobal" and how these work will be explained in the Expression Parsing section. Finally there is the "Output" which states which field in the category the output should be saved to. This must be a field within the category.

### Sub Entries

A sub entry is a small collection of fields inside a category for which a single database entry may require them to have more than one value, and the groups of values entered together should be maintained. For example, in a "Travel_Costs" entry, you may require more than one entry for "What" and "Amount" for a single main entry of "Days" etc. Sub entries provide a way to allow for multiple "What" and "Amount" pairs to be added along with a single entry for the category. Not every category will have a "SubEntries" section. Any category that needs a "SubEntries" section must also have the "HasSubEntry" flag set to true, else the sub entries will be ignored. The "SubEntries" section is made up of a list of objects in exactly the same way that "Fields" is, and also contains a list of fields which follow the same format as in the "Fields" section. 










## Template Parsing

### How to use the Parser


### Template Data Types


## Formation of expressions

### How expressions are made


## Expression Parsing

### How variables are parsed

### Different evaluator types