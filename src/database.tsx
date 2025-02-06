import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xybccoipttcvmdniwysj.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5YmNjb2lwdHRjdm1kbml3eXNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE5NDI3NjQsImV4cCI6MjA0NzUxODc2NH0.qft8IvKBxpEzW7Uh1D4uDdGafhHzbh7fWlfil7B5nKA'
export const supabase = createClient(supabaseUrl, supabaseKey)

export const createProjectQuery = async (institutionID: number): Promise<void> => {
    // Retrieve the user ID from localStorage
    const userID = localStorage.getItem('userID');

    if (!userID) {
        console.error('No user ID found in localStorage.');
        return;
    }
    
    const {data, error} = await supabase
        .from('Project')
        .insert({principalInvestigatorID: userID})
        .select("projectID");
    if(error){
        console.log('Error creating project: ', error.message);
        return;
    }

    if(data && data.length > 0){
        const projectID = data[0].projectID;
        await createUserInstitutionProjectQuery(institutionID, projectID);
    }

}

    
export const createUserInstitutionProjectQuery = async (institutionID: number, projectID: number): Promise<void> => {
    // Retrieve the user ID from localStorage
    const userID = localStorage.getItem('userID');

    if (!userID) {
        console.error('No user ID found in localStorage.');
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