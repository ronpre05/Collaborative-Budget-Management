import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import ProjectsView from "../fetchProjects";

// Projects Page Component
const Projects: React.FC = () => {
  // State to store the user's ID
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    // Retrieve the user ID from local storage
    const storedUserId = localStorage.getItem("userID");

    if (storedUserId) {
      // Convert the retrieved user ID to a number and set it in state
      setUserId(parseInt(storedUserId, 10));
    } else {
      // Log an error message if no user ID is found
      console.error("No user ID found in localStorage.");
    }
  }, []); // Runs only once when the component mounts

  return (
    <div className="content">
      <h1>Projects Page</h1>
      <p>Manage your projects here.</p>

      {/* Button to navigate to the Create Project page */}
      <Link to="/create-project">
        <button className="create-project-btn">Create Project</button>
      </Link>

      {/* Render the ProjectsView component if the user ID is available, otherwise display a loading message */}
      {userId ? <ProjectsView /> : <p>Loading user...</p>}
    </div>
  );
};

export default Projects;
