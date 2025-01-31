import React, { useState } from "react";
import { CategoryType, TemplateData } from "../types";
import templateDataJson from "../../template1.json";

const GoodsServicesCosts: React.FC = () => {
  const templateData = templateDataJson as TemplateData;
  const goodsCategory: CategoryType = templateData.Categories.OGC;

  const [items, setItems] = useState<Array<Record<string, string>>>([]);
  const [newItemValues, setNewItemValues] = useState<Record<string, string>>({});
  const [totalCost, setTotalCost] = useState(0);

  const handleFieldChange = (fieldKey: string, value: string) => {
    setNewItemValues((prev) => ({ ...prev, [fieldKey]: value }));
  };

  const handleAddGoods = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    for (const [fieldKey, fieldDef] of Object.entries(goodsCategory.Fields)) {
      if (!fieldDef.Visible) continue;
      if (!newItemValues[fieldKey]) {
        alert(`Please fill out the field: ${fieldKey}`);
        return;
      }
    }

    // Identify the "Amount" field, parse as number
    const amountFieldKey = Object.entries(goodsCategory.Fields).find(
      ([, def]) => def.Name.toLowerCase() === "amount"
    )?.[0];

    let numericAmount = 0;
    if (amountFieldKey) {
      numericAmount = parseFloat(newItemValues[amountFieldKey] || "0");
      if (isNaN(numericAmount)) numericAmount = 0;
    }

    setItems((prev) => [...prev, newItemValues]);
    setTotalCost((prev) => prev + numericAmount);

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
      <h2>{goodsCategory.Name} Costs</h2>
      <form onSubmit={handleAddGoods} style={{ display: "flex", flexDirection: "column", maxWidth: "400px" }}>
        {Object.entries(goodsCategory.Fields).map(([fieldKey, field]) => {
          if (!field.Visible) return null;
          return (
            <div key={fieldKey}>
              <label>
                {fieldKey}:
                <input
                  type={mapFieldType(field.Type)}
                  value={newItemValues[fieldKey] || ""}
                  onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
                  placeholder={field.Name}
                />
              </label>
            </div>
          );
        })}

        <button type="submit" style={{ marginTop: "10px" }}>Add Cost</button>
      </form>

      <h3>Total Goods/Services Costs: £{totalCost.toFixed(2)}</h3>

      <ul>
        {items.map((item, index) => (
          <li key={index} style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "5px"
          }}>
            {Object.entries(goodsCategory.Fields).map(([fieldKey, field]) => {
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

export default GoodsServicesCosts;
