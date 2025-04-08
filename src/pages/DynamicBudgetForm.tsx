import React, { useEffect, useState } from "react";
import GenericForm from "./GenericForm";
import { cleanString } from "../expressionParser";
import { CategoryType } from "../types";

//manages the tab layout and dynamically displaying the appropriate budget category form based on the selected tab
type DBProps = 
{
  getCategoryName: (categoryName: string) => void;
  readOnly: boolean;
  categories : CategoryType[];
  templateName : string;
};

const DynamicBudgetForm : React.FC<DBProps> = ({ getCategoryName, readOnly, categories, templateName}) => 
  {
  const [activeTab, setActiveTab] = useState<number>(0);
  useEffect(()=> 
    {
    getCategoryName(categories[0].name);
  }, [])
  return (
    <div>
      <h2>{templateName} - Budget Management</h2>
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
