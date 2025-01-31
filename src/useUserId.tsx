import { supabase } from "./database";
import useUserEmail from "./useUserEmail";
import { useState, useEffect } from "react";

// hook used to get UserId off Supabase using email provided via Clerk
// WARNING: ASSUMES USER EXISTS WITHIN DATABASE
const useUserId = () => {
  const email = useUserEmail(); // grab user email via our own hook
  const [userId, setUserId] = useState<number | null>(null); // variable to store userId

  useEffect(() => {
    // only call IF dependency changes (email)
    const fetchUserId = async () => {
      if (!email) return; // if email doesn't exist, don't run

      // query to get userId of the given email
      const { data } = await supabase
        .from("Users")
        .select("userId")
        .eq("email", email)
        .single();

      setUserId(data?.userId); //update data
    };

    fetchUserId(); // calls async function inside useEffect
  }, [email]); // the dependency in which we call useEffect

  return userId; // returns latest userId
};

export default useUserId;
