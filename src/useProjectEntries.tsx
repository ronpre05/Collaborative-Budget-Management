import { supabase } from "./database";
import useProjectId from "./useProjectId";
import { useState, useEffect } from "react";

const useProjectEntries = () => {
  const projectId = useProjectId();
  const [projectEntries, setProjectEntries] = useState<number[]>([]);

  useEffect(() => {
    const fetchProjectEntries = async () => {
      if (!projectId) {
        console.warn("No project ID found");
        return;
      }

      const { data, error } = await supabase
        .from("CategoryEntry")
        .select("entryID")
        .eq("projectID", projectId);

      if (error) {
        console.error("Error fetching project categories");
        return;
      }

      console.log(data);
      setProjectEntries(data.map((item) => item.entryID));
    };
    fetchProjectEntries();
  }, [projectId]);
  return projectEntries;
};

export default useProjectEntries;
