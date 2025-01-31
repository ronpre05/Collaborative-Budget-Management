import React, { useState } from "react";
import { CategoryType, TemplateData } from "../types";
import templateDataJson from "../../template1.json";

const PersonnelCosts: React.FC = () => {
  // "PC" is your Personnel category
  const templateData = templateDataJson as TemplateData;
  const personnelCategory: CategoryType = templateData.Categories.PC;

  // Array of items
  const [personnel, setPersonnel] = useState<Array<Record<string, string>>>([]);
  const [newItemValues, setNewItemValues] = useState<Record<string, string>>({});
  const [totalCost, setTotalCost] = useState(0);

  const handleFieldChange = (fieldKey: string, value: string) => {
    setNewItemValues((prev) => ({ ...prev, [fieldKey]: value }));
  };

  const handleAddPersonnel = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    for (const [fieldKey, fieldDef] of Object.entries(personnelCategory.Fields)) {
      if (!fieldDef.Visible) continue;
      if (!newItemValues[fieldKey]) {
        alert(`Please fill out the field: ${fieldKey}`);
        return;
      }
    }

    //We parse "Start Date" and "End Date" as actual date objects
    const startDateKey = Object.entries(personnelCategory.Fields).find(
      ([, def]) => def.Name.toLowerCase().includes("startdate")
    )?.[0];
    const endDateKey = Object.entries(personnelCategory.Fields).find(
      ([, def]) => def.Name.toLowerCase().includes("enddate")
    )?.[0];
    const percentageKey = Object.entries(personnelCategory.Fields).find(
      ([, def]) => def.Name.toLowerCase().includes("percentage")
    )?.[0];
    const amountKey = Object.entries(personnelCategory.Fields).find(
      ([, def]) => def.Name.toLowerCase() === "amount"
    )?.[0];

    let personMonths = 0;
    let numericAmount = 0;

    if (startDateKey && endDateKey && percentageKey) {
      const sDate = new Date(newItemValues[startDateKey]);
      const eDate = new Date(newItemValues[endDateKey]);
      const perc = parseFloat(newItemValues[percentageKey]) || 0;

      // Simple check: full-month difference
      const monthsWorked =
        (eDate.getFullYear() - sDate.getFullYear()) * 12 +
        (eDate.getMonth() - sDate.getMonth());

      personMonths = monthsWorked * (perc / 100);
      if (personMonths < 0) personMonths = 0; // in case dates are reversed
    }

    if (amountKey) {
      numericAmount = parseFloat(newItemValues[amountKey]) || 0;
    }

    // Suppose total cost for this item is "amount * personMonths" 
    const itemTotal = numericAmount * personMonths;

    // Save the new item
    const newItem = { ...newItemValues };
    // We can store the calculated "personMonths" or "itemTotal" as extra fields for display:
    newItem["personMonthsCalculated"] = personMonths.toFixed(2);
    newItem["totalCost"] = itemTotal.toFixed(2);

    setPersonnel((prev) => [...prev, newItem]);
    setTotalCost((prev) => prev + itemTotal);

    // Clear the form
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
      <h2>{personnelCategory.Name} Costs</h2>

      <form onSubmit={handleAddPersonnel} style={{ display: "flex", flexDirection: "column", maxWidth: "400px" }}>
        {Object.entries(personnelCategory.Fields).map(([fieldKey, field]) => {
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

        <button type="submit" style={{ marginTop: "10px" }}>Add Personnel</button>
      </form>

      <h3>Total Personnel Costs: £{totalCost.toFixed(2)}</h3>

      <ul style={{ maxWidth: "500px", listStyle: "none", padding: 0 }}>
        {personnel.map((person, index) => (
          <li
            key={index}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px"
            }}
          >
            {Object.entries(personnelCategory.Fields).map(([fieldKey, field]) => {
              if (!field.Visible) return null;
              return (
                <div key={fieldKey}>
                  <strong>{fieldKey}:</strong> {person[fieldKey] || ""}
                </div>
              );
            })}

            {/* Display our custom-calculated fields too */}
            <div>
              <strong>Person Months (Calculated):</strong> {person["personMonthsCalculated"] || "0"}
            </div>
            <div>
              <strong>Total Cost:</strong> £{person["totalCost"] || "0.00"}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PersonnelCosts;
