import { Link } from "react-router-dom";
import ProjectsView from "../fetchProjects";
import useUserId from "../useUserId";

// Projects Page
const Projects: React.FC = () => {
  const userId = useUserId;

  return (
    <div className="content">
      <h1>Projects Page</h1>
      <p>Manage your projects here.</p>
      <ProjectsView userId={userId}></ProjectsView>
      <Link to="/create-project">
        <button className="create-project-btn">Create Project</button>
      </Link>
    </div>
  );
};

export default Projects;
