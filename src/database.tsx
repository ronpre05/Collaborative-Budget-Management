import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xybccoipttcvmdniwysj.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5YmNjb2lwdHRjdm1kbml3eXNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE5NDI3NjQsImV4cCI6MjA0NzUxODc2NH0.qft8IvKBxpEzW7Uh1D4uDdGafhHzbh7fWlfil7B5nKA'
export const supabase = createClient(supabaseUrl, supabaseKey)

// Check for any missing categories and add them to the db
export const checkAndAddCategories = async (categoryNames: string[]): Promise<void | null> => {
    // Retrieve the project ID from localStorage
    const projectID = localStorage.getItem('projectID');

    if (!projectID) {
        console.error('No project ID found in localStorage');
        return null;
    }

    // Query the database for existing categories
    const { data, error } = await supabase
        .from('Categories')
        .select('categoryName')
        .eq('projectID', projectID)
        .in('categoryName', categoryNames);

    if (error) {
        console.error('Error fetching categories:', error);
        return null;
    }

    // Get categories found in database
    const existingCategoryNames = new Set((data ?? []).map(category => category.categoryName));

    // Filter out for any categories which are missing from the db
    const missingCategories = categoryNames.filter(categoryName => !existingCategoryNames.has(categoryName));

    // No missing categories
    if (missingCategories.length === 0) {
        console.log('All categories already exist');
        return;
    }

    // Map projectid with missing categories
    const newCategories = missingCategories.map(categoryName => ({
        projectID,
        categoryName
    }));

    // Insert missing categories
    const { error: insertError } = await supabase
        .from('Categories')
        .insert(newCategories);

    if (insertError) {
        console.error('Error inserting missing categories:', insertError);
        return null;
    }

    console.log('Missing categories added successfully');
};


export const createProjectQuery = async (institutionID: number): Promise<string | null> => {
    // Retrieve the user ID from localStorage
    const userID = localStorage.getItem('userID');

    if (!userID) {
        console.error('No user ID found in localStorage');
        return null;
    }
    
    const {data, error} = await supabase
        .from('Project')
        .insert({principalInvestigatorID: userID})
        .select("projectID");
    if(error){
        console.log('Error creating project: ', error.message);
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
    const userID = localStorage.getItem('userID');

    if (!userID) {
        console.error('No user ID found in localStorage');
        return;
    }

    const {data, error} = await supabase
        .from('UserInstitutionProject')
        .insert({userID : userID, institutionID: institutionID, roleID: 3, projectID: projectID});
    if(error){
        console.log('Error creating user institution project: ', error.message);
    }
    else{
        console.log('Successfully created user institution project: ', data)
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
        console.log('Error finding institution ID: ', error.message);
        return null;
    }

    // Return the ID of the institution
    return data ? data.institutionID : null;
}

export const getUsersInstitutions = async (): Promise<any[]> => {
    // Retrieve the user ID from localStorage
    const userID = localStorage.getItem('userID');

    if (!userID) {
        console.error('No user ID found in localStorage.');
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
   
    if (error && !null) {
        console.error("Error inviting user:", error.message);
    } else {
        console.log("User invited successfully:", data); // Log the actual response data
    }
    
    return data; // Ensure this is returning the inserted data or null
   };
   


// Function to fetch all projects associated with a given user ID
export const getUsersProjects = async (): Promise<any[]> => {
    // Retrieve the user ID from localStorage
    const userID = localStorage.getItem('userID');

    if (!userID) {
        console.error('No user ID found in localStorage.');
        // Return empty array if no user logged in
        return [];
    }

    // Query the 'UserInstitutionProject' table to get the projects for the specified user
    const { data, error } = await supabase
        .from('UserInstitutionProject') // Table storing user-project associations
        .select(`projectID, Project(*)`) // Display all projectIDs
        .eq('userID', userID); // Filtering to only retrieve projects belonging to the specified user

    // Debugging log to check the retrieved data
    console.log('Successfully retrieved user institution projects: ', data);

    // Error handling: Log and throw an error if the query fails
    if (error) {
        console.error('Error fetching user projects: ', error.message);
        throw new Error(error.message);
    }

    // Debugging log to confirm the fetched projects
    console.log('Fetched user projects: ', data);

    // Return the retrieved data, or an empty array if no data is found
    return data || [];
};





// Create a new CategoryEntry and return entryID
export const createCategoryEntry = async (categoryID: number): Promise<number | null> => {
    const { data, error } = await supabase
        .from('CategoryEntry')
        //////////CHANGE projectID:1 to getProject function when implemented
        .insert({ projectID: 1, categoryID: categoryID, institutionID: null })
        .select('entryID')
        .single();

    if (error) {
        console.error('Error creating CategoryEntry:', error.message);
        return null;
    }

    console.log('Successfully created CategoryEntry:', data);
    return data.entryID;
};

// checks field exists, return fieldID
export const ensureFieldExists = async (categoryID: number, fieldName: string): Promise<number | null> => {
    // Check if the field already exists
    let { data, error } = await supabase
        .from('CategoryFields')
        .select('fieldID')
        .eq('categoryID', categoryID)
        .eq('value', fieldName)
        .single();

    if (error && error.code !== 'PGRST116') { // Ignore "no rows found" error
        console.error(`Error checking field "${fieldName}":`, error.message);
        return null;
    }

    // If the field exists, return its fieldID
    if (data) return data.fieldID;

    // If not, insert new field
    const { data: newField, error: insertError } = await supabase
        .from('CategoryFields')
        .insert({ categoryID, value: fieldName, datatype: 'varchar' })
        .select('fieldID')
        .single();

    if (insertError) {
        console.error(`Error inserting new field "${fieldName}":`, insertError.message);
        return null;
    }

    return newField.fieldID;
};


const ensureCategoryExists = async (categoryID: number) => {
    const { data } = await supabase
        .from('Categories')
        .select('categoryID')
        .eq('categoryID', categoryID)
        .single();

    if (!data) {
        console.log(`Category ${categoryID} not found. Creating new category...`);

        const { error: insertError } = await supabase
            .from('Categories')
            .insert({ categoryID, categoryname: 'PLACEHOLDER' });

        if (insertError) {
            console.error(`Error creating category ${categoryID}:`, insertError.message);
            return false;
        }
    }
    return true;
};

//insert values based on a dictionary input
export const insertFieldValues = async (entryID: number, categoryID: number, data: Record<string, string>) => {
    const fieldValues = [];

    for (const [fieldName, value] of Object.entries(data)) {
        const fieldID = await ensureFieldExists(categoryID, fieldName);
        if (!fieldID) continue;

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

// Main function to create an entry with dynamic fields
export const createEntry = async (categoryID: number, fieldData: Record<string, string>) => {
    await ensureCategoryExists(categoryID);
    const entryID = await createCategoryEntry(categoryID);
    if (!entryID) return;

    await insertFieldValues(entryID, categoryID, fieldData);
};

/*
to use this function:
To add new fields you can add new entries to the dictionary easily.

if categoryID does not exist in the Categories table then a new row is created but with Placeholder for categoryname

may be possible to use template jsons to create the dictionarys automatically

for personnel costs (as categoryID is 1)
createEntry(1, {
      "Employee Name" : newName,
      "Role" : newRole,
      "Amount" : total.toString(),
      "Monthly Salary" : newSalary,
      "Person Months" : personMonths.toString(),
      "Why" : newJustification
  });

for equipment costs:
createEntry(2, {
      "What" : newName,
      "Why" : newRole,
      "Amount" : total.toString()
  });

*/


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