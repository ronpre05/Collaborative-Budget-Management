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
    <div className="px-6 py-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Project Configuration</h1>

      <div className="space-y-6 bg-white p-6 rounded-2xl shadow-md border">
        {/* Institution Dropdown */}
        <div>
          <label htmlFor="institution" className="block text-sm font-medium mb-1">
            Choose an institution:
          </label>
          <select
            id="institution"
            value={selectedInstitution}
            onChange={handleIChange}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>
              Select an institution
            </option>
            {institutions.map((institution, index) => (
              <option key={index} value={institution}>
                {institution}
              </option>
            ))}
          </select>
        </div>

        {/* Template Dropdown */}
        <div>
          <label htmlFor="template" className="block text-sm font-medium mb-1">
            Choose a template:
          </label>
          <select
            id="template"
            value={selectedTemplate}
            onChange={handleTChange}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>
              Select a Template
            </option>
            {templates.map((template, index) => (
              <option key={index} value={template}>
                {template}
              </option>
            ))}
          </select>
        </div>

        {/* Display selected values */}
        {selectedInstitution && (
          <p className="text-sm text-gray-600">
            <span className="font-medium">Institution selected:</span> {selectedInstitution}
          </p>
        )}
        {selectedTemplate && (
          <p className="text-sm text-gray-600">
            <span className="font-medium">Template selected:</span> {selectedTemplate}
          </p>
        )}

        {/* Project Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Project Name:</label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Enter project name"
            required
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Project Acronym */}
        <div>
          <label className="block text-sm font-medium mb-1">Project Acronym:</label>
          <input
            type="text"
            value={projectAcronym}
            onChange={(e) => setProjectAcronym(e.target.value)}
            placeholder="Enter acronym (e.g., AI-2024)"
            maxLength={10}
            required
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Create Button */}
        <div className="pt-2">
          <Link to="/project-view">
            <button
              onClick={handleCreateProject}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              Create Project
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
  
export default CreateProject;