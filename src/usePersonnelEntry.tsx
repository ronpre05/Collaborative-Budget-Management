import { useState } from "react";
import { createPersonnelEntry } from "./database";

const usePersonnelEntry = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addPersonnelEntry = async (
    name: string,
    salary: string,
    totalCost: string,
    justification: string,
    personMonths: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      await createPersonnelEntry(name, salary, totalCost, justification, personMonths);
    } catch (err) {
      setError("Failed to create personnel entry");
      console.error("Error creating personnel entry:", err);
    } finally {
      setLoading(false);
    }
  };

  return { addPersonnelEntry, loading, error };
};

export default usePersonnelEntry;
