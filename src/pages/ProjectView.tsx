import React from "react";
import DynamicBudgetForm from "./DynamicBudgetForm";

const CreateProject: React.FC = () => {
  return (
    <div className="create-project-content">
      <h1>Create Project</h1>
      {/* Render the new generic cost management page */}
      <DynamicBudgetForm />
    </div>
  );
};

export default ProjectView;
