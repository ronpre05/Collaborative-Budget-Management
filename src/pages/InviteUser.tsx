import { useState, useEffect } from "react";
import { inviteUserToProject, getRoles } from "./../database";  // Import the new getRoles function

const InviteUser: React.FC<{ projectID: number }> = ({ projectID }) => {
  const [email, setEmail] = useState("");
  const [roleID, setRoleID] = useState(2); // Default role (e.g., "Institution Lead")
  const [roles, setRoles] = useState<any[]>([]);  // To store roles fetched from the database

  // Fetch roles when the component mounts
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const fetchedRoles = await getRoles();
        console.log("Fetched Roles in InviteUser:", fetchedRoles);
        setRoles(fetchedRoles);
      } catch (error) {
        console.error("Error in fetchRoles:", error);
      }
    };
  
    fetchRoles();
  }, []);
  

  const handleInvite = async () => {
    if (!email) {
      alert("Please enter an email.");
      return;
    }

    const result = await inviteUserToProject(email, projectID, roleID);
    if (result) {
      alert("User invited successfully!");
    } else {
      alert("Error inviting user.");
    }
  };

  return (
    <div>
      <h3>Invite User</h3>
      <input
        type="email"
        placeholder="Enter user email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      
      <select value={roleID} onChange={(e) => setRoleID(Number(e.target.value))}>
        {roles.length > 0 ? (
        roles.map((role) => (
        <option key={role.roleID} value={role.roleID}>
        {role.roleName}
        </option>
        ))
        ) : (
        <option disabled>Loading roles...</option>
        )}
      </select>

      
      <button onClick={handleInvite}>Send Invite</button>
    </div>
  );
};

export default InviteUser;
