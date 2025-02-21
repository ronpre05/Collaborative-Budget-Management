import React from "react";
import { Link, useLocation } from "react-router-dom";
import DynamicBudgetForm from "./DynamicBudgetForm";
import ManageCollaborators from "./ManageCollaborators";

const ProjectView: React.FC = () => {
  const location = useLocation();

  return (
    <div className="project-view">
      <h1>Create Project</h1>
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

