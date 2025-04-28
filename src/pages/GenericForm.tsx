import React, { useState, useEffect } from "react";
import { CategoryType } from "../types";
import { cleanString } from "../expressionParser";
import { createEntry } from "../database";

interface GenericFormProps {
  category: CategoryType; // TEMP changed to any
  readOnly: boolean; 
}

const GenericForm: React.FC<GenericFormProps> = ({ category, readOnly }) => {
  // Flatten the fields for easier handling.
  const flatFields = Object.fromEntries(category.fields.map((field) => [field.name, field]));

  // State for the current item’s field values.
  const [newItemValues, setNewItemValues] = useState<Record<string, string>>({});
  // State for the list of submitted items.
  const [items, setItems] = useState<Array<Record<string, string>>>([]);
  // Message display for adding an entry
  const [addMessage, setAddMessage] = useState<string | null>(null);

  // Update a field value.
  const handleFieldChange = (fieldKey: string, value: string) => {
    if (!readOnly) {
      setNewItemValues(prev => ({ ...prev, [fieldKey]: value }));
    }
  };

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
          <label htmlFor={key}>{cleanString(key)}:</label>
          <input
            id={key}
            type={mapFieldType(field.type)}
            value={newItemValues[key] || ""}
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

      await createEntry(category.name, newItemValues);
  
      const newItem = { ...newItemValues };
      setItems(prev => [...prev, newItem]);
      setNewItemValues({});

      setAddMessage("Entry successfully added!");
      console.log("Entry successfully added to the database.");
    } 
    catch (error) {
      console.error("Failed to create entry:", error);
      alert("Error saving entry. Please try again.");
    }
  };

  return (
    <div>
      <strong><h1>{cleanString(category.name)} Costs</h1></strong>
      <form onSubmit={handleSubmit} className="generic-form-container">
        {renderFields()}
        {!readOnly && ( // Hide the button if readOnly is true
          <button type="submit" style={{ marginTop: "10px" }}>Add Item</button>
        )}
      </form>
    </div>
  );
};

export default GenericForm;
