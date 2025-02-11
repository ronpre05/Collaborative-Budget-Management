import { Link } from "react-router-dom";
import ProjectsView from "../fetchProjects";
import useUserId from "../useUserId";
import CategoryDisplay from "../categoryDisplay";
import useProjectEntries from "../useProjectEntries";
import * as testData from "../SampleCategoryData";
import useProjectId from "../useProjectId";

// Projects Page
const Projects: React.FC = () => {
  const userId = useUserId();
  const projectId = useProjectId();
  const projectEntries = useProjectEntries();
  console.log("User ID given:", userId);
  console.log("First Project ID given:", projectId);
  console.log("Project entries:", projectEntries);
  useProjectEntries();
  return (
    <div className="content">
      <h1>Projects Page</h1>
      <p>Manage your projects here, {userId}</p>
      <p>User ID: {userId}</p>
      <p>FIRST Project ID: {projectId}</p>
      <p>ALL Project Entries: {projectEntries}</p>
      <p></p>
      <CategoryDisplay data={testData.testLargeData10x20}></CategoryDisplay>
      <ProjectsView userId={userId}></ProjectsView>
      <Link to="/create-project">
        <button className="create-project-btn">Create Project</button>
      </Link>
    </div>
  );
};

export default Projects;
