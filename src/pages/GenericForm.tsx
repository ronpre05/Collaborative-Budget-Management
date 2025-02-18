import React, { useState } from "react";
import { CategoryType, FieldType } from "../types";
import { flattenFields } from "../templateParser";

interface GenericFormProps {
  category: CategoryType;
}

const GenericForm: React.FC<GenericFormProps> = ({ category }) => {
  // Flatten the fields for easier handling.
  const flatFields = flattenFields(category.Fields);

  // State for the current item’s field values (flat structure)
  const [newItemValues, setNewItemValues] = useState<Record<string, string>>({});
  // State for the list of submitted items
  const [items, setItems] = useState<Array<Record<string, string | number>>>([]);
  // Running total calculated from user-entered values (assumes "Amount" field)
  const [runningTotal, setRunningTotal] = useState(0);

  // Update field value
  const handleFieldChange = (fieldKey: string, value: string) => {
    setNewItemValues((prev) => ({ ...prev, [fieldKey]: value }));
  };

  // Map our field “Type” from the JSON to an appropriate input type.
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

  // Helper to determine if a field is a calculated field (i.e. its key exists in category.Calculations)
  const isCalculatedField = (fieldKey: string): boolean => {
    return category.Calculations && Object.keys(category.Calculations).includes(fieldKey);
  };

  // Render all (flattened) fields.
  const renderFields = () => {
    return Object.entries(flatFields).map(([key, field]) => {
      if (!field.visible) return null;

      // If this field is also defined in Calculations, render it as read‑only (or omit it)
      if (isCalculatedField(key)) {
        return (
          <div key={key} style={{ marginBottom: "0.5rem" }}>
            <label>
              {key}: <span>{/* You can display the computed value here if available */}</span>
            </label>
          </div>
        );
      }

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

    // Basic validation: ensure every visible (non-calculated) field has a value.
    for (const key in flatFields) {
      if (flatFields[key].visible && !newItemValues[key] && !isCalculatedField(key)) {
        alert(`Please fill out the field: ${key}`);
        return;
      }
    }

    // Instead of evaluating an expression, simply use the value of the "Amount" field.
    const amount = parseFloat(newItemValues["Amount"]) || 0;
    setItems((prev) => [...prev, newItemValues]);
    setRunningTotal((prev) => prev + amount);
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
      <h3>Total {category.Name} Costs: £{runningTotal.toFixed(2)}</h3>
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
              // Render only non‑calculated (user‑entered) fields here.
              if (!isCalculatedField(key)) {
                return (
                  <div key={key}>
                    <strong>{key}:</strong> {item[key] || ""}
                  </div>
                );
              }
              return null;
            })}
            {/* Optionally, if you want to display calculated values from category.Calculations */}
            {Object.entries(category.Calculations).map(([calcKey, calcDef]) => (
              <div key={calcKey}>
                <strong>{calcDef.Name}:</strong> {/* Display a computed value if available */}
              </div>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GenericForm;
