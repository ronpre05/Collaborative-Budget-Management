import React, { useState } from "react";
import templateDataJson from "../../template1.json";
import { getCategoriesObjectsFromTemplate, getTemplateName } from "../templateParser";
import GenericForm from "./GenericForm";

// Manages the tab layout and dynamically displays the appropriate budget category form.
const DynamicBudgetForm: React.FC = () => {
  const templateData = templateDataJson;
  const categories = getCategoriesObjectsFromTemplate(templateData);
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <div>
      <h1>{getTemplateName(templateData)} - Budget Management</h1>
      <div className="tab-container">
        {categories.map((category, index) => (
          <div
            key={index}
            className={`tab ${activeTab === index ? "active-tab" : ""}`}
            onClick={() => setActiveTab(index)}
          >
            {category.Name}
          </div>
        ))}
      </div>
      <div className="tab-content">
        <GenericForm category={categories[activeTab]} />
      </div>
    </div>
  );
};

export default DynamicBudgetForm;
