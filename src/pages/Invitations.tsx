import React, { useState, useEffect } from "react";
import { getPendingInvites, getSentInvites, acceptInvite, rejectInvite, getUsersInstitutions, getInstitutionID, getRoles, getProjectNameFromID } from "../database";
import { Button } from "../components/ui/button"; 

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
  const [projectNames, setProjectNames] = useState<{ [projectID: number]: string | null }>({});

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

  useEffect(() => {
    const fetchProjectNames = async () => {
      const allInvites = [...invites, ...sentInvites];
      const uniqueProjectIDs = Array.from(new Set(allInvites.map(invite => invite.projectID)));
  
      const names: { [key: number]: string | null } = {};
      await Promise.all(uniqueProjectIDs.map(async (projectID) => {
        const name = await getProjectNameFromID(projectID);
        names[projectID] = name;
      }));
  
      setProjectNames(names);
    };
  
    if (invites.length > 0 || sentInvites.length > 0) {
      fetchProjectNames();
    }
  }, [invites, sentInvites]);
  

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
          <div 
            key={`${invite.invitedID}-${invite.projectID}`} 
            className="border border-gray-300 rounded-lg p-4 mb-4 shadow-sm"
          >
            <p>
              Project: <strong>{projectNames[invite.projectID] ?? "Loading..."}</strong> | 
              Role: <strong>{getRoleName(invite.roleID)}</strong>
            </p>
            <label>Select Institution:</label>
            <select 
              value={selectedInstitution} 
              onChange={(e) => setSelectedInstitution(e.target.value)}
              className="border border-gray-300 rounded p-2 w-full mt-2"
            >
              <option value="" disabled>
                Select an institution
              </option>
              {institutions.map((institution, index) => (
                <option key={index} value={institution}>
                  {institution}
                </option>
              ))}
            </select>
            
            <div className="mt-4 flex gap-2">
              <Button onClick={() => handleAccept(invite.invitedID, invite.projectID, invite.roleID)}>
                Accept
              </Button>
              <Button variant="destructive" onClick={() => handleReject(invite.invitedID)}>
                Reject
              </Button>
            </div>
          </div>
        ))
      )}  

      <div>
        <h3>Sent Invitations</h3>
        {sentInvites.length === 0 ? (
          <p>No invites sent.</p>
        ) : (
          sentInvites.map((invite) => (
            <div key={`${invite.invitedID}-${invite.projectID}`} className="border border-gray-300 rounded-lg p-4 mb-4 shadow-sm">
              <p>
                Invited <strong>{invite.email}</strong> to Project: <strong>{projectNames[invite.projectID] ?? "Loading..."}</strong><br />
                Role: <strong>{getRoleName(invite.roleID)}</strong> | Status: <strong>{invite.status}</strong>
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Invitations;
