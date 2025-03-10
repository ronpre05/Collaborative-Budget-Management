import React, { useState } from "react";
import templateDataJson from "../../template1.json";
import { getCategoriesObjectsFromTemplate, getTemplateName } from "../templateParser";
import GenericForm from "./GenericForm";
import { cleanString } from "../expressionParser";
//manages the tab layout and dynamically displaying the appropriate budget category form based on the selected tab
const DynamicBudgetForm: React.FC = () => {
  const templateData = templateDataJson;
  const categories = getCategoriesObjectsFromTemplate(templateData);
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <div>
      <h2>{getTemplateName(templateData)} - Budget Management</h2>
      <div className="tab-container">
        {categories.map((category, index) => (
          <div
            key={index}
            className={`tab ${activeTab === index ? "active-tab" : ""}`}
            onClick={() => setActiveTab(index)}
          >
            {cleanString(category.Name)}
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
