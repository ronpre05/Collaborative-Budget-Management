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
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4 text-left">Manage Collaborators</h2>
      <p className="text-lg mb-6 text-left">Below are the users collaborating on this project.</p>

      {/* Show the list of collaborators (to all roles) */}
      {userRole !== 3 && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          {projectID && <CollaboratorList projectID={projectID} />}
        </div>
      )}

      {/* Only Project Investigators (role ID 3) can invite or remove users */}
      <h3 className="text-2xl font-semibold mb-4 max-w-md mx-auto">Invite Collaborators</h3>
      {userRole === 3 && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-300 max-w-md mx-auto">
          {projectID && <InviteUser projectID={projectID} />}
        </div>
      )}

      <h3 className="text-2xl font-semibold mb- max-w-md mx-auto">Remove Collaborators</h3>
      {userRole === 3 && (
         <div className="bg-white p-6 rounded-lg mb-6 max-w-md mx-auto">
          {projectID && <RemoveCollaborator projectID={projectID} />}
        </div>
      )}
    </div>
  );
};

export default ManageCollaborators;
