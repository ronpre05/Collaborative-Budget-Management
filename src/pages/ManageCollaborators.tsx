import React from "react";
import RemoveCollaborator from "./RemoveCollaborator"; // Import RemoveCollaborator

const ManageCollaborators: React.FC = () => {
    const projectID = 94; // Replace with dynamic value when available
  
    return (
      <div style={{ overflowY: "auto", height: "100vh", padding: "20px" }}>
        <h2>Manage Collaborators</h2>
        <p>Below is the option to remove collaborators from this project.</p>
  
        {/* Remove Collaborator Section */}
        <RemoveCollaborator projectID={projectID} />
      </div>
    );
  };
  

export default ManageCollaborators;
