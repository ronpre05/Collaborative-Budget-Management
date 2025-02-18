import { TemplateData, FieldType, CalculationType, CategoryType } from "./types";

/* --- Node-specific code (commented out for browser usage) ---
 import { readFile } from "fs/promises";
 import { validateHeaderName } from "http";

 main("template1.json");
 async function main(templateName: string) {
     const template: any = await readJsonFile(templateName);
 }

 async function readJsonFile(path: string): Promise<any> {
     const file = await readFile(path, "utf8");
     return JSON.parse(file);
 }
*/


//Gets the value in the "templateName" section of the JSON.
export function getTemplateName(template: any): string {
    return template.templateName;
}

/**
 * Gets the whole Categories object from the JSON.
 */
export function getCategoriesSection(template: any): any[] {
    return template.Categories;
}


//Gets the names of the categories from the Categories object.
export function getCategoryNames(categories: any): string[] {
    let catNames: string[] = [];
    Object.values(categories).forEach(value => {
        catNames.push((value as any).Name);
    });
    return catNames;
}


//Gets an array of category names from the template directly.
export function getCatNamesFromTemplate(template: any): string[] {
    return getCategoryNames(getCategoriesSection(template));
}


//Gets the object of an individual category by name.
export function getCategoryObject(categories: any, catName: string): any {
    let ret: any = [];
    Object.values(categories).forEach(value => {
        let cat: any = value;
        if (cat.Name == catName) {
            ret = cat;
        }
    });
    return ret;
}


 //Gets an array of category objects from the template.
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


//Gets the Fields section from a category.
export function getFieldsSection(category: any): any {
    return category.Fields;
}


//Gets an array of field names from a fields object.
export function getFieldNames(fields: any): string[] {
    let fieldNames: string[] = [];
    Object.values(fields).forEach(value => {
        fieldNames.push((value as any).Name);
    });
    return fieldNames;
}


//Gets a single field object by field name.
export function getFieldObject(fields: any, fieldName: string): any {
    let ret: any = [];
    Object.values(fields).forEach(value => {
        let field: any = value;
        if (field.Name == fieldName) {
            ret = field;
        }
    });
    return ret;
}


//Gets an array of field objects from a category.
export function getFieldObjectsFromCategory(category: any): any[] {
    let fieldNames: string[] = getFieldNames(getFieldsSection(category));
    let fields: any = getFieldsSection(category);
    let fieldObs: any[] = [];
    Object.values(fieldNames).forEach(value => {
        let field: any = getFieldObject(fields, value);
        fieldObs.push(field);
    });
    return fieldObs;
}


//Converts a field object into a FieldType structure.
export function getFieldData(field: any): FieldType {
    let ret: FieldType = {
        Name: field.Name,
        Prefix: field.Prefix,
        Value: field.Value,
        Postfix: field.Postfix,
        Type: field.Type,
        Visible: field.Visible
    };
    return ret;
}


//Gets an array of FieldType structures from a category.
export function getAllFieldData(category: any): FieldType[] {
    let fields: any[] = getFieldObjectsFromCategory(category);
    let fieldData: FieldType[] = [];
    Object.values(fields).forEach(value => {
        fieldData.push(getFieldData(value));
    });
    return fieldData;
}


//Returns the Prefix property of a field.
export function getFieldPrefix(field: any): string {
    return field.Prefix;
}


//Returns the Value property of a field.
export function getFieldValue(field: any): string {
    return field.Value;
}


//Returns the Postfix property of a field.
export function getFieldPostfix(field: any): string {
    return field.Postfix;
}


//Returns the Type property of a field.
export function getFieldType(field: any): string {
    return field.Type;
}


//Returns the Visible property of a field.
export function getFieldVisible(field: any): boolean {
    return field.Visible;
}


//Gets the Calculations section from a category.
export function getCalculationsSection(category: any): any {
    return category.Calculations;
}


//Gets an array of calculation names from the Calculations section.
export function getCalculationNames(calculations: any): string[] {
    let calcNames: string[] = [];
    Object.values(calculations).forEach(value => {
        calcNames.push((value as any).Name);
    });
    return calcNames;
}


//Gets a single calculation object by calculation name.
 export function getCalculationObject(calculations: any, calcName: string): any {
    let ret: any = [];
    Object.values(calculations).forEach(value => {
        let calc: any = value;
        if (calc.Name == calcName) {
            ret = calc;
        }
    });
    return ret;
}


//Gets an array of calculation objects from a category.
export function getCalcObjectsFromCategory(category: any): any[] {
    let calcNames: string[] = getCalculationNames(getCalculationsSection(category));
    let calcs: any = getCalculationsSection(category);
    let calcObs: any[] = [];
    Object.values(calcNames).forEach(value => {
        let calc: any = getCalculationObject(calcs, value);
        calcObs.push(calc);
    });
    return calcObs;
}


 //Converts a calculation object into a CalculationType structure.
export function getCalcData(calc: any): CalculationType {
    let ret: CalculationType = {
        name: calc.Name,
        expression: calc.Expression
    };
    return ret;
}


//Gets an array of CalculationType structures from a category.
 
export function getAllCalcData(category: any): CalculationType[] {
    let calcs: any[] = getCalcObjectsFromCategory(category);
    let calcData: CalculationType[] = [];
    Object.values(calcs).forEach(value => {
        calcData.push(getCalcData(value));
    });
    return calcData;
}

/*
  Recursively flattens a (possibly nested) fields object.
  For nested fields, the keys are combined in dot notation.
 
  Example:
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
      result[compoundKey] = value as FieldType;
    } else if (value && typeof value === "object") {
      result = { ...result, ...flattenFields(value, compoundKey) };
    }
  }
  return result;
}
