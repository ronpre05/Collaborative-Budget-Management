import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xybccoipttcvmdniwysj.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5YmNjb2lwdHRjdm1kbml3eXNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE5NDI3NjQsImV4cCI6MjA0NzUxODc2NH0.qft8IvKBxpEzW7Uh1D4uDdGafhHzbh7fWlfil7B5nKA'
export const supabase = createClient(supabaseUrl, supabaseKey)

export const createProjectQuery = async (): Promise<void> => {
    const {data, error} = await supabase
        .from('Project')
         //// replace PLACEHOLDER with actual templates
        .insert({templateID: 'PLACEHOLDER'});
    if(error){
        console.log('Error creating project: ', error.message);
    }
    else{
        console.log('Successfully created project ', data)
    }
}

    
export const createUserInstitutionProjectQuery = async (): Promise<void> => {
    const {data, error} = await supabase
        .from('UserInstitutionProject')
         //// obviously need to replace the PLACEHOLDER text with actual data
        .insert({userID : 'PLACEHOLDER', institutionID: 'PLACEHOLDER', roleID: 'PLACEHOLDER', projectID: 'PLACEHOLDER'});
    if(error){
        console.log('Error creating user institution project: ', error.message);
    }
    else{
        console.log('Successfully created user institution project: ', data)
    }
}

export const getUsersProjects = async (userID: number): Promise<any[]> => {
    const { data, error } = await supabase
        .from('UserInstitutionProject')
        .select(`
            projectID,
            Project(*)
        `)
        .eq('userID', userID);

    if (error) {
        console.error('Error fetching user projects: ', error.message);
        throw new Error(error.message);
    }

    console.log('Fetched user projects: ', data);
    return data || [];
};




export const createCategoryEntry = async (categoryID: number): Promise<number | null> => {
    const { data, error } = await supabase
        .from('CategoryEntry')
        .insert({ projectID: 1, categoryID: categoryID, institutionID: null })
        .select('entryID')
        .single(); // should only create 1 row

    if (error) {
        console.error('Error creating CategoryEntry:', error.message);
        return null;
    }

    console.log('Successfully created CategoryEntry:', data);
    return data.entryID;
};

export const insertFieldValues = async (entryID: number, values: string[]) => {
    const fieldIDs = [1, 2, 3, 4, 5];

    for (let i = 0; i < fieldIDs.length; i++) {
        const fieldValue = {
            entryID,
            fieldID: fieldIDs[i],
            value: values[i] || "" 
        };

        const { error } = await supabase.from("FieldValues").insert(fieldValue);

        if (error) {
            console.error(`Error inserting FieldValue for fieldID ${fieldIDs[i]}:`, error.message);
        } else {
            console.log(`Successfully inserted FieldValue for fieldID ${fieldIDs[i]}:`, fieldValue);
        }
    }
};



export const createPersonnelEntry = async (personName: string, salary: string, totalCost: string, justification: string, personMonths: string) => {
    const categoryID = 1; 
    const entryID = await createCategoryEntry(categoryID);
    if (!entryID) return;

    const values = [personName, justification, totalCost, salary, personMonths];

    await insertFieldValues(entryID, values);

};
