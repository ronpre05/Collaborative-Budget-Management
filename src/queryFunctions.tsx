import { SupabaseClient } from "@supabase/supabase-js";
import { getAllCategoryEntries, getAllSubEntries, getFieldName, getSubEntriesForEntry, supabase } from "./database";
import { cleanString } from "./expressionParser";
import { findCatObject, getSubEntryNames, getTemplateFromID } from "./newTemplateParser";
import { TemplateData } from "./types";
/*
async function getprojectID(categoryID: number): Promise<number> {
  const { data, error } = await supabase
    .from("Categories")
    .select("projectID")
    .eq("categoryID", categoryID)
    .single();

  if (error) {
    console.error("Unable to fetch projectID for categoryID:", categoryID);
  }

  return data?.projectID;
}

async function getEntryID(
  projectID: number,
  categoryID: number
): Promise<number> {
  const { data, error } = await supabase
    .from("CategoryEntry")
    .select("entryID")
    .eq("projectID, categoryID", [projectID, categoryID])
    .single();

  if (error) {
    console.error(
      "Unable to fetch entry ID for projectID, categoryID:",
      projectID,
      categoryID
    );
  }
  return data?.entryID;
}
*/

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

  return data.map((item) => cleanString(item.fieldName));
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
      .select("value, entryID")
      .eq("fieldID", fieldID);
    if (error) {
      console.error("Unable to fetch fieldData for fieldID:", fieldID);
      return [[]];
    }
    data.sort((one, two) => 
    {
      // Sort the values by their entry id to ensure that the entries are
      // displayed in the correct order
      if(one.entryID > two.entryID)
      {
          return 1;
      }
      
      if(one.entryID < two.entryID)
      {
          return -1;
      }

      return 0;
    });
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
 * Master function that takes an entryID and returns all relevant field data
 * for said ID as a 2D array usable by [CategoryDisplay](./categoryDisplay.tsx).
 * @param {number} entryID ID of the Category Entry that data is wanted for.
 * @returns {string[][]} A 2D array of data containing [CategoryHeadings, ...fieldData].
 *
 * @example
 * const categoryData = await getCategoryData(entryID);
 *
 * @see {@link CategoryDisplay}
 */
export async function getCategoryDataEntryOnly(
  entryID: number
): Promise<string[][]> {
  const catID = await getCategoryID(entryID);
  const fieldIDs = await getFieldIDs(catID);
  const catHeaders = await getCategoryHeaders(catID);
  const fieldData = await getFieldData(fieldIDs);
  const result = formatData(catHeaders, fieldData);

  return result;
}

// CALL THIS ONE IF YOU ONLY HAVE CATEGORY ID
export async function getCategoryDataCatOnly(categoryID: number): Promise<string[][]> {
  // const projectID = await getprojectID(categoryID);
  // const entryID = await getEntryID(projectID, categoryID);
  const fieldIDs : number[] = await getFieldIDs(categoryID);

  const projectID = await getProjectFromCatID(categoryID);
  const template : TemplateData = await getTemplateFromID(projectID);
  const catName = await getCategoryName(categoryID);
  const catObject = findCatObject(catName, template.categories);
  const subEntryNames = getSubEntryNames(catObject);

  let useFieldIDs : number[] = [];
  for(let id of fieldIDs)
  // Filter out field ids which are a sub entry, their data will be accessed separately
  {
    if(!subEntryNames.includes(await getFieldName(id)))
    {
      useFieldIDs.push(id);
    }
  }

  const catHeaders = await getCategoryHeaders(categoryID);
  let useCatHeaders = [];

  for (let name of catHeaders)
  {
    // Filter out headers which are a sub entry, they should all be displayed under a single header
    if(!subEntryNames.includes(name))
    {
      useCatHeaders.push(name);
    }
  }

  // Get the field data for the non sub entries
  const fieldData = await getFieldData(useFieldIDs);

  if(catObject.hassubentry)
    // To process if it has a sub entry
  {
      // Add sub entries to the headers
      useCatHeaders.push("SubEntries");

      // Get all of the entry ids for the category
      const entryIDs = await getAllCategoryEntries(categoryID);

      // Sort them to match the order of the original data
      entryIDs.sort();

      // Stores the list of strings, each one is all of the sub entries for that entry
      let subEntriesData : string[] = [];

      for(let entry of entryIDs)
      // For each entry
      {
        // Get all sub entries for that entry
        const subEntriesRecords = await getSubEntriesForEntry(entry);

        // Stores the string for the entries sub entry data
        let entryData : string = "";

        for(let subEntry of subEntriesRecords)
        // For each record (a single sub entry)
        {
          // Start the string
          entryData = (entryData + "{ ");

          for(let [key, value] of Object.entries(subEntry))
          // For each key in the record
          {
            // Build up the display of the sub entry field
            entryData = (entryData + "(" + key + " : " + value + ")  ");
          }

          // Close of the string
          entryData = (entryData + " } ");             
        }
        
        if(entryData == "{ ")
        {
          // If just blank, reset to an empty string
          subEntriesData.push("");
        }
        else
        { 
          // Add this string to the final output list
          subEntriesData.push(entryData);
        }
      
      }

      // Add all of the output list string
      fieldData.push(subEntriesData);  
  }
     
  // Check if fieldData is empty or its first element is undefined.
  if (!fieldData || fieldData.length === 0 || !fieldData[0]) {
    return [catHeaders]; // Return only the headers if there's no data.
  }

  const result = formatData(useCatHeaders, fieldData);

  return result;
}

async function getProjectFromCatID(categoryID : number) : Promise<number>
{
    const { data, error } = await supabase
      .from("Categories")
      .select("projectID")
      .eq("categoryID", categoryID)
      .single()

    if(error)
    {
      return 0;
    }
      
    return data.projectID;
}

async function getCategoryName(categoryID : number) : Promise<string>
{
    const { data, error } = await supabase
      .from("Categories")
      .select("categoryName")
      .eq("categoryID", categoryID)
      .single()

    if(error)
    {
      return "";
    }

    return data.categoryName;

}
