import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import DynamicBudgetForm from "./DynamicBudgetForm";
import ManageCollaborators from "./ManageCollaborators";
import {
  getProjectName,
  getUserRoleInProject,
  getCategoryID,
  setProjectLockStatus,
  supabase,
} from "../database";
import CategoryDisplay from "../categoryDisplay";
import { getCategoryDataCatOnly } from "../queryFunctions";
import { getTemplateFromID } from "../newTemplateParser";
import { categoryCalculation } from "../expressionParser";
import { TemplateData } from "@/types";
import { Button } from "../components/ui/button.tsx";

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

      // Get template
      const templateData = await getTemplateFromID(parseInt(storedID));
      setTemplate(templateData);
      if (!templateData) {
        console.error("Error loading template for project:", storedID);
      }

      // Get project name
      const name = await getProjectName();
      setProjectName(name);

      // Get user role
      const role = await getUserRoleInProject(parseInt(storedID, 10));
      setUserRole(role);
      if (role !== null) {
        const roleMapped = roleMapping[role];
        setRoleName(roleMapped || "Unknown Role");
      }

      // Fetch isLocked from database
      const { data: lockData, error: lockError } = await supabase
        .from("Project")
        .select("isLocked")
        .eq("projectID", parseInt(storedID))
        .single();

      if (lockError) {
        console.error("Error fetching lock status:", lockError);
      } else {
        console.log("Fetched lock status:", lockData?.isLocked);
        setIsLocked(lockData?.isLocked || false);
      }
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

      {/* Lock Button (Only for PI) */}
      {userRole === 3 && (
        <Button
          onClick={async () => {
            if (!projectID) {
              console.error("No projectID found for locking.");
              return;
            }

            const newLockStatus = !isLocked;
            const success = await setProjectLockStatus(
              Number(projectID),
              newLockStatus
            );

            if (success) {
              // Confirm it was updated by fetching again
              const { data, error } = await supabase
                .from("Project")
                .select("isLocked")
                .eq("projectID", Number(projectID))
                .single();

              if (error) {
                console.error("Error confirming updated lock status:", error);
              } else {
                console.log("Confirmed updated lock status:", data?.isLocked);
                setIsLocked(data?.isLocked || false);
              }
            } else {
              console.error("Failed to update lock status");
            }
          }}
          className={`lock-button ${isLocked ? "locked" : "unlocked"}`}
        >
          {isLocked ? "Unlock Project" : "Lock Project"}
        </Button>
      )}

      {roleName && <p>User Role: {roleName}</p>}

      {/* Budget Form - Readonly if locked or user is Institution Collaborator */}
      <DynamicBudgetForm
        getCategoryName={setCategoryName}
        readOnly={userRole === 1 || (isLocked && userRole !== 3)}
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
