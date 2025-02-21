import { supabase } from './database';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";
import { useEffect } from 'react';
import "./App.css";
import Home from "./pages/HomePage";
import About from "./pages/About";
import Projects from "./pages/Projects";
// We keep the route for create-project, but it won't be linked from the sidebar.
import CreateProject from "./pages/CreateProject";
import Login from "./pages/Login";
import ManageCollaborators from "./pages/ManageCollaborators";
import ProjectView from './pages/ProjectView';


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
      {/* Signed out View */}
      <SignedOut>
        <Login/>
      </SignedOut>
      {/* Signed in View */}
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
              {/* Removed the Create Project link here */}
            </nav>
          </aside>
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/support" element={<div className="content"><h1>Support Page</h1></div>} />
              <Route path="/create-project" element={<CreateProject/>} />
              <Route path="/project-view" element={<ProjectView/>} />
              <Route path="/create-project/manage-collaborators" element={<ProjectView />} />
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

  // If missing email or username
  if (!email || !username) {
    console.error("Required user information missing.");
    return;
  }

  try {
    const { data, error } = await supabase
      .from('Users')
      .select('userID')
      .eq('email', email);

    if (error) {
      throw new Error(`Error checking user existence: ${error.message}`);
    }

    let userId;
    // If user in db exists
    if (data && data.length > 0) {
      userId = data[0].userID;
      console.log(`User found: ${userId}`);
    } 
    // If no user found in db
    else {
      // Insert new user info into db
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

    localStorage.setItem('userID', userId);
    console.log(`User session stored with ID: ${userId}`);
    return userId;
  } catch (err) {
    console.error(`Error handling user login (userID ${userId}): ${err.message}`);
  }
};

export default App;
