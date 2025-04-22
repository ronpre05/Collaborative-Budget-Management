import { useState, useEffect } from "react";
import { inviteUserToProject, getRoles } from "./../database";

const InviteUser: React.FC<{ projectID: number }> = ({ projectID }) => {
  const [email, setEmail] = useState("");
  const [roleID, setRoleID] = useState(2); // Default role (Institution Lead)
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
    <div className="space-y-6 max-w-lg">
      <h3 className="text-2xl font-semibold text-left">Invite User</h3>

      {/* Email input */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">User Email</label>
        <input
          type="email"
          id="email"
          placeholder="Enter user email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Role select */}
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
        <select
          id="role"
          value={roleID}
          onChange={(e) => setRoleID(Number(e.target.value))}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
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
      </div>

      {/* Submit button */}
      <div>
        <button
          onClick={handleInvite}
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Send Invite
        </button>
      </div>
    </div>
  );
};

export default InviteUser;
