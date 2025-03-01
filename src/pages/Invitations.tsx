import React, { useState, useEffect } from "react";
import { getPendingInvites, acceptInvite, rejectInvite } from "../database";

interface Invite {
  invitedID: number;
  projectID: number;
  roleID: number;
}

interface InvitationsProps {
  userEmail: string;
  invitations: Invite[];  //accepts invitations from App.tsx
}

const Invitations: React.FC<InvitationsProps> = ({ userEmail, invitations }) => {
  const [invites, setInvites] = useState<Invite[]>(invitations); 

  useEffect(() => {
    const loadInvites = async () => {
      if (invitations.length === 0) { // Only fetch if not passed from App.tsx
        const data = await getPendingInvites(userEmail);
        setInvites(data);
      }
    };
    loadInvites();
  }, [userEmail, invitations]);

  const handleAccept = async (invitedID: number, projectID: number, roleID: number) => {
    const institutionID = prompt("Enter your Institution ID:");
    if (!institutionID) return alert("Institution ID is required.");

    const success = await acceptInvite(invitedID, projectID, roleID, userEmail, Number(institutionID));
    if (success) {
      alert("Invite accepted!");
      setInvites(invites.filter(inv => inv.invitedID !== invitedID));
    } else {
      alert("Error accepting invite.");
    }
  };

  const handleReject = async (invitedID: number) => {
    const success = await rejectInvite(invitedID);
    if (success) {
      alert("Invite rejected.");
      setInvites(invites.filter(inv => inv.invitedID !== invitedID));
    }
  };

  return (
    <div>
      <h3>Pending Invitations</h3>
      {invites.length === 0 ? (
        <p>No pending invites.</p>
      ) : (
        invites.map(invite => (
          <div key={`${invite.invitedID}-${invite.projectID}`}>
            <p>Project ID: {invite.projectID} | Role: {invite.roleID}</p>
            <button onClick={() => handleAccept(invite.invitedID, invite.projectID, invite.roleID)}>
              Accept
            </button>
            <button onClick={() => handleReject(invite.invitedID)}>Reject</button>
          </div>
        ))
      )}
    </div>
  );
};

export default Invitations;
