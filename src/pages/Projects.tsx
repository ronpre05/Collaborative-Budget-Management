import { Link } from "react-router-dom";
import ProjectsView from "../fetchProjects";
import CategoryDisplay from "../categoryDisplay";
import { getCategoryData } from "../queryFunctions";
import { useEffect, useState } from "react";

// Projects Page
const Projects: React.FC = () => {
  const userId = localStorage.userID;

  // rough way for now, needs to be merged into hook later
  const [formattedData, setFormattedData] = useState<string[][]>([[]]);

  useEffect(() => {
    async function getData() {
      const result = await getCategoryData(49);
      setFormattedData(result);
    }
    getData();
  }, []);
  // rough way for now, needs to be merged into hook later

  return (
    <div className="content">
      <CategoryDisplay data={formattedData} />
      <ProjectsView userId={userId}></ProjectsView>
      <Link to="/create-project">
        <button className="create-project-btn">Create Project</button>
      </Link>
    </div>
  );
};

export default Projects;
