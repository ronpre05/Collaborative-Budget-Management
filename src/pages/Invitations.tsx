import React, { useState, useEffect } from "react";
import { getPendingInvites, acceptInvite, rejectInvite, getUsersInstitutions, getInstitutionID } from "../database";

interface Invite {
  invitedID: number;
  projectID: number;
  roleID: number;
}

interface InvitationsProps {
  userEmail: string;
  invitations: Invite[];
}

const Invitations: React.FC<InvitationsProps> = ({ userEmail, invitations }) => {
  const [invites, setInvites] = useState<Invite[]>(invitations);
  const [institutions, setInstitutions] = useState<string[]>([]);
  const [selectedInstitution, setSelectedInstitution] = useState<string>("");

  // Fetch institutions linked to the user
  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        const data = await getUsersInstitutions();
        setInstitutions(data);
      } catch (error) {
        console.error("Error fetching institutions:", error);
      }
    };

    fetchInstitutions();
  }, []);

  useEffect(() => {
    const loadInvites = async () => {
      if (invitations.length === 0) {
        const data = await getPendingInvites(userEmail);
        setInvites(data);
      }
    };
    loadInvites();
  }, [userEmail, invitations]);

  const handleAccept = async (invitedID: number, projectID: number, roleID: number) => {
    if (!selectedInstitution) {
      alert("Please select an institution.");
      return;
    }

    // Convert institution name to its ID
    const institutionID = await getInstitutionID(selectedInstitution);
    if (!institutionID) {
      alert("Invalid institution selection.");
      return;
    }

    const success = await acceptInvite(invitedID, projectID, roleID, userEmail, institutionID);
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

            {/* Dropdown for Institution Selection */}
            <label>Select Institution:</label>
            <select value={selectedInstitution} onChange={(e) => setSelectedInstitution(e.target.value)}>
              <option value="" disabled>Select an institution</option>
              {institutions.map((institution, index) => (
                <option key={index} value={institution}>
                  {institution}
                </option>
              ))}
            </select>

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
