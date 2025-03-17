import React, { useState, useEffect } from "react";
import { getPendingInvites, getSentInvites, acceptInvite, rejectInvite, getUsersInstitutions, getInstitutionID, getRoles } from "../database";

interface Invite {
  invitedID: number;
  projectID: number;
  roleID: number;
  status?: string; 
  email?: string;  
}

interface Role {
  roleID: number;
  roleName: string;
}

interface InvitationsProps {
  userEmail: string;
  userID: number;
  invitations: Invite[];
}

const Invitations: React.FC<InvitationsProps> = ({ userEmail, userID, invitations }) => {
  const [invites, setInvites] = useState<Invite[]>(invitations);
  const [sentInvites, setSentInvites] = useState<Invite[]>([]);
  const [institutions, setInstitutions] = useState<string[]>([]);
  const [selectedInstitution, setSelectedInstitution] = useState<string>("");
  const [roles, setRoles] = useState<Role[]>([]);

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
    const fetchRoles = async () => {
      try {
        const fetchedRoles = await getRoles();
        setRoles(fetchedRoles);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
    fetchRoles();
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

  useEffect(() => {
    const loadSentInvites = async () => {
      const data = await getSentInvites(userID);
      setSentInvites(data);
    };
    loadSentInvites();
  }, [userID]);

  const getRoleName = (roleID: number) => {
    const role = roles.find((r) => r.roleID === roleID);
    return role ? role.roleName : "Unknown Role";
  };

  const handleAccept = async (invitedID: number, projectID: number, roleID: number) => {
    if (!selectedInstitution) {
      alert("Please select an institution.");
      return;
    }

    const institutionID = await getInstitutionID(selectedInstitution);
    if (!institutionID) {
      alert("Invalid institution selection.");
      return;
    }

    const success = await acceptInvite(invitedID, projectID, roleID, userEmail, institutionID);
    if (success) {
      alert("Invite accepted!");
      setInvites(invites.filter((inv) => inv.invitedID !== invitedID));
    } else {
      alert("Error accepting invite.");
    }
  };

  const handleReject = async (invitedID: number) => {
    const success = await rejectInvite(invitedID);
    if (success) {
      alert("Invite rejected.");
      setInvites(invites.filter((inv) => inv.invitedID !== invitedID));
    }
  };

  return (
    <div>
      <h3>Pending Invitations</h3>
      {invites.length === 0 ? (
        <p>No pending invites.</p>
      ) : (
        invites.map((invite) => (
          <div key={`${invite.invitedID}-${invite.projectID}`}>
            <p>
              Project ID: {invite.projectID} | Role: <strong>{getRoleName(invite.roleID)}</strong>
            </p>
            <label>Select Institution:</label>
            <select value={selectedInstitution} onChange={(e) => setSelectedInstitution(e.target.value)}>
              <option value="" disabled>
                Select an institution
              </option>
              {institutions.map((institution, index) => (
                <option key={index} value={institution}>
                  {institution}
                </option>
              ))}
            </select>

            <button onClick={() => handleAccept(invite.invitedID, invite.projectID, invite.roleID)}>Accept</button>
            <button onClick={() => handleReject(invite.invitedID)}>Reject</button>
          </div>
        ))
      )}

      <h3>Sent Invitations</h3>
      {sentInvites.length === 0 ? (
        <p>No invites sent.</p>
      ) : (
        sentInvites.map((invite) => (
          <div key={`${invite.invitedID}-${invite.projectID}`}>
            <p>
              Invited <strong>{invite.email}</strong> to Project ID: {invite.projectID} <br />
              Role: <strong>{getRoleName(invite.roleID)}</strong> | Status:{" "}
              <strong>{invite.status}</strong>
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default Invitations;
