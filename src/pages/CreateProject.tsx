import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import {
  createProjectQuery,
  getUsersInstitutions,
  getInstitutionID,
  getChosenTemplateData,
  getAllTemplates,
  checkAndAddCategories
} from "../database";
import { getCatNames, getTemplate } from "../TemplateParser";

async function categoryCheck(templateData: any) {
  let categoryNames = getCatNames(getTemplate(templateData));
  await checkAndAddCategories(categoryNames);
}

const CreateProject: React.FC = () => {
  const navigate = useNavigate();

  const [institutions, setInstitutions] = useState<string[]>([]);
  const [templates, setTemplates] = useState<string[]>([]);
  const [selectedInstitution, setSelectedInstitution] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [projectName, setProjectName] = useState<string>("");
  const [projectAcronym, setProjectAcronym] = useState<string>("");

  const [errors, setErrors] = useState({
    institution: false,
    template: false,
    name: false,
    acronym: false,
  });

  const handleCreateProject = async () => {
    // Check for missing fields
    const newErrors = {
      institution: selectedInstitution === "",
      template: selectedTemplate === "",
      name: projectName.trim() === "",
      acronym: projectAcronym.trim() === "",
    };

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some(Boolean);
    if (hasError) return;

    try {
      const institutionID = await getInstitutionID(selectedInstitution);
      const templateData = await getChosenTemplateData(selectedTemplate);

      if (institutionID && templateData) {
        const projectID = await createProjectQuery(
          institutionID,
          projectName,
          projectAcronym,
          templateData
        );

        if (projectID) {
          localStorage.setItem("projectID", projectID);
        }

        await categoryCheck(templateData);
        console.log("Project created successfully!");
        navigate("/project-view");
      } else {
        console.log("Invalid institution ID OR template data");
      }
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        const data = await getUsersInstitutions();
        setInstitutions(data);
      } catch (error) {
        console.error("Error fetching institutions:", error);
      }
    };
    fetchInstitutions();
  }, []);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const data = await getAllTemplates();
        setTemplates(data);
      } catch (error) {
        console.error("Error fetching templates:", error);
      }
    };
    fetchTemplates();
  }, []);

  return (
    <div className="px-6 py-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Project Configuration</h1>

      <div className="space-y-6 bg-white p-6 rounded-2xl shadow-md border">
        {/* Institution dropdown */}
        <div>
          <label htmlFor="institution" className="block text-sm font-medium mb-1">
            Choose an institution:
          </label>
          <select
            id="institution"
            value={selectedInstitution}
            onChange={(e) => setSelectedInstitution(e.target.value)}
            className={`w-full border rounded-md px-3 py-2 focus:outline-none ${
              errors.institution
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-blue-500"
            }`}
          >
            <option value="" disabled>
              Select an institution
            </option>
            {institutions.map((inst, idx) => (
              <option key={idx} value={inst}>
                {inst}
              </option>
            ))}
          </select>
          {errors.institution && (
            <p className="text-red-500 text-sm mt-1">Please select an institution.</p>
          )}
        </div>

        {/* Template dropdown */}
        <div>
          <label htmlFor="template" className="block text-sm font-medium mb-1">
            Choose a template:
          </label>
          <select
            id="template"
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            className={`w-full border rounded-md px-3 py-2 focus:outline-none ${
              errors.template
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-blue-500"
            }`}
          >
            <option value="" disabled>
              Select a Template
            </option>
            {templates.map((template, idx) => (
              <option key={idx} value={template}>
                {template}
              </option>
            ))}
          </select>
          {errors.template && (
            <p className="text-red-500 text-sm mt-1">Please select a template.</p>
          )}
        </div>

        {/* Project name */}
        <div>
          <label className="block text-sm font-medium mb-1">Project Name:</label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className={`w-full border rounded-md px-3 py-2 focus:outline-none ${
              errors.name 
              ? "border-red-500 focus:ring-red-500" 
              : "focus:ring-blue-500"
            }`}
            placeholder="Enter project name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">Project name is required.</p>
          )}
        </div>

        {/* Project acronym */}
        <div>
          <label className="block text-sm font-medium mb-1">Project Acronym:</label>
          <input
            type="text"
            value={projectAcronym}
            onChange={(e) => setProjectAcronym(e.target.value)}
            maxLength={10}
            className={`w-full border rounded-md px-3 py-2 focus:outline-none ${
              errors.acronym
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-blue-500"
            }`}
            placeholder="Enter project acronym"
          />
          {errors.acronym && (
            <p className="text-red-500 text-sm mt-1">Project acronym is required.</p>
          )}
        </div>

        {/* Submit button */}
        <div className="pt-2">
          <button
            onClick={handleCreateProject}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Create Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
