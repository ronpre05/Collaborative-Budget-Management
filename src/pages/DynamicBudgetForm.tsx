import React, { useState } from "react";
import GenericForm from "./GenericForm";
import { cleanString } from "../expressionParser";
import { TemplateData } from "../types";
import { getTemplate } from "../newTemplateParser";
//manages the tab layout and dynamically displaying the appropriate budget category form based on the selected tab
type DBProps = {
  getCategoryName: (categoryName: string) => void;
};

const DynamicBudgetForm: React.FC<DBProps> = ({ getCategoryName }) => {
  const templateData : TemplateData = getTemplate(localStorage.getItem("template"));
  const categories = templateData.categories;
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <div>
      <h2>{templateData.templateName} - Budget Management</h2>
      <div className="tab-container">
        {categories.map((category, index) => (
          <div
            key={index}
            className={`tab ${activeTab === index ? "active-tab" : ""}`}
            onClick={() => {
              setActiveTab(index)
              getCategoryName(category.name)
            }}
          >
            {cleanString(category.name)}
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
