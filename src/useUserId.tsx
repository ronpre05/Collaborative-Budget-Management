import { supabase } from "./database";
import useUserEmail from "./useUserEmail";
import { useState, useEffect } from "react";

// hook used to get UserId off Supabase using email provided via Clerk
// WARNING: ASSUMES USER EXISTS WITHIN DATABASE
const useUserId = () => {
  const email = useUserEmail(); // grab user email via our own hook
  const [userId, setUserId] = useState<number | null>(null); // variable to store userId

  useEffect(() => {
    console.log("useUserId hook triggered. Email:", email);
    // only call IF dependency changes (email)
    const fetchUserId = async () => {
      if (!email) {
        console.warn("No email found, skipping user ID fetch.");
        return; // if email doesn't exist, don't run
      }

      console.log("Fetching user ID for email:", email);
      // query to get userId of the given email
      const { data, error } = await supabase
        .from("Users")
        .select("userId")
        .eq("email", email)
        .single();

      if (error) {
        console.error("Error fetching user ID:", error.message);
        return;
      }
      console.log("Fetched user ID:", data?.userId);
      setUserId(data?.userId); //update data
    };

    fetchUserId(); // calls async function inside useEffect
  }, [email]); // the dependency in which we call useEffect

  console.log("Returning userId:", userId);
  return userId; // returns latest userId
};

export default useUserId;
