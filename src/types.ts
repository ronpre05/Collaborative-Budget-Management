export interface FieldType {
  Name: string;
  Prefix: string;
  Value: string;
  Postfix: string;
  Type: string; 
  Visible: boolean;
}

export interface CalculationType {
  Name: string;
  Expression: string;
}

export interface CategoryType {
  Name: string;
  //I used `any` for Fields so that nested fields (like "Entry") are allowed.
  Fields: Record<string, any>;
  Calculations: Record<string, CalculationType>;
}

export interface TemplateData {
  templateName: string;
  Categories: Record<string, CategoryType>;
}
