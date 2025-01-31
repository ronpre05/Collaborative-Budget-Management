import { Link, useLocation } from "react-router-dom";
import ProjectsView from "../fetchProjects";
import { supabase } from "../database";
import { useState, useEffect } from "react";

// Projects Page
const Projects: React.FC = () => {
  const [userId, setUserId] = useState<number | null>(null);
  const [userdata, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchUserID = async () => {
      const { data } = await supabase.auth.getUser();
      setUserData(data);

      if (data?.user) {
        setUserId(data.user.id);
      }
    };

    fetchUserID();
  }, []);

  return (
    <div className="content">
      <h1>Projects Page</h1>
      <p>Manage your projects here.</p>
      <p>SupaBase Data: {JSON.stringify(userdata, null, 2)}</p>
      <ProjectsView userId={userId}></ProjectsView>
      <Link to="/create-project">
        <button className="create-project-btn">Create Project</button>
      </Link>
    </div>
  );
};

export default Projects;
