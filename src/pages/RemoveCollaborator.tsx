import { useState, useEffect } from "react";
import { supabase } from "../database"; 

interface RemoveCollaboratorProps {
  projectID: number;
}

const RemoveCollaborator: React.FC<RemoveCollaboratorProps> = ({ projectID }) => {
  const [collaborators, setCollaborators] = useState<any[]>([]);

  useEffect(() => {
    const fetchCollaborators = async () => {
      const { data, error } = await supabase
        .from("UserInstitutionProject")
        .select("userID, roleID, Users(firstName, lastName, email), Roles(roleName)")
        .eq("projectID", projectID)
        .select("userID, roleID, Users(firstName, lastName, email), Roles(roleName)")


      if (error) {
        console.error("Error fetching collaborators:", error.message);
      } else {
        setCollaborators(data);
      }
    };

    fetchCollaborators();
  }, [projectID]);

  const removeCollaborator = async (userID: number) => {
    const { error } = await supabase
      .from("UserInstitutionProject")  
      .delete()
      .eq("userID", userID)
      .eq("projectID", projectID);
  
    if (error) {
      console.error("Error removing collaborator:", error.message);
    } else {
      setCollaborators((prev) => prev.filter((user) => user.userID !== userID));
    }
  };

  return (
    <div>
      <h3>Project Collaborators</h3>
      <ul>
        {collaborators.map((user) => (
          <li key={user.userID}>
            {user.Users.firstName} {user.Users.lastName} ({user.Users.email}) - {user.Roles?.roleName || "Unknown Role"}
            <button onClick={() => removeCollaborator(user.userID)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RemoveCollaborator;
