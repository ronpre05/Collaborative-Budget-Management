import { supabase } from "./database";
export async function getCategoryID(entryID: number): Promise<number> {
  const { data, error } = await supabase
    .from("CategoryEntry")
    .select("categoryID")
    .eq("entryID", entryID)
    .single();

  if (error) {
    console.error("Unable to fetch CategoryID for EntryID:", entryID);
    return -1;
  }

  return data?.categoryID;
}
