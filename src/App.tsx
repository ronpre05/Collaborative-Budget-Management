import { supabase } from './database';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";
import RoleBasedRoute from "./RoleBasedRoute";
import { useEffect } from 'react';
import "./App.css";
import Home from "./pages/HomePage"
import About from "./pages/About"
import Projects from "./pages/Projects"
import CreateProject from "./pages/CreateProjects";
import Login from "./pages/Login";


function App() {

  // Get currently logged in user from Clerk
  const { user } = useUser();

  // Hook to handle user login once user state is set from Clerk
  useEffect(() => {
    if (user) {
      HandleUserLogin(user);
    }
  }, [user]);

  return (
    <Router>
      {/* Signed out View*/}
      <SignedOut>
        <Login/>
      </SignedOut>
      {/* Signed in View*/}
      <SignedIn>
        <div className="app-container">
          <aside className="sidebar">
            <header>
              <h2>COLLABORATIVE BUDGET MANAGEMENT TOOL</h2>
            </header>
            <div className="user-section">
              <UserButton />
            </div>
            <nav>
              <Link to="/">
                <button>Home</button>
              </Link>
              <Link to="/projects">
                <button>Projects</button>
              </Link>
              <Link to="/support">
                <button>Support</button>
              </Link>
            </nav>
          </aside>
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/support" element={<div className="content"><h1>Support Page</h1></div>} />
              {/* Admin-only routes */}
              <Route element={<RoleBasedRoute allowedRoles={[3]} />}>
                <Route path="/create-project" element={<CreateProject />} />
              </Route>
              <Route path="/create-project/personnel-costs" element={<CreateProject />} />
              <Route path="/create-project/equipment-costs" element={<CreateProject />} />
              <Route path="/create-project/travel-costs" element={<CreateProject />} />
              <Route path="/create-project/goods-services-costs" element={<CreateProject />} />
            </Routes>
          </main>
        </div>
      </SignedIn>
    </Router>
  );
}

// Logic to find/create user in db
const HandleUserLogin = async (user: any) => {
  console.log("HandleUserLogin was called!", user);
  if (!user) {
    console.error("No user found in Clerk.");
    return;
  }

  const email = user.primaryEmailAddress?.emailAddress;
  const username = user.username || user.firstName || email;
  const firstName = user.firstName || "Unknown";
  const lastName = user.lastName || "Unknown";

  if (!email || !username) {
    console.error("Required user information missing.");
    return;
  }

  try {
    let userId;
    const { data, error } = await supabase
      .from('Users')
      .select('userID')
      .eq('email', email);

    if (error) {
      throw new Error(`Error checking user existence: ${error.message}`);
    }

    if (data && data.length > 0) {
      userId = data[0].userID;
      console.log(`User found: ${userId}`);
    } else {
      const { data: newUser, error: insertError } = await supabase
        .from('Users')
        .insert({
          firstName,
          lastName,
          email,
          username,
        })
        .select('userID')
        .single();

      if (insertError) {
        throw new Error(`Error creating user: ${insertError.message}`);
      }
      userId = newUser?.userID;
      console.log(`New user created: ${userId}`);
    }

    // Fetch role information
    const { data: roleData, error: roleError } = await supabase
      .from('UserInstitutionProject')
      .select('roleID')
      .eq('userID', userId);

    if (roleError) {
      throw new Error(`Error fetching user role: ${roleError.message}`);
    }

    const userRoleId = roleData?.[0]?.roleID || null;
    localStorage.setItem('userID', userId);
    localStorage.setItem('userRole', userRoleId);

    console.log(`User session stored with ID: ${userId} and Role ID: ${userRoleId}`);
    return { userId, userRoleId };
  } catch (err) {
    console.error(`Error handling user login: ${err.message}`);
  }
};

export default App;

