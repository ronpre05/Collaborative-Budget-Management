import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import DynamicBudgetForm from "./DynamicBudgetForm";
import ManageCollaborators from "./ManageCollaborators";
import { getProjectName, getUserRoleInProject, getCategoryID } from "../database";
import CategoryDisplay from "../categoryDisplay";
import { getCategoryDataCatOnly } from "../queryFunctions";
import { getTemplateFromID } from "../newTemplateParser";
import { categoryCalculation } from "../expressionParser";
import { TemplateData } from "@/types";

const ProjectView: React.FC = () => {
  const location = useLocation();
  
  const [currentCategory, setCurrentCategory] = useState<string>("");
  const [projectID, setProjectID] = useState<string | null>(null);
  const [projectName, setProjectName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<number | null>(null);
  const [roleName, setRoleName] = useState<string | null>(null);
  const [template, setTemplate] = useState<TemplateData>();

  const roleMapping: Record<number, string> = {
    1: "Institution Collaborator",
    2: "Institution Lead",
    3: "Project Investigator",
  };
  const [categoryData, setCategoryData] = useState<string[][]>([[]])
  const [currentCatID, setCurrentCatID] = useState<number>();
  
  
  const setCategoryName = (categoryName: string) => {
    console.log("selected category:", categoryName);
    setCurrentCategory(categoryName);
  };

  useEffect(() => {
    const fetchProjectDetails = async () => {
      const projectID = localStorage.getItem("projectID");

      if (!projectID) {
        console.error("No project ID found in localStorage.");
        return;
      }

      setProjectID(projectID); // Store projectID in state

      setTemplate(await getTemplateFromID(parseInt(projectID)));

      if(!template)
      {
        console.log(template);
        console.error("Error handling template for project: ", projectID);
        return;
      }

      // Fetch project name
      const name = await getProjectName();
      setProjectName(name);

      // Fetch user role in the project
      const role = await getUserRoleInProject(parseInt(projectID, 10));
      setUserRole(role);
      
      // Map the roleID to a role name
      if (role !== null) {
        const roleMapped = roleMapping[role];
        setRoleName(roleMapped || "Unknown Role"); // Fallback if the role isn't mapped
      }
    };

    fetchProjectDetails();
  }, []);


  useEffect(() => {
    const updateCatID = async () => {
      setCurrentCatID(await getCategoryID(currentCategory, Number(projectID)));
      console.log("Current category ID:", currentCatID);
    
      
      if(projectID)
      {
         setTemplate(await getTemplateFromID(parseInt(projectID)));
         if(template)
         {
          await categoryCalculation(currentCategory, Number(projectID), template);
         }
         else
         {
          console.error("Error handling template for project: ", projectID);
         }
         
      }
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

  if(!template)
  {
    return;
  }

  return (
    <div className="project-view">
      {/* Display the project name */}
      {projectName && <h1><strong>{projectName}</strong></h1>}
      {/* Show the user's role name */}
      {roleName && <p>User Role: {roleName}</p>}
      {/* Render the new generic cost management page */}
      {/* Only read-only for Institution Collaborators */}
      <DynamicBudgetForm getCategoryName={setCategoryName} readOnly={userRole === 1} categories={template.categories} templateName={template.templateName} />
      <CategoryDisplay data={categoryData} />
      <Link
          to="/create-project/manage-collaborators"
          className={`tab ${location.pathname === "/create-project/manage-collaborators" ? "active-tab" : ""}`}
        >
          Manage Collaborators
        </Link>

        <div className="tab-content">
        {location.pathname === "/create-project/manage-collaborators" && 
          projectID && userRole !== null && (
            <ManageCollaborators projectID={parseInt(projectID, 10)} userRole={userRole} />
          )}
      </div>
    </div>
  );
};

export default ProjectView;

