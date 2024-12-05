import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import "./App.css";


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
