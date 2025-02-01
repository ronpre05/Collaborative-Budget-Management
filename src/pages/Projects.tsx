import { Link } from "react-router-dom";
import ProjectsView from "../fetchProjects";
import useUserId from "../useUserId";

// Projects Page
const Projects: React.FC = () => {
  const userId = useUserId();
  console.log("User ID given:", userId);
  return (
    <div className="content">
      <h1>Projects Page</h1>
      <p>Manage your projects here, {userId}</p>
      <p>User ID: {userId}</p>
      <ProjectsView userId={userId}></ProjectsView>
      <Link to="/create-project">
        <button className="create-project-btn">Create Project</button>
      </Link>
    </div>
  );
};

export default Projects;
