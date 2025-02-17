import React, { useState, useEffect } from 'react';
import { getUsersProjects } from './database';

interface ProjectsViewProps {
  userId: number;
  onProjectsFetched: (projects: any[]) => void;
}

// Component to display a user's projects
const ProjectsView: React.FC<ProjectsViewProps> = ({ userId, onProjectsFetched }) => {
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
        onProjectsFetched(data); // Pass projects back to Projects.tsx
        setError(null);
        setHasFetched(true); // Mark fetching as complete
      } catch (err: any) {
        // Handle errors during the fetching process
        setError(err.message);
        setHasFetched(false);
      }
    };
    
    fetchProjects();
  }, [userId, onProjectsFetched]);

  return (
    <main>
      {error ? (
        <p>Error fetching projects: {error}</p>
      ) : hasFetched && projects.length > 0 ? (
        <p>Projects loaded successfully.</p>
      ) : hasFetched ? (
        <p>No projects found.</p>
      ) : (
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
