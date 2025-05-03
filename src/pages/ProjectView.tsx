import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import DynamicBudgetForm from "./DynamicBudgetForm";
import ManageCollaborators from "./ManageCollaborators";
import CategoryDisplay from "../categoryDisplay";
import { getCategoryDataCatOnly } from "../queryFunctions";
import { getTemplateFromID } from "../newTemplateParser";
import { categoryCalculation } from "../expressionParser";
import { TemplateData } from "@/types";
<<<<<<< HEAD
import { getProjectName, getUserRoleInProject, fetchProjectLockStatus, updateProjectLockStatus, getCategoryID,
} from "../database"; // Refactored database functions
=======
import { Button } from "../components/ui/button.tsx";
>>>>>>> 47e3905e4105b140000c30d44b1138ec9fc7ae57

const ProjectView: React.FC = () => {
  const location = useLocation();

  const [currentCategory, setCurrentCategory] = useState<string>("");
  const [projectID, setProjectID] = useState<string | null>(null);
  const [projectName, setProjectName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<number | null>(null);
  const [roleName, setRoleName] = useState<string | null>(null);
  const [template, setTemplate] = useState<TemplateData>();
  const [categoryData, setCategoryData] = useState<string[][]>([[]]);
  const [currentCatID, setCurrentCatID] = useState<number>();
  const [isLocked, setIsLocked] = useState<boolean>(false);

  const roleMapping: Record<number, string> = {
    1: "Institution Collaborator",
    2: "Institution Lead",
    3: "Project Investigator",
  };

  const setCategoryName = (categoryName: string) => {
    console.log("selected category:", categoryName);
    setCurrentCategory(categoryName);
  };

  useEffect(() => {
    const fetchProjectDetails = async () => {
      const storedID = localStorage.getItem("projectID");

      if (!storedID) {
        console.error("No project ID found in localStorage.");
        return;
      }

      setProjectID(storedID);

      const templateData = await getTemplateFromID(parseInt(storedID));
      setTemplate(templateData);
      if (!templateData) {
        console.error("Error loading template for project:", storedID);
      }

      const name = await getProjectName();
      setProjectName(name);

      const role = await getUserRoleInProject(parseInt(storedID, 10));
      setUserRole(role);
      if (role !== null) {
        const roleMapped = roleMapping[role];
        setRoleName(roleMapped || "Unknown Role");
      }

      const isProjectLocked = await fetchProjectLockStatus(parseInt(storedID));
      setIsLocked(isProjectLocked);
    };

    fetchProjectDetails();
  }, []);

  useEffect(() => {
    const updateCatID = async () => {
      if (!projectID) return;

      const catID = await getCategoryID(currentCategory, Number(projectID));
      setCurrentCatID(catID);
      console.log("Current category ID:", catID);

      if (template) {
        await categoryCalculation(currentCategory, Number(projectID), template);
      } else {
        console.error("Template not loaded yet for project:", projectID);
      }
    };

    updateCatID();
  }, [currentCategory]);

  useEffect(() => {
    const updateCategoryData = async () => {
      if (currentCatID !== undefined) {
        setCategoryData(await getCategoryDataCatOnly(currentCatID));
      }
    };

    updateCategoryData();
  }, [currentCatID]);

  if (!template) return null;

  return (
    <div className="project-view">
      {projectName && <h1><strong>{projectName}</strong></h1>}

      {userRole === 3 && (
        <Button
          onClick={async () => {
            if (!projectID) {
              console.error("No projectID found for locking.");
              return;
            }

            const newLockStatus = !isLocked;
            const confirmedStatus = await updateProjectLockStatus(
              Number(projectID),
              newLockStatus
            );

            setIsLocked(confirmedStatus);
          }}
          className={`lock-button ${isLocked ? "locked" : "unlocked"}`}
        >
          {isLocked ? "Unlock Project" : "Lock Project"}
        </Button>
      )}

<<<<<<< HEAD
=======
      {roleName && <p>User Role: {roleName}</p>}

      {/* Budget Form - Readonly if locked or user is Institution Collaborator */}
>>>>>>> 47e3905e4105b140000c30d44b1138ec9fc7ae57
      <DynamicBudgetForm
        getCategoryName={setCategoryName}
        readOnly={userRole === 1 || isLocked}
        template={template}
      />

      <CategoryDisplay data={categoryData} />

      <Link
        to="/project-view/manage-collaborators"
        className={`tab ${
          location.pathname === "/project-view/manage-collaborators"
            ? "active-tab"
            : ""
        }`}
      >
        Manage Collaborators
      </Link>

      <div className="tab-content">
        {location.pathname === "/project-view/manage-collaborators" &&
          projectID &&
          userRole !== null && (
            <ManageCollaborators
              projectID={parseInt(projectID, 10)}
              userRole={userRole}
            />
          )}
      </div>
    </div>
  );
};

export default ProjectView;
