import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import "./App.css";

// Home Page
const Home: React.FC = () => (
  <div className="content">
    <h1>Welcome to the Home Page</h1>
    <p>Manage budgets collaboratively and efficiently!</p>
  </div>
);

// About Page
const About: React.FC = () => (
  <div className="content">
    <h1>About Page</h1>
    <p>Learn more about our tool and its features here.</p>
  </div>
);

// Projects Page
const Projects: React.FC = () => (
  <div className="content">
    <h1>Projects Page</h1>
    <p>Manage your projects here.</p>
    <Link to="/create-project">
      <button className="create-project-btn">Create Project</button>
    </Link>
  </div>
);

// Creates Project Page
const CreateProject: React.FC = () => {
  const location = useLocation(); // Gets current path

  return (
    <div className="create-project-content">
      {
      //Header
      }
      <h1>Create Project</h1>

      {
      //Tabs
      }
      <div className="tab-container">
        <Link to="/create-project/personnel-costs" className={`tab ${location.pathname === "/create-project/personnel-costs" ? "active-tab" : ""}`}>
          Personnel Costs
        </Link>
        <Link to="/create-project/equipment-costs" className={`tab ${location.pathname === "/create-project/equipment-costs" ? "active-tab" : ""}`}>
          Equipment Costs
        </Link>
        <Link to="/create-project/travel-costs" className={`tab ${location.pathname === "/create-project/travel-costs" ? "active-tab" : ""}`}>
          Travel Costs
        </Link>
      </div>

      {
      //Tab content
      }
      <div className="tab-content">
        {location.pathname === "/create-project/personnel-costs" && <h2>Personnel Costs</h2>}
        {location.pathname === "/create-project/equipment-costs" && <h2>Equipment Costs</h2>}
        {location.pathname === "/create-project/travel-costs" && <h2>Travel Costs</h2>}
        {location.pathname === "/create-project" && <p>Select a cost category using the tabs above.</p>}
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <SignedOut>
        <div className="center-content">
          <SignInButton />
        </div>
      </SignedOut>

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
              <Route path="/create-project" element={<CreateProject />} />
              <Route path="/create-project/personnel-costs" element={<CreateProject />} />
              <Route path="/create-project/equipment-costs" element={<CreateProject />} />
              <Route path="/create-project/travel-costs" element={<CreateProject />} />
            </Routes>
          </main>
        </div>
      </SignedIn>
    </Router>
  );
}

export default App;
