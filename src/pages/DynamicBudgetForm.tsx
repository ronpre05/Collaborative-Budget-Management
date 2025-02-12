import React, { useState } from "react";
import templateDataJson from "../../template1.json";
import { getCategoriesObjectsFromTemplate, getTemplateName } from "../templateParser";
import GenericForm from "./GenericForm";

const DynamicBudgetForm: React.FC = () => {
  // Get the full template from the JSON.
  const templateData = templateDataJson;
  // Use the parser to get an array of category objects.
  const categories = getCategoriesObjectsFromTemplate(templateData);
  // Keep track of which category tab is active (default to the first one).
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <div>
      <h1>{getTemplateName(templateData)} - Budget Management</h1>
      {/* Tab layout */}
      <div style={{ display: "flex", marginBottom: "20px" }}>
        {categories.map((category, index) => (
          <div
            key={index}
            onClick={() => setActiveTab(index)}
            style={{
              padding: "10px 20px",
              cursor: "pointer",
              borderBottom: activeTab === index ? "2px solid blue" : "2px solid transparent"
            }}
          >
            {category.Name}
          </div>
        ))}
      </div>
      {/* Render the generic form for the currently active category */}
      <div>
        <GenericForm category={categories[activeTab]} />
      </div>
    </div>
  );
};

export default DynamicBudgetForm;
