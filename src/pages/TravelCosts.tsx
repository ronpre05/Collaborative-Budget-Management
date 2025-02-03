import React, { useState } from "react";
import { CategoryType, TemplateData } from "../types";
import templateDataJson from "../../template1.json";

const TravelCosts: React.FC = () => {
  const templateData = templateDataJson as TemplateData;
  const travelCategory: CategoryType = templateData.Categories.TC;

  const [items, setItems] = useState<Array<Record<string, string>>>([]);
  const [newItemValues, setNewItemValues] = useState<Record<string, string>>({});
  const [totalTravelCost, setTotalTravelCost] = useState(0);

  const handleFieldChange = (fieldKey: string, value: string) => {
    setNewItemValues((prev) => ({ ...prev, [fieldKey]: value }));
  };

  const handleAddTravel = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    for (const [fieldKey, fieldDef] of Object.entries(travelCategory.Fields)) {
      if (!fieldDef.Visible) continue;
      if (!newItemValues[fieldKey]) {
        alert(`Please fill out the field: ${fieldKey}`);
        return;
      }
    }

    let days = 0, accomodation = 0, sustinance = 0, entryAmount = 0;
    
    const daysKey = Object.entries(travelCategory.Fields).find(([, def]) => def.Name.toLowerCase() === "days")?.[0];
    const accomKey = Object.entries(travelCategory.Fields).find(([, def]) => def.Name.toLowerCase() === "accomodation")?.[0];
    const sustKey = Object.entries(travelCategory.Fields).find(([, def]) => def.Name.toLowerCase() === "sustinance")?.[0];
    const entryKey = Object.entries(travelCategory.Fields).find(([key]) => key === "Entry.Amount")?.[0];

    if (daysKey && newItemValues[daysKey]) {
      days = parseFloat(newItemValues[daysKey]) || 0;
    }
    if (accomKey && newItemValues[accomKey]) {
      accomodation = parseFloat(newItemValues[accomKey]) || 0;
    }
    if (sustKey && newItemValues[sustKey]) {
      sustinance = parseFloat(newItemValues[sustKey]) || 0;
    }
    if (entryKey && newItemValues[entryKey]) {
      entryAmount = parseFloat(newItemValues[entryKey]) || 0;
    }

    const baseTotal = days * accomodation + days * sustinance;
    const total = baseTotal + entryAmount;

    // Store the new item
    const newItem = { ...newItemValues };
    newItem["calculatedTotal"] = total.toFixed(2);

    setItems((prev) => [...prev, newItem]);
    setTotalTravelCost((prev) => prev + total);

    setNewItemValues({});
  };

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
      <h2>{travelCategory.Name} Costs</h2>

      <form onSubmit={handleAddTravel} style={{ display: "flex", flexDirection: "column", maxWidth: "400px" }}>
        {Object.entries(travelCategory.Fields).map(([fieldKey, field]) => {
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

        <button type="submit" style={{ marginTop: "10px" }}>Add Travel Item</button>
      </form>

      <h3>Total Travel Costs: £{totalTravelCost.toFixed(2)}</h3>

      <ul style={{ maxWidth: "500px", listStyle: "none", padding: 0 }}>
        {items.map((travelItem, index) => (
          <li
            key={index}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px"
            }}
          >
            {Object.entries(travelCategory.Fields).map(([fieldKey, field]) => {
              if (!field.Visible) return null;
              return (
                <div key={fieldKey}>
                  <strong>{fieldKey}:</strong> {travelItem[fieldKey] || ""}
                </div>
              );
            })}

            <div>
              <strong>Calculated Total:</strong> £{travelItem["calculatedTotal"] || "0.00"}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TravelCosts;
