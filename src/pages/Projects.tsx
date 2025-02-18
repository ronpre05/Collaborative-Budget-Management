import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import ProjectsView from "../fetchProjects";
import CategoryDisplay from "../categoryDisplay";
import { getCategoryData } from "../queryFunctions";

// Projects Page
const Projects: React.FC = () => {
  const [userId, setUserId] = useState<number | null>(null);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    // Retrieve userID from local storage
    const storedUserId = localStorage.getItem("userID");
    if (storedUserId) {
      setUserId(parseInt(storedUserId, 10));
    } else {
      console.error("No user ID found in localStorage.");
    }
  }, []);

  // Callback function to handle projects received from ProjectsView
  const handleProjectsFetched = (fetchedProjects: any[]) => {
    setProjects(fetchedProjects);
  };

  // Function to handle project selection
  const handleProjectClick = (projectID: number) => {
    localStorage.setItem("selectedProjectID", projectID.toString());
    console.log("Selected project ID stored:", projectID);
  };

  return (
    <div className="content">
      <h1>Projects Page</h1>
      <p>Manage your projects here.</p>

      {/* Button to navigate to the Create Project page */}
      <Link to="/create-project">
        <button className="create-project-btn">Create Project</button>
      </Link>

      {/* Render ProjectsView if userId is available */}
      {userId ? (
        <ProjectsView userId={userId} onProjectsFetched={handleProjectsFetched} />
      ) : (
        <p>Loading user...</p>
      )}

      {/* Display project buttons */}
      {projects.length > 0 && (
        <div className="project-list">
          <h2>Your Projects</h2>
          {projects.map((project) => (
            <button
              key={project.Project.projectID}
              className="project-button"
              onClick={() => handleProjectClick(project.Project.projectID)}
            >
              {project.Project.projectID}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
