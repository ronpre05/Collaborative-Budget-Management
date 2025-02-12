import React, { useState } from "react";
import { CategoryType, FieldType } from "../types";
import { flattenFields } from "../templateParser";

interface GenericFormProps {
  category: CategoryType;
}

const GenericForm: React.FC<GenericFormProps> = ({ category }) => {
  // Flatten the fields for easy handling.
  const flatFields = flattenFields(category.Fields);

  // State for the current (new) item’s field values (stored in a flat structure)
  const [newItemValues, setNewItemValues] = useState<Record<string, string>>({});
  // State for the list of submitted items
  const [items, setItems] = useState<Array<Record<string, string | number>>>([]);
  // Running total (using the “Total” calculation if available)
  const [runningTotal, setRunningTotal] = useState(0);

  // Update field value
  const handleFieldChange = (fieldKey: string, value: string) => {
    setNewItemValues(prev => ({ ...prev, [fieldKey]: value }));
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

  /**
   * Evaluate the calculation expressions using the current field values.
   * This function:
   *  - Converts each field value to a number (or, if the key includes "date", converts it to a timestamp).
   *  - Pre-processes expressions (e.g. removes any “.Value” suffix).
   *  - Uses a Function constructor to evaluate the expression in a safe context.
   */
  const evaluateCalculations = (values: Record<string, string>): Record<string, number> => {
    const calcResults: Record<string, number> = {};
    // Create a context of numeric values from our input.
    const context: Record<string, number> = {};
    for (const key in values) {
      // If the field key looks like a date (by name), convert it to a timestamp.
      if (key.toLowerCase().includes("date")) {
        const date = new Date(values[key]);
        context[key] = isNaN(date.getTime()) ? 0 : date.getTime();
      } else {
        context[key] = parseFloat(values[key]) || 0;
      }
    }
    // Loop over each calculation defined in the category.
    for (const calcKey in category.Calculations) {
      let expression = category.Calculations[calcKey].Expression;
      // Pre‑process: remove occurrences of “.Value” (so “Amount.Value” becomes “Amount”)
      expression = expression.replace(/\.Value/g, "");
      try {
        // Create a new function whose parameters are the keys in our context.
        const func = new Function(...Object.keys(context), "return " + expression + ";");
        const result = func(...Object.values(context));
        // Save the result both in our calculation results and in our context (for later calculations that might depend on it)
        calcResults[calcKey] = result;
        context[calcKey] = result;
      } catch (error) {
        console.error("Error evaluating expression:", expression, error);
        calcResults[calcKey] = 0;
        context[calcKey] = 0;
      }
    }
    return calcResults;
  };

  // Render all (flattened) fields.
  const renderFields = () => {
    return Object.entries(flatFields).map(([key, field]) => {
      if (!field.Visible) return null;
      return (
        <div key={key} style={{ marginBottom: "0.5rem" }}>
          <label>
            {key}:
            <input
              type={mapFieldType(field.Type)}
              value={newItemValues[key] || ""}
              onChange={(e) => handleFieldChange(key, e.target.value)}
              placeholder={field.Name}
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
    // Basic validation: check that every visible field has a value.
    for (const key in flatFields) {
      if (flatFields[key].Visible && !newItemValues[key]) {
        alert(`Please fill out the field: ${key}`);
        return;
      }
    }
    // Evaluate calculations using the current field values.
    const calcResults = evaluateCalculations(newItemValues);
    // If a “Total” calculation exists, use it for the running total.
    const itemTotal = calcResults["Total"] || 0;
    // Combine the field values and the calculated results into one record.
    const newItem = { ...newItemValues, ...calcResults };
    setItems(prev => [...prev, newItem]);
    setRunningTotal(prev => prev + itemTotal);
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
              if (!field.Visible) return null;
              return (
                <div key={key}>
                  <strong>{key}:</strong> {item[key] || ""}
                </div>
              );
            })}
            {Object.entries(category.Calculations).map(([calcKey, calcDef]) => (
              <div key={calcKey}>
                <strong>{calcDef.Name}:</strong> {item[calcKey] !== undefined ? item[calcKey] : ""}
              </div>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GenericForm;
