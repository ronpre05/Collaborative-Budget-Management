import React, { useState, useEffect } from "react";
import RemoveCollaborator from "./RemoveCollaborator"; // Import RemoveCollaborator
import InviteUser from "./InviteUser"; // Import the InviteUser component

const ManageCollaborators: React.FC = () => {
  const [projectID, setProjectID] = useState<number | null>(null);

  useEffect(() => {
    // Retrieve the project ID from localStorage
    const storedProjectID = localStorage.getItem("projectID");

    if (storedProjectID) {
      setProjectID(parseInt(storedProjectID, 10));
    } else {
      console.error("No project ID found in localStorage.");
    }
  }, []);

  useEffect(() => {
    console.log("ManageCollaborators mounted"); // Debugging
  }, []);

  return (
    <div>
      <h2>Manage Collaborators</h2>
      <p>Below is the option to remove collaborators from this project.</p>

      {/* Remove Collaborator Section */}
      {projectID && <RemoveCollaborator projectID={projectID} />}

      {/* Show InviteUser only when projectID is available */}
      {projectID && <InviteUser projectID={projectID} />} 
    </div>
  );
};

export default ManageCollaborators;
