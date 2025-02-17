import { supabase } from "./database";

/**
 * Fetches categoryID off a given entryID.
 * @param {number} entryID The ID of the entry to fetch the categoryID for.
 * @returns {Promise<number>} A promise that resolves to the categoryID linked to an entryID, as a number.
 *
 * @example
 * const categoryID = await getCategoryID(entryID);
 */
async function getCategoryID(entryID: number): Promise<number> {
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

/**
 * Fetches all FieldNames for the Field of a given Category.
 * @param {number} categoryID ID of category to fetch FieldNames for.
 * @returns {Promise<string[]>} A promise that resolves to a 2D array of FieldNames.
 *
 * @example
 * const categoryHeaders = await getCategoryHeaders(categoryID);
 */
async function getCategoryHeaders(categoryID: number): Promise<string[]> {
  const { data, error } = await supabase
    .from("CategoryFields")
    .select("fieldName")
    .eq("categoryID", categoryID);
  if (error) {
    console.error("Unable to fetch headings for CategoryID:", categoryID);
    return [];
  }

  return data.map((item) => item.fieldName);
}

/**
 * Fetches all FieldIDs of the Fields linked to a given Category.
 * @param {number} categoryID ID of category to fetch FieldIDs for.
 * @returns {Promise<number[]>} A promise that resolves to an array of FieldIDs as numbers.
 *
 * @example
 * const fieldIDs = await getFieldIDs(categoryID);
 */
async function getFieldIDs(categoryID: number): Promise<number[]> {
  const { data, error } = await supabase
    .from("CategoryFields")
    .select("fieldID")
    .eq("categoryID", categoryID);
  if (error) {
    console.error("Unable to fetch field IDs for CategoryID:", categoryID);
    return [];
  }
  return data.map((item) => item.fieldID);
}

/**
 *
 * @param fieldIDs
 * @returns
 */
async function getFieldData(fieldIDs: number[]): Promise<string[][]> {
  const fieldData = [];
  for (const fieldID of fieldIDs) {
    console.log("fetching data for fieldID:", fieldID);

    const { data, error } = await supabase
      .from("FieldValues")
      .select("value")
      .eq("fieldID", fieldID);
    if (error) {
      console.error("Unable to fetch fieldData for fieldID:", fieldID);
      return [[]];
    }
    const bufferArray = data.map((item) => item.value);
    console.log("Result for fieldID:", fieldID, "is:", bufferArray);
    fieldData.push(bufferArray);
  }

  return fieldData;
}

/**
 *
 * @param categoryHeaders
 * @param fieldData
 * @returns
 */
async function formatData(
  categoryHeaders: string[],
  fieldData: string[][]
): Promise<string[][]> {
  const transposed = fieldData[0].map((_, colIndex) =>
    fieldData.map((row) => row[colIndex])
  );
  transposed.unshift(categoryHeaders);

  return transposed;
}

/**
 *
 * @param entryID
 * @returns
 */
export async function getCategoryData(entryID: number): Promise<string[][]> {
  const catID = await getCategoryID(entryID);
  const fieldIDs = await getFieldIDs(catID);
  const catHeaders = await getCategoryHeaders(catID);
  const fieldData = await getFieldData(fieldIDs);
  const result = await formatData(catHeaders, fieldData);

  return result;
}
