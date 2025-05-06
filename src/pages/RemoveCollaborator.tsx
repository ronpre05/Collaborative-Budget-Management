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
        .eq("projectID", projectID);

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
    <div className="space-y-6 max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-300">
      <h3 className="text-2xl font-semibold mb-4 text-left">Project Collaborators</h3>

      <ul className="space-y-4">
        {collaborators.map((user) => (
          <li key={user.userID} className="flex justify-between items-center p-4 border-b border-gray-200 rounded-md hover:bg-gray-50">
            <div className="text-left">
              <p className="font-medium">{user.Users.firstName} {user.Users.lastName}</p>
              <p className="text-sm text-gray-500">{user.Users.email}</p>
              <p className="text-sm text-gray-500">{user.Roles?.roleName || "Unknown Role"}</p>
            </div>

            <button
              onClick={() => removeCollaborator(user.userID)}
              className="ml-4 text-sm text-red-600 hover:text-red-800 focus:outline-none"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RemoveCollaborator;
