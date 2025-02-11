import { Link } from "react-router-dom";
import ProjectsView from "../fetchProjects";
import useUserId from "../useUserId";
import CategoryDisplay from "../categoryDisplay";
import * as testData from "../SampleCategoryData";

// Projects Page
const Projects: React.FC = () => {
  const userId = useUserId();
  console.log("User ID given:", userId);
  return (
    <div className="content">
      <h1>Projects Page</h1>
      <p>Manage your projects here, {userId}</p>
      <p>User ID: {userId}</p>
      {/**
       *  use testData. and then pick from:
       *  - testUserData
       *  - testProductData
       *  - testSalaryData
       *  - testLargeData10x10
       *  - testLargeData10x20
       */}
      <CategoryDisplay data={testData.testLargeData10x20}></CategoryDisplay>
      <ProjectsView userId={userId}></ProjectsView>
      <Link to="/create-project">
        <button className="create-project-btn">Create Project</button>
      </Link>
    </div>
  );
};

export default Projects;
