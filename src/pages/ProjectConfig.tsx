import { Link } from "react-router-dom";
import { createProjectQuery } from "../database";
const ProjectConfigPage: React.FC = () => {
    // Create project button call
    const handleCreateProject = async () => {
        try {
        await createProjectQuery();
        console.log("Project created successfully!");
        } catch (error) {
        console.error("Error creating project:", error);
        }
    };

    return (
      <div className="ConfigPage">
        <h1>Test</h1>
        <Link to="/project-view">
        <button onClick={handleCreateProject} className="create-project-btn">Create Project</button>
        </Link>
      </div>
    );
  };
  
  export default ProjectConfigPage;