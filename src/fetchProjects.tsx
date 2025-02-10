import React, { useState, useEffect } from 'react';
import { getUsersProjects } from './database';

interface ProjectsViewProps {
}

// Component to display a user's projects
const ProjectsView: React.FC<ProjectsViewProps> = () => {
  // State to store the fetched projects
  const [projects, setProjects] = useState<any[]>([]);
  // State to handle errors
  const [error, setError] = useState<string | null>(null);
  // State to track whether the projects have been fetched
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    // Function to fetch projects from the database
    const fetchProjects = async () => {
      try {
        // Retrieve projects associated
        const data = await getUsersProjects();
        setProjects(data);
        setError(null);
        setHasFetched(true); // Mark fetching as complete
      } catch (err: any) {
        // Handle errors during the fetching process
        setError(err.message);
        setHasFetched(false);
      }
    };
    
    fetchProjects();
  }, []);

  return (
    <main>
      {/* Display an error message if an error occurs */}
      {error ? (
        <p>Error fetching projects: {error}</p>
      ) : hasFetched && projects.length > 0 ? (
        // Display the list of projects if available
        <div>
          {projects.map((project, index) => (
            <div key={index} className="project-data">
              <p>Project ID: {project.Project.projectID}</p>
            </div>
          ))}
        </div>
      ) : hasFetched ? (
        // Display a message if no projects are found
        <p>No projects found.</p>
      ) : (
        // Show a loading message while fetching
        <p>Loading projects...</p>
      )}
    </main>
  );
};

export default ProjectsView;

// Usage Instructions:
// Import the component: import ProjectsView from './fetchProjects';
// Retrieve userId from authentication or local storage
// Render the component: <ProjectsView userId={userId} />
