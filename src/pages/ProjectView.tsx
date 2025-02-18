import React from "react";
import DynamicBudgetForm from "./DynamicBudgetForm";

const ProjectView: React.FC = () => {
  return (
    <div className="project-view">
      <h1>Create Project</h1>
      {/* Render the new generic cost management page */}
      <DynamicBudgetForm />
    </div>
  );
};

export default ProjectView;
