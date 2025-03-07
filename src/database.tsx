import { createClient } from "@supabase/supabase-js"
import { getFieldsSection, getCategoryObject, getFieldNames } from "./templateParser";
import { cleanString } from "./expressionParser"; 
const supabaseUrl = "https://xybccoipttcvmdniwysj.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5YmNjb2lwdHRjdm1kbml3eXNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE5NDI3NjQsImV4cCI6MjA0NzUxODc2NH0.qft8IvKBxpEzW7Uh1D4uDdGafhHzbh7fWlfil7B5nKA"
export const supabase = createClient(supabaseUrl, supabaseKey)

// Check for any missing categories and add them to the db
export const checkAndAddCategories = async (categoryList: string[], categoryNames: string[]): Promise<void | null> => {
    // Retrieve the project ID from localStorage
    const projectID = localStorage.getItem("projectID");

    if (!projectID) {
        console.error("No project ID found in localStorage");
        return null;
    }

    // Query the database for existing categories
    const { data, error } = await supabase
        .from("Categories")
        .select("categoryName")
        .eq("projectID", projectID)
        .in("categoryName", categoryNames);

    if (error) {
        console.error("Error fetching categories:", error);
        return null;
    }

    // Get categories found in database
    const existingCategoryNames = new Set((data ?? []).map(category => category.categoryName));

    // Filter out for any categories which are missing from the db
    const missingCategories = categoryNames.filter(categoryName => !existingCategoryNames.has(categoryName));

    // No missing categories
    if (missingCategories.length === 0) {
        console.log("All categories already exist");
        return;
    }

    // Map projectid with missing categories
    const newCategories = missingCategories.map(categoryName => ({
        projectID,
        categoryName
    }));

    // Insert missing categories
    const { error: insertError } = await supabase
        .from("Categories")
        .insert(newCategories);

    if (insertError) {
        console.error("Error inserting missing categories:", insertError);
        return null;
    }
    
    // Add missing fields for the given categories
    await createCategoryFields(categoryList, missingCategories);
    console.log("Missing categories added successfully");
};

// Creates the fields for a list of categories in the database
export const createCategoryFields = async (categoryList: string[], categoryNames: string[]): Promise<void | null> => {
    const projectID = localStorage.getItem("projectID");

    if (!projectID) {
        console.error("No projectID found in localStorage");
        return null;
    }
    
    // For every category
    for (const categoryName of categoryNames){  

        // Get categoryID from the categoryName
        const {data, error} = await supabase
        .from("Categories")
        .select("categoryID")
        .eq("projectID", projectID)
        .eq("categoryName", categoryName)
        .single();

        if (error) {
            console.error("Error fetching category ID for ${categoryName}:", error);
            continue;
        }

        if (!data) {
            console.warn("No category found for ${categoryName}");
            continue;
        }

        // Get categoryID
        const categoryID = data?.categoryID;

        // Get field data for the category
        let categoryObject = getCategoryObject(categoryList, categoryName);
        let fieldData = getFieldsSection(categoryObject);
        // Filter for field names
        let fieldNames = getFieldNames(fieldData);

        if (!fieldNames.length) {
            console.warn("No fields found for category: ${categoryName}");
            continue;
        }

        // Prepare fields for insertion
        const fieldEntries = fieldNames.map(fieldName => ({
            categoryID,
            fieldName,
        }));
    
        // Insert all field entries into CategoryFields
        const { error: insertError } = await supabase
            .from("CategoryFields")
            .insert(fieldEntries);

        if (insertError) {
            console.error("Error inserting fields for ${categoryName}:", insertError);
            continue;
        }
    }
}

