import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import DynamicBudgetForm from "./DynamicBudgetForm";
import ManageCollaborators from "./ManageCollaborators";
import { getProjectName, getUserRoleInProject } from "../database";

const ProjectView: React.FC = () => {
  const location = useLocation();

  const [projectName, setProjectName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<number | null>(null);
  const [roleName, setRoleName] = useState<string | null>(null);

  const roleMapping: Record<number, string> = {
    1: "Institution Collaborator",
    2: "Institution Lead",
    3: "Project Investigator",
  };

  useEffect(() => {
    const fetchProjectDetails = async () => {
      const projectID = localStorage.getItem("projectID");
      if (!projectID) {
        console.error("No project ID found in localStorage.");
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

  return (
    <div className="project-view">
      {/* Display the project name */}
      {projectName && <h1>{projectName}</h1>}
      {/* Show the user's role name */}
      {roleName && <p>User Role: {roleName}</p>}
      {/* Render the new generic cost management page */}
      {/* Only read-only for Institution Collaborators */}
      <DynamicBudgetForm readOnly={userRole === 1} /> 
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

