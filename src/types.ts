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
  name : string;
  hassubentry : boolean;
  fields : FieldType[];
  calculations : CalculationType[];
  subentries : FieldType[];
}

export interface TemplateData
{
  templateName : string;
  categories : CategoryType[];
}
