import { supabase } from "./database";
import useUserEmail from "./useUserEmail";
import { useState } from "react";

const useUserId = async () => {
  const email = useUserEmail();
  const [userId, setUserId] = useState<number | null>(null);

  const { data } = await supabase
    .from("Users")
    .select("userId")
    .eq("email", email)
    .single();

  setUserId(data?.userId);
  return userId;
};
