import React, { useState, useEffect } from "react";
import { getPendingInvites } from "../database";

interface HomeProps {
  userEmail: string; // passes the logged-in user's email
}

const Home: React.FC<HomeProps> = ({ userEmail }) => {
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const fetchPendingInvites = async () => {
      if (userEmail) {
        try {
          const invites = await getPendingInvites(userEmail);
          if (Array.isArray(invites)) {
            const count = invites.filter((invite) => invite.status === "pending").length;
            setPendingCount(count);
          }
        } catch (error) {
          console.error("Error fetching pending invites:", error);
        }
      }
    };

    fetchPendingInvites();
  }, [userEmail]);

  return (
    <div className="content">
      <h1>Welcome to the Home Page</h1>
      <p>Manage budgets collaboratively and efficiently!</p>

      {pendingCount > 0 && (
        <div className="notification">
          <span className="notification-icon">📩</span>
          <span className="notification-message">
            You have <strong>{pendingCount}</strong> pending invitation(s) awaiting your response.
          </span>
        </div>
      )}
    </div>
  );
};

export default Home;
