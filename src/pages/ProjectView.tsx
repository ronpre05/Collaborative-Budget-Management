import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import DynamicBudgetForm from "./DynamicBudgetForm";
import ManageCollaborators from "./ManageCollaborators";
import { getProjectName } from "../database";

const ProjectView: React.FC = () => {
  const location = useLocation();

  const [projectName, setProjectName] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectName = async () => {
      const name = await getProjectName();
      setProjectName(name);
    };

    fetchProjectName();
  }, []);

  return (
    <div className="project-view">
      {/* Display the project name */}
      {projectName && <h1>{projectName}</h1>}
      {/* Render the new generic cost management page */}
      <DynamicBudgetForm />
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

