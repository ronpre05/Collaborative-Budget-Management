import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xybccoipttcvmdniwysj.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5YmNjb2lwdHRjdm1kbml3eXNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE5NDI3NjQsImV4cCI6MjA0NzUxODc2NH0.qft8IvKBxpEzW7Uh1D4uDdGafhHzbh7fWlfil7B5nKA'
export const supabase = createClient(supabaseUrl, supabaseKey)

const createProjectQuery = supabase
    .from('Project')
    .insert({templateID: 'PLACEHOLDER'});

const createUserInstitutionProjectQuery = supabase
    .from('UserInstitutionProject')
    .insert({userID : 'PLACEHOLDER', institutionID: 'PLACEHOLDER', roleID: 'PLACEHOLDER', projectID: 'PLACEHOLDER'});
