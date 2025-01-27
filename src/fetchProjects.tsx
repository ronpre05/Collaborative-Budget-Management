import React, { useState, useEffect } from 'react';
import { getUsersProjects } from './database';

interface ProjectsViewProps {
  userId: number;
}

const ProjectsView: React.FC<ProjectsViewProps> = ({ userId }) => {
  const [projects, setProjects] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getUsersProjects(userId);
        setProjects(data);
        setError(null);
        setHasFetched(true);
      } catch (err: any) {
        setError(err.message);
        setHasFetched(false);
      }
    };
    fetchProjects();
  }, [userId]);

  return (
    <main>
      {error ? (<p>Error fetching projects: {error}</p>
      ) : hasFetched && projects.length > 0 ? (
        <div>
          {projects.map((project, index) => (
            <div key={index} className="project-data">
              <p>Project ID: {project.Project.projectID}, User ID: {userId}</p>
            </div>
          ))}
        </div>
      ) : hasFetched ? (<p>No projects found.</p>
      ) : (<p>Loading projects...</p>
      )}
    </main>
  );
};

export default ProjectsView;
// to use this use:
// import ProjectsView from './fetchProjects';
// get userId
// <ProjectsView userId={userId} />
