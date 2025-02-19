import React, { useState } from "react";
import { CategoryType } from "../types";
import { flattenFields } from "../templateParser";

interface GenericFormProps {
  category: CategoryType;
}

const GenericForm: React.FC<GenericFormProps> = ({ category }) => {
  // Flatten the fields for easier handling.
  const flatFields = flattenFields(category.Fields);

  // State for the current item’s field values.
  const [newItemValues, setNewItemValues] = useState<Record<string, string>>({});
  // State for the list of submitted items.
  const [items, setItems] = useState<Array<Record<string, string>>>([]);

  // Update a field value.
  const handleFieldChange = (fieldKey: string, value: string) => {
    setNewItemValues(prev => ({ ...prev, [fieldKey]: value }));
  };

  // Map our field "Type" from the JSON to an appropriate input type.
  const mapFieldType = (fieldType: string): string => {
    switch (fieldType) {
      case "Int":
      case "Float":
      case "Currency":
        return "number";
      case "String":
      default:
        return "text";
    }
  };

  // Render all (flattened) fields.
  const renderFields = () => {
    return Object.entries(flatFields).map(([key, field]) => {
      if (!field.visible) return null;
      return (
        <div key={key} style={{ marginBottom: "0.5rem" }}>
          <label>
            {key}:
            <input
              type={mapFieldType(field.type)}
              value={newItemValues[key] || ""}
              onChange={(e) => handleFieldChange(key, e.target.value)}
              placeholder={field.name}
              style={{ marginLeft: "0.5rem" }}
            />
          </label>
        </div>
      );
    });
  };

  // Handle form submission.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation: ensure every visible field has a value.
    for (const key in flatFields) {
      if (flatFields[key].visible && !newItemValues[key]) {
        alert(`Please fill out the field: ${key}`);
        return;
      }
    }
    // Create a new item from the current field values.
    const newItem = { ...newItemValues };
    setItems(prev => [...prev, newItem]);
    // Reset the form.
    setNewItemValues({});
  };

  return (
    <div>
      <h2>{category.Name} Costs</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", maxWidth: "400px" }}>
        {renderFields()}
        <button type="submit" style={{ marginTop: "10px" }}>Add Item</button>
      </form>
      <ul style={{ maxWidth: "500px", listStyle: "none", padding: 0 }}>
        {items.map((item, index) => (
          <li
            key={index}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px"
            }}
          >
            {Object.entries(flatFields).map(([key, field]) => {
              if (!field.visible) return null;
              return (
                <div key={key}>
                  <strong>{key}:</strong> {item[key] || ""}
                </div>
              );
            })}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GenericForm;
