import React, { useState, useEffect } from "react";
import RemoveCollaborator from "./RemoveCollaborator";
import CollaboratorList from "./CollaboratorList";
import InviteUser from "./InviteUser";

interface ManageCollaboratorsProps {
  projectID: number | null;
  userRole: number | null;
}

const ManageCollaborators: React.FC<ManageCollaboratorsProps> = ({ projectID, userRole }) => {
  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4 text-left">Manage Collaborators</h2>
      <p className="text-lg mb-6 text-left">Below are the users collaborating on this project.</p>
  
      {/* List of collaborators */}
      {userRole !== 3 && (
        <div className="bg-white p-6 rounded-lg mb-6">
          {projectID && <CollaboratorList projectID={projectID} />}
        </div>
      )}
  
      {/* Only Project Investigators can invite or remove users */}
    {userRole === 3 && (
        <div className="flex space-x-8">
          {/* Invite Collaborators */}
          <div className="flex-1">
            <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-300">
              {projectID && <InviteUser projectID={projectID} />}
            </div>
          </div>

          {/* Remove Collaborators */}
          <div className="flex-1">
            <div className="bg-white p-6 rounded-lg mb-6">
              {projectID && <RemoveCollaborator projectID={projectID} />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCollaborators;
