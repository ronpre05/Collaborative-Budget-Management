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
 * @returns {Promise<string[]>} A promise that resolves to an array of FieldNames.
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
 * Fetches all FieldValues linked to a given array of FieldIDs.
 * Returns a 2D array of fieldValues. Each 1D array contains the fieldValues linked to the
 * FieldID of that respective index.
 *
 * e.g., Given [[item1, item2], [item3, item4]], with paramter [fieldID1, fieldID2],
 *
 * [item1, item2] are the fieldValues for fieldID1, and [item3,item4], are the fieldValues for fieldID2.
 * @param {number[]} fieldIDs Array of FieldIDs to fetch records for.
 * @returns {Promise<string[][]>} Promise that resolves to 2D array, containing arrays of each FieldValue for a given fieldID.
 * @example
 * const fieldData = await getFieldData(arrayOfFieldIDs);
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
 * Formats data in the required format for the [CategoryDisplay](./categoryDisplay.tsx) component.
 *
 * Flips the columns and rows of given FieldData, and then pushes the array of Category
 * Headings to the front of the 2D array.
 * @param {string[]} categoryHeaders 1D array of CategoryHeadings - FieldNames.
 * @param {string[][]} fieldData 2D array of FieldValues, for a given entryID.
 * @returns {string[][]} A 2D array of data containing [CategoryHeadings, ...fieldData].
 *
 * @example
 * const categoryHeaders = await getCategoryHeaders(categoryID);
 * const fieldData = await getFieldData(arrayOfFieldIDs);
 * const formattedData = formatData(categoryHeaders, fieldData);
 * @see {@link CategoryDisplay}
 */
function formatData(
  categoryHeaders: string[],
  fieldData: string[][]
): string[][] {
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
