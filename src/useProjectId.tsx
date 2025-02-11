import { supabase } from "./database";
import useUserId from "./useUserId";
import { useState, useEffect } from "react";

// hook used to get projectId off Supabase
// WARNING: ASSUMES 1 PROJECT PER USER
// ONLY GETS FIRST PROJECT ID
const useProjectId = () => {
  const userId = useUserId(); // grab userID via our own hook
  const [projectId, setProjectId] = useState<number | null>(null); // variable to store projectID

  useEffect(() => {
    // only call IF dependency changes (userID)
    const fetchProjectId = async () => {
      if (!userId) {
        console.warn("No userID found, skipping project ID fetch.");
        return; // if userID doesn't exist, don't run
      }

      // query to get projectID of the given userID
      const { data, error } = await supabase
        .from("UserInstitutionProject")
        .select("projectID")
        .eq("userID", userId);

      if (error) {
        console.error("Error fetching project ID:", error.message);
        return;
      }
      console.log(data[0]);
      setProjectId(data[0]?.projectID); //update data
    };

    fetchProjectId(); // calls async function inside useEffect
  }, [userId]); // the dependency in which we call useEffect

  return projectId; // returns latest projectID
};

export default useProjectId;
