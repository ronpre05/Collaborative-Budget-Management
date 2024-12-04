import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { getUsersProjects } from './database'

function App() {
  const [projects, setProjects] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false); // To track if projects have been fetched
  const userId = 1; // Replace with the actual user ID

  const fetchProjects = async () => {
    try {
      const data = await getUsersProjects(userId);
      setProjects(data); // Update the projects state with the fetched data
      setError(null); // Clear any previous errors
      setHasFetched(true); // Mark that projects have been fetched
    } catch (err: any) {
      setError(err.message); // Set the error message
      setHasFetched(false); // Reset fetch status if error occurs
    }
  };
  return (
    <>
      <header>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
      <main>
        <div>
          <h1>User Projects</h1>
          
          <button onClick={fetchProjects}>Load Projects</button>
        </div>  {error ? (<p>Error fetching projects: {error}</p>
        ) : hasFetched && projects.length > 0 ? (
          <div>
            {projects.map((project, index) => (
              <div key={index} className="project-data">
                <p>Project ID: {project.Project.projectID}, User ID: {userId}</p>
              </div>
            ))}
          </div>
        ) : hasFetched ? 
        (<p>No projects found.</p>) : null }
      </main>
    </>
  );
}

export default App;