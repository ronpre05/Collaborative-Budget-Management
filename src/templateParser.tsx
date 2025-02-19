type FieldType = {
    name: string;
    prefix: string;
    value: string;
    postfix: string;
    type: string;
    visible: boolean;
  };
  
  // Reads and returns JSON data from a given path.
  export async function readJsonFile(path: string): Promise<any> {
    const response = await fetch(path);
    return await response.json();
  }
  
  // Gets the value in the "templateName" section of the JSON.
  export function getTemplateName(template: any): string {
    return template.templateName;
  }
  
  // Gets the whole Categories object from the JSON.
  export function getCategoriesSection(template: any): any[] {
    return template.Categories;
  }
  
  // Gets the names of the categories from the Categories object.
  export function getCategoryNames(categories: any): string[] {
    let catNames: string[] = [];
    Object.values(categories).forEach(value => {
      catNames.push((value as any).Name);
    });
    return catNames;
  }
  
  // Gets an array of category names from the template directly.
  export function getCatNamesFromTemplate(template: any): string[] {
    return getCategoryNames(getCategoriesSection(template));
  }
  
  // Gets the object of an individual category by name.
  export function getCategoryObject(categories: any, catName: string): any {
    let ret: any = [];
    Object.values(categories).forEach(value => {
      let cat: any = value;
      if (cat.Name === catName) {
        ret = cat;
      }
    });
    return ret;
  }
  
  // Gets an array of category objects from the template.
  export function getCategoriesObjectsFromTemplate(template: any): any[] {
    let catNames: string[] = getCatNamesFromTemplate(template);
    let categories: any = getCategoriesSection(template);
    let catObs: any[] = [];
    Object.values(catNames).forEach(value => {
      let cat: any = getCategoryObject(categories, value);
      catObs.push(cat);
    });
    return catObs;
  }
  
  // Gets the Fields section from a category.
  export function getFieldsSection(category: any): any {
    return category.Fields;
  }
  
  // Gets an array of field names from a fields object.
  export function getFieldNames(fields: any): string[] {
    let fieldNames: string[] = [];
    Object.values(fields).forEach(value => {
      fieldNames.push((value as any).Name);
    });
    return fieldNames;
  }
  
  // Gets a single field object by field name.
  export function getFieldObject(fields: any, fieldName: string): any {
    let ret: any = [];
    Object.values(fields).forEach(value => {
      let field: any = value;
      if (field.Name === fieldName) {
        ret = field;
      }
    });
    return ret;
  }
  
  // Gets an array of field objects from a category.
  export function getFieldObjectsFromCategory(category: any): FieldType[] {
    let fieldNames: string[] = getFieldNames(getFieldsSection(category));
    let fields: any = getFieldsSection(category);
    let fieldObs: FieldType[] = [];
    Object.values(fieldNames).forEach(value => {
      let field: any = getFieldObject(fields, value);
      fieldObs.push(getFieldData(field));
    });
    return fieldObs;
  }
  
  // Converts a field object into a FieldType structure.
  export function getFieldData(field: any): FieldType {
    let ret: FieldType = {
      name: field.Name,
      prefix: field.Prefix,
      value: field.Value,
      postfix: field.Postfix,
      type: field.Type,
      visible: field.Visible
    };
    return ret;
  }
  
  // Gets an array of FieldType structures from a category.
  export function getAllFieldData(category: any): FieldType[] {
    let fields: any[] = getFieldObjectsFromCategory(category);
    let fieldData: FieldType[] = [];
    Object.values(fields).forEach(value => {
      fieldData.push(getFieldData(value));
    });
    return fieldData;
  }
  
  /*
    Recursively flattens a (possibly nested) fields object.
    For nested fields, the keys are combined in dot notation.
    For example:
    {
      "Days": { ... },
      "Entry": {
         "Amount": { ... },
         "What": { ... }
      }
    }
    becomes:
    {
      "Days": { ... },
      "Entry.Amount": { ... },
      "Entry.What": { ... }
    }
  */
  export function flattenFields(
    fields: Record<string, any>,
    parentKey: string = ""
  ): Record<string, FieldType> {
    let result: Record<string, FieldType> = {};
    for (const key in fields) {
      const value = fields[key];
      const compoundKey = parentKey ? `${parentKey}.${key}` : key;
      if (value && typeof value === "object" && "Type" in value) {
        result[compoundKey] = getFieldData(value);
      } else if (value && typeof value === "object") {
        result = { ...result, ...flattenFields(value, compoundKey) };
      }
    }
    return result;
  }
  