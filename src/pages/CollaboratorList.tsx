import React, { useEffect, useState } from "react";
import { supabase } from "../database";

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
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h3 className="text-2xl font-semibold mb-6">Project Collaborators</h3>

      <div className="bg-white shadow-md rounded-lg p-6">
        {collaborators.length > 0 ? (
          <ul className="space-y-4">
            {collaborators.map((user) => (
              <li
                key={user.userID}
                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition duration-200"
              >
                <div className="flex flex-col">
                  <span className="text-lg font-medium">{`${user.Users.firstName} ${user.Users.lastName}`}</span>
                  <span className="text-sm text-gray-600">{user.Users.email}</span>
                </div>
                <span className="text-sm text-gray-500">{user.Roles?.roleName || "Unknown Role"}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">No collaborators found.</p>
        )}
      </div>
    </div>
  );
};

export default CollaboratorList;
