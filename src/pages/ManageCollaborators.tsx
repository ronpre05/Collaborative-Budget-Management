import React, { useEffect } from "react";
import RemoveCollaborator from "./RemoveCollaborator"; // Import RemoveCollaborator

const ManageCollaborators: React.FC = () => {
  const projectID = 93; // Replacing with dynamic value when available

  useEffect(() => {
    console.log("ManageCollaborators mounted"); // Debugging
  }, []);

  return (
    <div>
      <h2>Manage Collaborators</h2>
      <p>Below is the option to remove collaborators from this project.</p>

      {/* Remove Collaborator Section */}
      <RemoveCollaborator projectID={projectID} />
    </div>
  );
};

export default ManageCollaborators;
