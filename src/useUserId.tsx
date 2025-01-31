import { supabase } from "./database";
import useUserEmail from "./useUserEmail";
import { useState, useEffect } from "react";

const useUserId = () => {
  const email = useUserEmail();
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      if (!email) return;

      const { data } = await supabase
        .from("Users")
        .select("userId")
        .eq("email", email)
        .single();

      setUserId(data?.userId);
    };

    fetchUserId();
  }, [email]);
  return userId;
};