export const createProjectQuery = async (institutionID: number): Promise<string | null> => {
    // Retrieve the user ID from localStorage
    const userID = localStorage.getItem("userID");

    if (!userID) {
        console.error("No user ID found in localStorage");
        return null;
    }
    
    const {data, error} = await supabase
        .from("Project")
        .insert({principalInvestigatorID: userID})
        .select("projectID");
    if(error){
        console.log("Error creating project: ", error.message);
        return null;
    }

    if(data && data.length > 0){
        const projectID = data[0].projectID;
        await createUserInstitutionProjectQuery(institutionID, projectID);
        return projectID;
    }

    return null;
}

    
export const createUserInstitutionProjectQuery = async (institutionID: number, projectID: number): Promise<void> => {
    // Retrieve the user ID from localStorage
    const userID = localStorage.getItem("userID");

    if (!userID) {
        console.error("No user ID found in localStorage");
        return;
    }

    const {data, error} = await supabase
        .from("UserInstitutionProject")
        .insert({userID : userID, institutionID: institutionID, roleID: 3, projectID: projectID});
    if(error){
        console.log("Error creating user institution project: ", error.message);
    }
    else{
        console.log("Successfully created user institution project: ", data)
    }
}

// Query to find the ID of an institution given its name
export const getInstitutionID = async (institutionName : String): Promise<number | null> => {

    const {data, error} = await supabase
        .from("Institutions")
        .select("institutionID")
        .eq("institutionName", institutionName)
        .single();
    if(error){
        console.log("Error finding institution ID: ", error.message);
        return null;
    }

    // Return the ID of the institution
    return data ? data.institutionID : null;
}

export const getUsersInstitutions = async (): Promise<any[]> => {
    // Retrieve the user ID from localStorage
    const userID = localStorage.getItem("userID");

    if (!userID) {
        console.error("No user ID found in localStorage.");
        // Return empty array if no user logged in
        return [];
    }

    // Find all Institutions linked to the users account
    const { data, error } = await supabase
        .from("UserInstitutions")
        .select("Institutions(institutionName)")
        .eq("userID", userID);

    if (error) {
        console.error("Error fetching institutions:", error);
        return [];
    }

    // Return institutions as array of strings
    return data.map((entry: any) => entry.Institutions.institutionName);
};

export const inviteUserToProject = async (email: string, projectID: number, roleID: number) => {
    // Find the userID from the email
    const { data: user, error: userError } = await supabase
        .from("Users")
        .select("userID")
        .eq("email", email)
        .single();
   
    if (userError || !user) {
        console.error("User not found:", userError?.message);
        return null;
    }
   
    const userID = user.userID;
   
    // Insert into UserInstitutionProject to associate the user with the project and their role
    const { data, error } = await supabase
        .from("UserInstitutionProject")
        .insert({ userID, projectID, roleID })
        .select("*");

        console.log("Insert data:", data);
        console.log("Insert error:", error);
   
    if (error) {
        console.error("Error inviting user:", error.message);
    } else {
        console.log("User invited successfully:", data); // Log the actual response data
    }
    
    return data; // Ensure this is returning the inserted data or null
   };
   


// Function to fetch all projects associated with a given user ID
export const getUsersProjects = async (): Promise<any[]> => {
    // Retrieve the user ID from localStorage
    const userID = localStorage.getItem("userID");

    if (!userID) {
        console.error("No user ID found in localStorage.");
        // Return empty array if no user logged in
        return [];
    }

    // Query the "UserInstitutionProject" table to get the projects for the specified user
    const { data, error } = await supabase
        .from("UserInstitutionProject") // Table storing user-project associations
        .select("projectID, Project(*)") // Display all projectIDs
        .eq("userID", userID); // Filtering to only retrieve projects belonging to the specified user

    // Debugging log to check the retrieved data
    // console.log("Successfully retrieved user institution projects: ", data);

    // Error handling: Log and throw an error if the query fails
    if (error) {
        console.error("Error fetching user projects: ", error.message);
        throw new Error(error.message);
    }

    // Debugging log to confirm the fetched projects
    // console.log("Fetched user projects: ", data);

    // Return the retrieved data, or an empty array if no data is found
    return data || [];
};

export const removeCollaborator = async (userID: number, projectID: number) => {
    const { error } = await supabase
        .from("UserInstitutionProject")
        .delete()
        .eq("userID", userID)
        .eq("projectID", projectID);

    if (error) {
        console.error("Error removing collaborator:", error.message);
        return false;
    } else {
        console.log("Collaborator removed successfully.");
        return true;
    }
};



