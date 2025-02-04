import React, { useState } from "react";
import { CategoryType, TemplateData } from "../types";
import templateDataJson from "../../template1.json";

const EquipmentCosts: React.FC = () => {
  // Extract the "EC" category from the template JSON
  const templateData = templateDataJson as TemplateData;
  const equipmentCategory: CategoryType = templateData.Categories.EC;

  // store multiple 'equipment lines'. Each line is just an object
  // keyed by the 'fieldKey' (like "What", "Why", "Amount").
  const [items, setItems] = useState<Array<Record<string, string>>>([]);

  // Temporary state holding the user’s input for a *new* item
  const [newItemValues, setNewItemValues] = useState<Record<string, string>>({});

  // Keep a running total of the "Amount" field
  const [totalCost, setTotalCost] = useState(0);

  // Update the field values as the user types
  const handleFieldChange = (fieldKey: string, value: string) => {
    setNewItemValues((prev) => ({ ...prev, [fieldKey]: value }));
  };

  // Handle form submission
  const handleAddEquipment = (event: React.FormEvent) => {
    event.preventDefault();

    // Validate required fields
    for (const [fieldKey, fieldDef] of Object.entries(equipmentCategory.Fields)) {
      if (!fieldDef.Visible) continue;
      if (!newItemValues[fieldKey] || newItemValues[fieldKey].trim() === "") {
        alert(`Please fill out the field: ${fieldKey}`);
        return;
      }
    }

    // Identify which key in newItemValues corresponds to "Amount" so we can parse it as a number for the total
    const amountFieldKey = Object.entries(equipmentCategory.Fields).find(
      ([, def]) => def.Name.toLowerCase() === "amount"
    )?.[0];

    let numericAmount = 0;
    if (amountFieldKey) {
      numericAmount = parseFloat(newItemValues[amountFieldKey] || "0");
      if (isNaN(numericAmount)) numericAmount = 0;
    }

    // Add new item to array
    setItems((prev) => [...prev, newItemValues]);

    // Update total
    setTotalCost((prev) => prev + numericAmount);

    // Reset form
    setNewItemValues({});
  };

  // Helper to pick an appropriate <input type> based on the JSON "Type"
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

  return (
    <div>
      <h2>{equipmentCategory.Name} Costs</h2>

      <form onSubmit={handleAddEquipment} style={{ display: "flex", flexDirection: "column", maxWidth: "400px" }}>
        {/* Generate inputs for each visible field */}
        {Object.entries(equipmentCategory.Fields).map(([fieldKey, field]) => {
          if (!field.Visible) return null;
          return (
            <div key={fieldKey} style={{ marginBottom: "0.5rem" }}>
              <label>
                {fieldKey}:
                <input
                  type={mapFieldType(field.Type)}
                  value={newItemValues[fieldKey] || ""}
                  onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
                  placeholder={field.Name}
                  style={{ marginLeft: "0.5rem" }}
                />
              </label>
            </div>
          );
        })}

        <button type="submit" style={{ marginTop: "10px" }}>Add Equipment</button>
      </form>

      <h3>Total Equipment Costs: £{totalCost.toFixed(2)}</h3>

      <ul style={{ maxWidth: "500px", listStyle: "none", padding: 0 }}>
        {items.map((item, index) => (
          <li
            key={index}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
            }}
          >
            {/* Display each field's value */}
            {Object.entries(equipmentCategory.Fields).map(([fieldKey, field]) => {
              if (!field.Visible) return null;
              return (
                <div key={fieldKey}>
                  <strong>{fieldKey}:</strong> {item[fieldKey] || ""}
                </div>
              );
            })}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EquipmentCosts;
