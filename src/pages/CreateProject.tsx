import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { createProjectQuery, getUsersInstitutions, getInstitutionID, getChosenTemplateData, getAllTemplates } from "../database";
import { checkAndAddCategories } from "../database";
import { getCatNames, getTemplate } from "@/newTemplateParser";

//test rahy branch
// Inserts new categories for a project into the database
async function categoryCheck(templateData : any)
{
    // Get names of categories from the template
    let categoryNames = getCatNames(getTemplate(templateData));

    // Check for missing categories and add any missing ones
    await checkAndAddCategories(categoryNames);
}

// Configuration page for creating a new project
const CreateProject: React.FC = () => {
  const [institutions, setInstitutions] = useState<string[]>([]);
  const [selectedInstitution, setSelectedInstitution] = useState<string>("");
  const [templates, setTemplates] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [projectName, setProjectName] = useState<string>("");
  const [projectAcronym, setProjectAcronym] = useState<string>("");
  
  // Create project button call
  const handleCreateProject = async () => 
  {
      try 
      {
        let institutionID = await getInstitutionID(selectedInstitution);

        let templateData = await getChosenTemplateData(selectedTemplate);

        if(institutionID !== null && templateData !== null)
        {
          let projectID =  await createProjectQuery(institutionID, projectName, projectAcronym, templateData);
          
          // Set projectID in localstorage
          if(projectID !== null)
          {
            localStorage.setItem('projectID', projectID);
          }

          // Create categories for template used
          await categoryCheck(templateData);
          console.log("Project created successfully!");
        }
        else
        {
          console.log("Invalid institution ID OR Invalid template data")
          console.log("InstitutionID: ", institutionID);
          console.log("Template Data: ", templateData);
        }
      } 
      catch (error)
      {
        console.error("Error creating project:", error);
      }
  };
  
  // Fetch the institutions stored in the users account
  useEffect(() => 
  {
      const fetchInstitutions = async () => 
      {
        try 
        {
          // Get and set instiutions in users account
          const data = await getUsersInstitutions();
          setInstitutions(data);
        } 
        catch (error) 
        {
          console.error("Error fetching institutions:", error);
        }
      };
  
      fetchInstitutions();
  }, []);

  useEffect(() =>
  {
    const fetchTemplates = async () =>
    {
      try
      {
        const data = await getAllTemplates();
        setTemplates(data);
      }
      catch (error)
      {
        console.error("Error fetching templates: ", error);
      }
    };

    fetchTemplates();
  }, []);
  

  const handleIChange = (event: React.ChangeEvent<HTMLSelectElement>) => 
  {
    setSelectedInstitution(event.target.value);
  };

  const handleTChange = (event: React.ChangeEvent<HTMLSelectElement>) =>
  {
    setSelectedTemplate(event.target.value);
  }

  return (
    <div className="ConfigPage">
      <h1>Project Configuration</h1>
      
      {/* Dropdown menu for selecting an institution*/}
      <label htmlFor="dropdown">Choose an institution:</label>
      <select id="dropdown" value={selectedInstitution} onChange={handleIChange}>
          <option value="" disabled>Select an institution</option>
          {institutions.map((institution, index) => (
            <option key={index} value={institution}>
              {institution}
            </option>
            ))}
      </select>

      {/* Dropdown menu for selecting a template*/}
      <label htmlFor="dropdown">Choose a template:</label>
      <select id="dropdown" value={selectedTemplate} onChange={handleTChange}>
          <option value="" disabled> Select a Template</option>
          {templates.map((template, index) =>(
            <option key={index} value={template}>
              {template}
            </option>
          ))}
      </select>

      {selectedInstitution && <p>Institution selected: {selectedInstitution}</p>}
      {selectedTemplate && <p>Template selected: {selectedTemplate}</p>}
      {/* Project Name Input */}
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