import { supabase } from "./database"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-react"
import { useEffect, useState } from "react"
import "./App.css"
import Home from "./pages/HomePage"
import About from "./pages/About"
import Projects from "./pages/Projects"
import CreateProject from "./pages/CreateProject"
import Login from "./pages/Login"
import ProjectView from "./pages/ProjectView"
import SettingsPage from "./pages/SettingsPage"
import { AppSidebar } from "./components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import Invitations from "./pages/Invitations";
//comment for tag

type Invitation = {
  invitedID: number;
  inviteID: number;
  projectID: number;
  roleID: number;
  status?: string;
  email?: string;
};

function App() {
  // Get currently logged in user from Clerk
  const { user } = useUser();
  const [userID, setUserID] = useState<number | null>(null);
  const [invitations] = useState<Invitation[]>([]);

  // Hook to handle user login once user state is set from Clerk
  useEffect(() => {
    if (user) {
      const fetchUserID = async () => {
        const storedUserID = await HandleUserLogin(user);
        setUserID(storedUserID);
      };
      fetchUserID();
    }
  }, [user]);

  const userEmail = user?.primaryEmailAddress?.emailAddress || "";

  return (
    <Router>
      {/* Signed out View */}
      <SignedOut>
        <Login />
      </SignedOut>
      {/* Signed in View */}
      <SignedIn>
        {/* Sidebar */}
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset className="main-content">
            <Routes>
              <Route path="/" element={<Home userEmail={userEmail} />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route
                path="/support"
                element={
                  <div className="content">
                    <h1>Support Page</h1>
                  </div>
                }
              />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/create-project" element={<CreateProject />} />
              <Route path="/project-view" element={<ProjectView />} />
              <Route path="/project-view/manage-collaborators" element={<ProjectView />} />
              <Route
                path="/invitations"
                element={userID ? <Invitations userEmail={userEmail} userID={userID} invitations={invitations} /> : <p>Loading...</p>}
              />
            </Routes>
          </SidebarInset>
        </SidebarProvider>
      </SignedIn>
    </Router>
  )
}

// Logic to find/create user in db
const HandleUserLogin = async (user: any) => {
  console.log("HandleUserLogin was called!", user)
  if (!user) {
    console.error("No user found in Clerk.")
    return
  }

  const email = user.primaryEmailAddress?.emailAddress
  const username = user.username || user.firstName || email
  const firstName = user.firstName || "Unknown"
  const lastName = user.lastName || "Unknown"

  // If missing email or username
  if (!email || !username) {
    console.error("Required user information missing.")
    return
  }

  let userId

  try {
    const { data, error } = await supabase.from("Users").select("userID").eq("email", email)

    if (error) {
      throw new Error(`Error checking user existence: ${error.message}`)
    }

    // If user in db exists
    if (data && data.length > 0) {
      userId = data[0].userID
      console.log(`User found: ${userId}`)
    }
    // If no user found in db
    else {
      // Insert new user info into db
      const { data: newUser, error: insertError } = await supabase
        .from("Users")
        .insert({
          firstName,
          lastName,
          email,
          username,
        })
        .select("userID")
        .single()

      if (insertError) {
        throw new Error(`Error creating user: ${insertError.message}`)
      }

      userId = newUser?.userID
      console.log(`New user created: ${userId}`)
    }

    localStorage.setItem("userID", userId)
    console.log(`User session stored with ID: ${userId}`)
    return userId
  } catch (err) {
    console.error(`Error handling user login (userID ${userId}): ${err.message}`)
  }
}
export default App;