/*

*/
export const createCategoryEntry = async (categoryName: string): Promise<{ categoryID: number, entryID: number } | null> => {
    const projectID = localStorage.getItem("projectID");
    
    if (!projectID) {
        console.error("Project ID not found in local storage.");
        return null;
    }

    // Check if the category already exists for the current project
    let { data: existingCategory, error: categoryError } = await supabase
        .from("Categories")
        .select("categoryID")
        .eq("categoryName", categoryName)
        .eq("projectID", projectID)
        .single();

    if (categoryError && categoryError.code !== "PGRST116") { 
        console.error("Error checking existing category:", categoryError.message);
        return null;
    }

    let categoryID;
    if (existingCategory) {
        categoryID = existingCategory.categoryID;
    } else {
        // Insert new category
        const { data: newCategory, error: newCategoryError } = await supabase
            .from("Categories")
            .insert({ categoryName, projectID })
            .select("categoryID")
            .single();

        if (newCategoryError) {
            console.error("Error creating category:", newCategoryError.message);
            return null;
        }
        categoryID = newCategory.categoryID;
    }

    console.log("Using Category ID:", categoryID);

    // Create a new entry in CategoryEntry
    const { data: entryData, error: entryError } = await supabase
        .from("CategoryEntry")
        .insert({ projectID, categoryID, institutionID: null })
        .select("entryID")
        .single();

    if (entryError) {
        console.error("Error creating CategoryEntry:", entryError.message);
        return null;
    }

    return { categoryID, entryID: entryData.entryID };
};

export const insertFieldValues = async (entryID: number, categoryID: number, data: Record<string, string>) => {
    const fieldValues = [];

    for (const [fieldName, value] of Object.entries(data)) {
        let { data: existingField, error: fieldError } = await supabase
            .from("CategoryFields")
            .select("fieldID")
            .eq("categoryID", categoryID)
            .eq("fieldName", fieldName)
            .single();

        if (fieldError && fieldError.code !== "PGRST116") {
            console.error(`Error checking field ${fieldName}:`, fieldError.message);
            continue;
        }

        let fieldID;
        if (existingField) {
            fieldID = existingField.fieldID;
        } else {
            const { data: newField, error: insertError } = await supabase
                .from("CategoryFields")
                .insert({ categoryID, fieldName })
                .select("fieldID")
                .single();

            if (insertError) {
                console.error(`Error inserting field ${fieldName}:`, insertError.message);
                continue;
            }
            fieldID = newField.fieldID;
        }

        fieldValues.push({ entryID, fieldID, value });
    }

    if (fieldValues.length === 0) {
        console.warn("No valid fields to insert.");
        return;
    }

    const { error } = await supabase.from("FieldValues").insert(fieldValues);

    if (error) {
        console.error("Error inserting FieldValues:", error.message);
    } else {
        console.log("Successfully inserted FieldValues:", fieldValues);
    }
};


/*
Main function to insert forms into database.
Example usage:
createEntry("Personnel Costs", { Name: "John Pork", Role: admin, StartDate: 01/01,2025, EndDate: 01/01/2030})
*/

export const createEntry = async (categoryName: string, fieldData: Record<string, string>) => {
    const categoryEntry = await createCategoryEntry(categoryName);
    if (!categoryEntry) return;

    const { categoryID, entryID } = categoryEntry;
    await insertFieldValues(entryID, categoryID, fieldData);
};




export const getRoles = async () => {
    const { data, error } = await supabase
        .from("Roles")  // Make sure "roles" is the correct table name in Supabase
        .select("roleID, roleName");

    if (error) {
        console.error("Error fetching roles:", error.message);
        return [];
    }

    console.log("Roles from database:", data); // Debugging log
    return data || [];
};


// Get category id using category name and project id
export const getCategoryID = async (catName : string, projectID : number): Promise<any> =>
{
    const { data, error } = await supabase
        .from("Categories")
        .select("categoryID")
        .eq("categoryName", catName)
        .eq("projectID", projectID)
        .single()

    if(error)
    {
        console.error("Error fetching category ids: ", error, catName);
        return -1;
    }

    return data.categoryID;
}


