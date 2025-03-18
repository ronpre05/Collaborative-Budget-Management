import React, { useEffect, useState } from "react";
import { supabase } from "../database"; // Adjust according to your supabase import

interface CollaboratorListProps {
  projectID: number;
}

const CollaboratorList: React.FC<CollaboratorListProps> = ({ projectID }) => {
  const [collaborators, setCollaborators] = useState<any[]>([]);

  useEffect(() => {
    const fetchCollaborators = async () => {
      const { data, error } = await supabase
        .from("UserInstitutionProject")
        .select("userID, roleID, Users(firstName, lastName, email), Roles(roleName)")
        .eq("projectID", projectID);

      if (error) {
        console.error("Error fetching collaborators:", error.message);
      } else {
        setCollaborators(data);
      }
    };

    fetchCollaborators();
  }, [projectID]);

  return (
    <div>
      <h3>Project Collaborators</h3>
      <ul>
        {collaborators.length > 0 ? (
          collaborators.map((user) => (
            <li key={user.userID}>
              {user.Users.firstName} {user.Users.lastName} ({user.Users.email}) - {user.Roles?.roleName || "Unknown Role"}
            </li>
          ))
        ) : (
          <p>No collaborators found.</p>
        )}
      </ul>
    </div>
  );
};

export default CollaboratorList;
