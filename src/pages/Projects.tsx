import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ProjectsView from "../fetchProjects";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card.tsx";
import { FolderKanban, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button.tsx";


// Projects Page
const Projects: React.FC = () => {
  const [userId, setUserId] = useState<number | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const navigate = useNavigate();

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
    localStorage.setItem("projectID", projectID.toString());
    navigate(`/project-view/`);
  };

  return (
    <div className="content">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Projects</h1>
        <Link to="/create-project">
          <Button className="create-project-btn">Create Project</Button>
        </Link>
      </div>

      {/* Render project cards if userIDs is available */}
      {userId ? <ProjectsView userId={userId} onProjectsFetched={handleProjectsFetched} /> : <p>Loading user...</p>}

      {/* Display project cards */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <Card
            key={project.Project.projectID}
            className="cursor-pointer hover:shadow-md transition-shadow relative group"
            onClick={() => handleProjectClick(project.Project.projectID)}
          >
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowRight className="h-5 w-5 text-primary" />
            </div>

            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-primary mb-1">
                <FolderKanban className="h-5 w-5" />
                <span className="text-sm font-medium">{project.Project.projectAcronym}</span>
              </div>
              <CardTitle>{project.Project.projectName}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No projects found.</p>
        </div>
      )}
    </div>
  );
};

export default Projects;
