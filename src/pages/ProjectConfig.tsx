import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { createProjectQuery, getUsersInstitutions, getInstitutionID } from "../database";

// Configuration page for creating a new project
const ProjectConfigPage: React.FC = () => {
    const [institutions, setInstitutions] = useState<string[]>([]);
    const [selectedInstitution, setSelectedInstitution] = useState<string>("");
    
    // Create project button call
    const handleCreateProject = async () => {
        try {
            let institutionID = await getInstitutionID(selectedInstitution);

            if(institutionID !== null){
                let projectID =  await createProjectQuery(institutionID);
                
                // Set projectID in localstorage
                if(projectID !== null){
                    localStorage.setItem('projectID', projectID);
                }

                console.log("Project created successfully!");
            }
            else{
                console.log("Invalid institution ID")
            }
        } 
        catch (error) {
            console.error("Error creating project:", error);
        }
    };
    
    // Fetch the institutions stored in the users account
    useEffect(() => {
        const fetchInstitutions = async () => {
          try {
            // Get and set instiutions in users account
            const data = await getUsersInstitutions();
            setInstitutions(data);
          } catch (error) {
            console.error("Error fetching institutions:", error);
          }
        };
    
        fetchInstitutions();
      }, []);
    

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedInstitution(event.target.value);
    };

    return (
      <div className="ConfigPage">
        <h1>Create a New Project</h1>
        
        {/* Dropdown menu for selecting an institution*/}
        <label htmlFor="dropdown">Choose an institution:</label>
        <select id="dropdown" value={selectedInstitution} onChange={handleChange}>
            <option value="" disabled>Select an institution</option>
            {institutions.map((institution, index) => (
                <option key={index} value={institution}>
                    {institution}
                </option>
             ))}
        </select>

      {selectedInstitution && <p>Institution selected: {selectedInstitution}</p>}

        <Link to="/project-view">
        <button onClick={handleCreateProject} className="create-project-btn">Create Project</button>
        </Link>
      </div>
    );
  };
  
  export default ProjectConfigPage;