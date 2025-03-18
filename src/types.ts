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

export interface CalculationType 
{
    name : string;
    expression : string;
    type : string;
    output : string;
}

export interface CategoryType 
{
  name: string;
  //I used `any` for Fields so that nested fields (like "Entry") are allowed.
  fields: FieldType[];
  calculations: CalculationType[];
}

export interface TemplateData
{
  templateName: string;
  categories: CategoryType[];
}
