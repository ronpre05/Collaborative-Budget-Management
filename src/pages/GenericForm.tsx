import React, { useState, useEffect } from "react";
import { CategoryType, FieldType } from "../types";
import { cleanString } from "../expressionParser";
import { createEntry, createEntryWithSubEntry } from "../database";
import { findFieldObject, findSubEntryObject } from "../TemplateParser";

interface GenericFormProps {
  category: CategoryType;
  readOnly: boolean; 
}

const GenericForm: React.FC<GenericFormProps> = ({ category, readOnly }) => {
  // Hold if the category has a sub entry or not
  const hasSubEntry : boolean = category.hassubentry;
  let createdSubEntries : Array<Record<string, string>> = [];

  const flatFields = Object.fromEntries(category.fields.map((field) => [field.name, field]));
  const subEntries = Object.fromEntries(category.subentries.map((subentry) => [subentry.name, subentry]))

  // State for the current item’s field values.
  const [newItemValues, setNewItemValues] = useState<Record<string, string>>({});
  // State for the list of submitted items.
  const [items, setItems] = useState<Array<Record<string, string>>>([]);
  // Message display for adding an entry
  const [addMessage, setAddMessage] = useState<string | null>(null);
  // State for current sub entry item's field values
  const [subEntryItemValues, setSubEntryItemValues] = useState<Record<string, string>>({});
  const [subItems, setSubItems] = useState<Array<Record<string,string>>>([]);

  // Update a field value.
  const handleFieldChange = (fieldKey: string, value: string) => {
    if (!readOnly) {
      setNewItemValues(prev => ({ ...prev, [fieldKey]: value }));
    }
  };

  const handleSubFieldChange = (field : string, value: string) =>
  {
    if(!readOnly)
    {
      setSubEntryItemValues(prev => ({ ...prev, [field]: value}))
    }
  }

  const applyPrefix = (fieldName : string) =>
  {
    let field : FieldType = findFieldObject(fieldName, category);
    let out : string = "";
    if(field.name !== fieldName)
    { 
      field = findSubEntryObject(fieldName, category);
    }

    out = (field.prefix + " " + cleanString(fieldName) + " " + field.postfix);
    
    return out;
  }

  // Reset add success message when category changes
  useEffect(() => {
    setAddMessage(null);
  }, [category]);

  // Map our field "Type" from the JSON to an appropriate input type.
  const mapFieldType = (fieldType: string): string => {
    switch (fieldType) {
      case "Int":
      case "Float":
      case "Currency":
        return "number";
      case "Date":
        return "Date";
      case "String":
      default:
        return "text";
    }
  };

  // Render all (flattened) fields.
  const renderFields = () => {
    return Object.entries(flatFields).map(([key, field]) => {
      if (readOnly || !field.entryvisible) return null;
      return (
        <div key={key} className="form-group">
          <label htmlFor={key}>{applyPrefix(key)}:</label>
          <input
            id={key}
            type={mapFieldType(field.type)}
            value={newItemValues[key] || ""}
            placeholder={field.value}
            onChange={(e) => handleFieldChange(key, e.target.value)}
          />
        </div>
      );
    });
  };

  // Handle form submission.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (readOnly) return; // Prevent submission in read-only mode
    // Basic validation: ensure every visible field has a value.
    for (const key in flatFields) {
      if (flatFields[key].entryvisible && !newItemValues[key]) {
        alert(`Please fill out the field: ${cleanString(key)}`);
        return;
      }
    }

    try {
      // Call createEntry to store the data in the database

      if(hasSubEntry)
      {
        createdSubEntries = subItems;
        await createEntryWithSubEntry(category.name, newItemValues, createdSubEntries, category);
        createdSubEntries = [];
      }
      else
      {
        await createEntry(category.name, newItemValues, category);
      }

      const newItem = { ...newItemValues };
      setItems(prev => [...prev, newItem]);
      setNewItemValues({});
      setSubEntryItemValues({});
      setSubItems([]);

      setAddMessage("Entry successfully added!");
    } 
    catch (error) {
      console.error("Failed to create entry:", error);
      alert("Error saving entry. Please try again.");
    }
  };

  const handleSubEntry = async (e: React.FormEvent) =>
  {
    e.preventDefault();
    if(readOnly)
    {
      return;
    }

    for (const key in subEntries)
    {
      if(subEntries[key].entryvisible && !subEntryItemValues[key])
      {
        alert(`Please fill out this field: ${cleanString(key)}`);
        return;
      }
    }

    const newSubItem = { ...subEntryItemValues };
    setSubItems(prev => [...prev, newSubItem]); 

    // Add to created sub entries not the database
    createdSubEntries.push(subEntryItemValues);
    setSubEntryItemValues({});
  };

  const renderSubEntry = () =>
  {
    return Object.entries(subEntries).map(([key, field]) =>
    {
      if(readOnly || !field.entryvisible)
      {
        return null;
      }

      return (
        <div key={key} className="form-group">
          <label htmlFor={key}>{applyPrefix(key)}:</label>
          <input
            id={key}
            type={mapFieldType(field.type)}
            value={subEntryItemValues[key] || ""}
            placeholder={field.value}
            onChange={(e) => handleSubFieldChange(key, e.target.value)}
          />
        </div>
      );
    });
  };

  return (
    <div>
      <strong><h1>{cleanString(category.name)} Costs</h1></strong>
      <form onSubmit={handleSubmit} className="generic-form-container">
        {renderFields()}
        {!readOnly && ( // Hide the button if readOnly is true
          <button type="submit" style={{ marginTop: "10px", marginBottom: "10px" }}>Add Item</button>
        )}
      </form>
      {hasSubEntry && (
        <form onSubmit={handleSubEntry} className="generic-form-container">
          {renderSubEntry()}
          {!readOnly && (
            <button type="submit" style={{ marginTop : "10px" }}>Add Sub Entry</button>
          )}
        </form>
      )}
    </div>
  );
};

export default GenericForm;
