import React, { useEffect, useState } from "react";
import GenericForm from "./GenericForm";
import { cleanString } from "../expressionParser";
import { TemplateData } from "../types";

// Manages the tab layout and dynamically displaying the appropriate budget category
// form based on the selected tab
type DBProps = 
{
  getCategoryName: (categoryName: string) => void;
  readOnly: boolean;
  template : TemplateData;
};

const DynamicBudgetForm : React.FC<DBProps> = ({ getCategoryName, readOnly, template}) => 
  {
  const [activeTab, setActiveTab] = useState<number>(0);
  const categories = template.categories;
  useEffect(()=> 
  {
    getCategoryName(categories[0].name);
  }, [])
  return (
    <div>
      <h2>{template.templateName} - Budget Management</h2>
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
      <GenericForm category={categories[activeTab]} readOnly={readOnly} /> 
      </div>
    </div>
  );
};

export default DynamicBudgetForm;
