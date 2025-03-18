import React, { useState, useEffect } from "react";
import RemoveCollaborator from "./RemoveCollaborator";
import CollaboratorList from "./CollaboratorList";
import InviteUser from "./InviteUser";

interface ManageCollaboratorsProps {
  projectID: number | null;
  userRole: number | null;
}

const ManageCollaborators: React.FC<ManageCollaboratorsProps> = ({ projectID, userRole }) => {
  useEffect(() => {
    console.log("ManageCollaborators mounted");
  }, []);

  return (
    <div>
      <h2>Manage Collaborators</h2>
      <p>Below are the users in this project.</p>

      {/* Show the list of collaborators (to all roles) */}

      {userRole != 3 && (
        <>
        {projectID && <CollaboratorList projectID={projectID} />}
        </>
      )}
      
      {/* Only Project Investigators (role ID 3) can invite or remove users */}
      {userRole === 3 && (
        <>
          <h3>Invite Collaborators</h3>
          {projectID && <InviteUser projectID={projectID} />}
          <h3>Remove Collaborators</h3>
          {projectID && <RemoveCollaborator projectID={projectID} />}
        </>
      )}
    </div>
  );
};

export default ManageCollaborators;
