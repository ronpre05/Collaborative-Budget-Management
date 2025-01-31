import { Link, useLocation } from "react-router-dom";
import ProjectsView from "../fetchProjects";

// Projects Page
const Projects: React.FC = () => (
  <div className="content">
    <h1>Projects Page</h1>
    <p>Manage your projects here.</p>
    <ProjectsView userId={userId}></ProjectsView>
    <Link to="/create-project">
      <button className="create-project-btn">Create Project</button>
    </Link>
  </div>
);

export default Projects;
