import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { createProjectQuery, getUsersInstitutions, getInstitutionID } from "../database";
import { checkAndAddCategories } from "../database";
import template from "../../template1.json"
import { getCatNames, getTemplate } from "@/newTemplateParser";

//test rahy branch
// Inserts new categories for a project into the database
async function categoryCheck(){
  // Get template data
  let templateData = await getTemplate(template);

  // Get names of categories
  let categoryNames = getCatNames(templateData);

  // Check for missing categories and add any missing ones
  await checkAndAddCategories(categoryNames);
}

// Configuration page for creating a new project
const CreateProject: React.FC = () => {
  const [institutions, setInstitutions] = useState<string[]>([]);
  const [selectedInstitution, setSelectedInstitution] = useState<string>("");
  const [template, setTemplates] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [projectName, setProjectName] = useState<string>("");
  const [projectAcronym, setProjectAcronym] = useState<string>("");
  
  // Create project button call
  const handleCreateProject = async () => {
      try {
        let institutionID = await getInstitutionID(selectedInstitution);

        

        if(institutionID !== null){
          let projectID =  await createProjectQuery(institutionID, projectName, projectAcronym);
          
          // Set projectID in localstorage
          if(projectID !== null){
            localStorage.setItem('projectID', projectID);
          }

          // Create categories for template used
          await categoryCheck();
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
      <h1>Project Configuration</h1>
      
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

      {selectedInstitution && <p>Institution selected: {selectedInstitution}</p>} {/* Project Name Input */}
      <label>Project Name:</label>
      <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Enter project name"
          required
      />

      {/* Project Acronym Input */}
      <label>Project Acronym:</label>
      <input
          type="text"
          value={projectAcronym}
          onChange={(e) => setProjectAcronym(e.target.value)}
          placeholder="Enter acronym (e.g., AI-2024)"
          maxLength={10}
          required
      />

      <Link to="/project-view">
      <button onClick={handleCreateProject} className="create-project-btn">Create Project</button>
      </Link>
    </div>
  );
};
  
export default CreateProject;