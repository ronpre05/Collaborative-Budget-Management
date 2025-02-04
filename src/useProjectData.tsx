import { supabase } from "./database";
import useProjectId from "./useProjectId";
import { useState, useEffect } from "react";

// hook used to get projectId off Supabase
// WARNING: TESTING PURPOSES ONLY

// WARNING: DOESN'T WORK
const useProjectData = () => {
  const projectId = useProjectId(); // grab projectId via our own hook
  const [projectData, setProjectData] = useState<string[][]>([]); // variable to store projectID

  useEffect(() => {
    // only call IF dependency changes (projectID)
    const fetchProjectData = async () => {
      if (!projectId) {
        console.warn("No projectID found, skipping project data fetch.");
        return; // if projectID doesn't exist, don't run
      }

      // query to get 2d array of project fields of the given projectID
      const { data, error } = await supabase
        .from("CategoryEntry")
        .select(
          `
            Categories!inner(categoryname),
            FieldValues!inner(value)
        `
        )
        .eq("projectid", projectId);
      console.log("supabase result:", data);
      if (error) {
        console.error("Error fetching data:", error);
      } else {
        console.log("Fetched data:", data);
      }
      //const result = data.map((entry) => [
      //  entry.Categories?.categoryname,
      //  entry.CategoryFields?.value,
      //  entry.CategoryFields?.datatype,
      //]);
      //setProjectData(result); //update data
    };

    fetchProjectData(); // calls async function inside useEffect
  }, [projectId]); // the dependency in which we call useEffect

  return projectData; // returns latest projectID
};

export default useProjectData;
