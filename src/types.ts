// centralized the type definitions here to avoid repeating them in multiple files
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
  Fields: Record<string, FieldType>;
  Calculations: Record<string, CalculationType>;
}

export interface TemplateData {
  templateName: string;
  Categories: Record<string, CategoryType>;
}