// Get all entry ids using category id
export const getAllCategoryEntries = async (catID : number) : Promise<any[]> =>
{
    const { data, error } = await supabase
        .from("CategoryEntry")
        .select("entryID")
        .eq("categoryID", catID)
    
    if(error)
    {
        console.error("Error fetching entry ids: ", error);
        return [];
    }

    return data.map((entry : any) => entry.entryID);
}



// Get field id from catid and field name
export const getFieldID = async (catID : number, fieldName : string) : Promise<any> =>
{
    const { data, error } = await supabase
        .from("CategoryFields")
        .select("fieldID")
        .eq("categoryID", catID)
        .eq("fieldName", fieldName)
        .single()

    if(error)
    {
        console.error("Error fetching field id: ", error, fieldName);
        return -1;
    }

    return data.fieldID;
}


// Get value from matching entry and field ids
export const getValue = async (entryID : number, fieldID : number) : Promise<any> =>
{
    const { data, error } = await supabase
        .from("FieldValues")
        .select("value")
        .eq("entryID", entryID)
        .eq("fieldID", fieldID)
        .single()
    
    if(error)
    {
        console.error("Error fecthing value: ", error)
        return -1;
    }

    return data.value;
}

export const getValueID = async (entryID : number, fieldID : number) : Promise<any> =>
{
    const { data, error } = await supabase
        .from("FieldValues")
        .select("valueID")
        .eq("entryID", entryID)
        .eq("fieldID", fieldID)
        .single()
    
    if(error)
    {
        console.error("Error fecthing value ID: ", error)
        return -1;
    }

    return data.valueID;
}

// Update an entry
export const updateIndividualField = async (valueID : number, result : any) : Promise<any> =>
{
    const { error } = await supabase
        .from("FieldValues")
        .update({value: result})
        .eq("valueID", valueID)

    if(error)
    {
        console.error("Error updating value: ", error);
        return -1;
    }

    return 1;
}

// Add an institution tot he database and reutn its ID
export const addInstitution = async (institutionName : String) : Promise<number | null> =>
{
    const existsInstitution = await checkExisitingInstitution(institutionName);

    // If institution exists in db, return ID found
    if(existsInstitution !== null){
        return existsInstitution;
    }

    const { data, error } = await supabase
    .from("Institutions")
    .insert({institutionName})
    .select("institutionID")
    .single();

    if(error || !data){
        console.error("Error inserting institution into db: ", error);
    }

    return data?.institutionID;
}

// Returns 1 if institution exists or 0 if institution does not exist
export const checkExisitingInstitution = async (institutionName : String) : Promise<number | null> =>
{
    const { data, error } = await supabase
    .from("Institutions")
    .select("institutionID")
    .eq("institutionName", institutionName)
    .single();

    if(error || !data){
        // No institution found
        return null;
    }
    // Institution found return ID
    return data.institutionID;
}
    
// Gets all institutions stored in database
export const getInstitutions = async (inputValue: string) => {
    if (!inputValue){
        return [];
    }
  
    const { data, error } = await supabase
      .from("Institutions")
      .select("institutionName")
      .ilike("institutionName", `%${inputValue}%`)
      .limit(10);
  
    if (error) {
      console.error("Error fetching institutions:", error);
      return [];
    }
  
    return data.map((institution) => ({
      label: institution.institutionName,
      value: institution.institutionName,
    }));
};

// Inserts the relation between a user and an institution into the db
export const addUserInstitution = async (institutionID : number) : Promise<void> =>
{    
    // Retrieve the user ID from localStorage
    const userID = localStorage.getItem("userID");

    if (!userID) {
        console.error("No user ID found in localStorage.");
        // Return if no user logged in
        return;
    }

    const { data, error } = await supabase
    .from("UserInstitutions")
    .insert({userID : userID, institutionID: institutionID});

    if(error){
        // No institution found
        console.error("Error adding user institution: ", error);
    }
}
