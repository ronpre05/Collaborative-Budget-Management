// Gets the template name from the JSON
export function getTemplateName(template: any): string {
    return template.templateName;
  }
  
  // Gets the Categories section from the JSON
  export function getCategoriesSection(template: any): any[] {
    return template.Categories;
  }
  
  // Gets an array of category names from the Categories section
  export function getCategoryNames(categories: any): string[] {
    const catNames: string[] = [];
    Object.values(categories).forEach(value => {
      catNames.push((value as any).Name);
    });
    return catNames;
  }
  
  // Returns an array of category names directly from the template
  export function getCatNamesFromTemplate(template: any): string[] {
    return getCategoryNames(getCategoriesSection(template));
  }
  
  // Returns the object for a given category name
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
  
  // Returns an array of category objects from the template
  export function getCategoriesObjectsFromTemplate(template: any): any[] {
    const catNames: string[] = getCatNamesFromTemplate(template);
    const categories: any = getCategoriesSection(template);
    const catObs: any[] = [];
    Object.values(catNames).forEach(value => {
      const cat: any = getCategoryObject(categories, value);
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
    const fieldNames: string[] = [];
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
  
  // Returns an array of field objects from a category.
  export function getFieldObjectsFromCategory(category: any): any[] {
    const fieldNames: string[] = getFieldNames(getFieldsSection(category));
    const fields: any = getFieldsSection(category);
    const fieldObs: any[] = [];
    Object.values(fieldNames).forEach(value => {
      const field: any = getFieldObject(fields, value);
      fieldObs.push(getFieldData(field));
    });
    return fieldObs;
  }
  
  // Converts a field object into a structured FieldType.
  export function getFieldData(field: any): any {
    return {
      name: field.Name,
      prefix: field.Prefix,
      value: field.Value,
      postfix: field.Postfix,
      type: field.Type,
      visible: field.Visible
    };
  }
  
  // Recursively flattens a (possibly nested) fields object into dot notation.
  export function flattenFields(
    fields: Record<string, any>,
    parentKey: string = ""
  ): Record<string, any> {
    let result: Record<string, any> = {};
    for (const key in fields) {
      const value = fields[key];
      const compoundKey = parentKey ? `${parentKey}.${key}` : key;
      if (value && typeof value === "object" && "Type" in value) {
        result[compoundKey] = value;
      } else if (value && typeof value === "object") {
        result = { ...result, ...flattenFields(value, compoundKey) };
      }
    }
    return result;
  }
  