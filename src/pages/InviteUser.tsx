import { useState, useEffect } from "react";
import { inviteUserToProject, getRoles } from "./../database";

const InviteUser: React.FC<{ projectID: number }> = ({ projectID }) => {
  const [email, setEmail] = useState("");
  const [roleID, setRoleID] = useState(2); // Default role (Institution Lead)
  const [roles, setRoles] = useState<any[]>([]); // To store roles fetched from the database
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // To store error message
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // To store success message

  // Fetch roles when the component mounts
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const fetchedRoles = await getRoles();
        setRoles(fetchedRoles);
      } catch (error) {
        console.error("Error in fetchRoles:", error);
      }
    };

    fetchRoles();
  }, []);

  const handleInvite = async () => {
    // Reset messages before validation
    setErrorMessage(null);
    setSuccessMessage(null);

    // Check if email and role are filled
    if (!email || !roleID) {
      setErrorMessage("Please fill out all fields.");
      return;
    }

    const result = await inviteUserToProject(email, projectID, roleID);
    if (result) {
      setSuccessMessage("User invited successfully!");

      // Reset the input fields after success
      setEmail("");
      setRoleID(2); // Reset to default role
      setTimeout(() => {
        setSuccessMessage(null); // Clear success message after 3 seconds
      }, 3000);
    } else {
      setErrorMessage("Error inviting user.");
    }
  };

  return (
    <div className="space-y-6 max-w-lg">
      <h3 className="text-2xl font-semibold text-left">Invite Collaborator</h3>

      {/* Email input */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          User Email
        </label>
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
        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
          Role
        </label>
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

      {/* Display error or success messages */}
      {errorMessage && <p className="mt-4 text-red-600 font-semibold">{errorMessage}</p>}
      {successMessage && <p className="mt-4 text-green-600 font-semibold">{successMessage}</p>}

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
