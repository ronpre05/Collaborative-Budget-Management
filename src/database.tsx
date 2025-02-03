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

//