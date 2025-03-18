import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import DynamicBudgetForm from "./DynamicBudgetForm";
import ManageCollaborators from "./ManageCollaborators";
import { getProjectName, getCategoryID } from "../database";
import CategoryDisplay from "../categoryDisplay";
import { getCategoryDataCatOnly } from "../queryFunctions";
import template from "../../template1.json";
import { getTemplate } from "../newTemplateParser";
import { categoryCalculation } from "../expressionParser";

const ProjectView: React.FC = () => {
  const location = useLocation();
  const projectID = localStorage.getItem("projectID")
  const [currentCategory, setCurrentCategory] = useState<string>("");
  const [projectName, setProjectName] = useState<string | null>(null);
  const [categoryData, setCategoryData] = useState<string[][]>([[]])
  const [currentCatID, setCurrentCatID] = useState<number>();
  
  
  const setCategoryName = (categoryName: string) => {
    console.log("selected category:", categoryName);
    setCurrentCategory(categoryName);
  };

  useEffect(() => {
    const fetchProjectName = async () => {
      const name = await getProjectName();
      localStorage.setItem("template", JSON.stringify(template));
      setProjectName(name);
    };

    fetchProjectName();
  }, []);


  useEffect(() => {
    const updateCatID = async () => {
      setCurrentCatID(await getCategoryID(currentCategory, Number(projectID)));
      console.log("Current category ID:", currentCatID);
      
      
      if(projectID !== undefined)
         await categoryCalculation(currentCategory, Number(projectID), getTemplate(template));
    }
    updateCatID();
  }, [currentCategory])


  useEffect(() => {
    const updateCategoryData = async() => {
      if(currentCatID!== undefined)
        setCategoryData(await getCategoryDataCatOnly(currentCatID));
    }
    updateCategoryData();
  }, [currentCatID])

  return (
    <div className="project-view">
      {/* Display the project name */}
      {projectName && <h1>{projectName}</h1>}
      {/* Render the new generic cost management page */}
      <DynamicBudgetForm getCategoryName={setCategoryName} />
      <CategoryDisplay data={categoryData} />
      <Link
          to="/create-project/manage-collaborators"
          className={`tab ${location.pathname === "/create-project/manage-collaborators" ? "active-tab" : ""}`}
        >
          Manage Collaborators
        </Link>

        <div className="tab-content">
          {location.pathname === "/create-project/manage-collaborators" && <ManageCollaborators />}
      </div>
    </div>
  );
};

export default ProjectView;

