# [⬅️ Return Home](../software_manual.md)

# Table of Contents

- [Database](#database)
  - [ERD Diagram](#erd-diagram)
  - [Connection](#connection)
    - [Project API Keys](#project-api-keys)
  - [Schema Overview](#schema-overview)
  - [Data Entry](#project-data-entry)
    - [Steps for Data Entry](#steps-for-data-entry)
  - [Database Queries](#database-queries)

# Database

The database is the core data storage component of the system, managing both user and project data in their respective tables. It uses **PostgreSQL**, hosted on **Supabase**.

## ERD Diagram

An up-to-date copy of the ERD diagram for the database currently being hosted on Supabase can be found [here](../../ERDDiagram.md).

## Connection

The connection to the database is established once the website is launched, this can be found in [database.tsx](../../../../src/database.tsx). The system makes use of **Supabase's JavaScript Client** to allow the code to interact witht he database via REST APIs.

As seen in [database.tsx](../../../../src/database.tsx), connection to the database is made using the **Supabase Client**.

```ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xybccoipttcvmdniwysj.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5YmNjb2lwdHRjdm1kbml3eXNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE5NDI3NjQsImV4cCI6MjA0NzUxODc2NH0.qft8IvKBxpEzW7Uh1D4uDdGafhHzbh7fWlfil7B5nKA";

const supabase = createClient(supabaseUrl, supabaseKey);
```

### Project API Keys

As of **02/04/2025**, the following API keys are utilisied within the application to perform CRUD operations on the database.

> Project URL = "https://xybccoipttcvmdniwysj.supabase.co"

> Public Key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5YmNjb2lwdHRjdm1kbml3eXNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE5NDI3NjQsImV4cCI6MjA0NzUxODc2NH0.qft8IvKBxpEzW7Uh1D4uDdGafhHzbh7fWlfil7B5nKA"

## Schema Overview

Below is a list of all tables in the database, with a short description of what their purpose is and what data they store. For explanations on Primary/Foreign keys & Data Types, refer to the [ERD Diagram](#erd-diagram) section of the software manual.

| Table Name                 | Description                                                                                                 |
| -------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Users**                  | Stores all users who have created an account via Clerk. Each user can be identified by their unique userID. |
| **UserInstitutions**       | Stores the link between users and any institution they belong to.                                           |
| **UserInstitutionProject** | Stores the link between a user who has created a project and the institution they have created it for.      |
| **SubValues**              | Stores the values for a specified sub entry.                                                                |
| **SubEntries**             | Stores an entry made by a user for a given category which feautres sub entries.                             |
| **Roles**                  | Stores the roles that users can belong to within a project.                                                 |
| **Project**                | Stores a project, which can be identified by its unique projectID.                                          |
| **Invites**                | Stores all invitations for adding users to projects including: pending, accepted and rejected statues.      |
| **Institutions**           | Stores all the institutions that users/projects can belong to.                                              |
| **FieldValues**            | Stores the data for an entry into a field.                                                                  |
| **CategoryFields**         | Stores all fields that belong to each category.                                                             |
| **CategoryEntry**          | Stores an entry made by a user for a given category.                                                        |
| **Categories**             | Stores all the categories that exist within a template.                                                     |

## Project Data Entry

When users make data entries into a project, is it is important that the process below is follwed so it is entered
correctly in the appropriate tables.

### Steps for Data Entry

1. **Insert into `CategoryEntry`**  
   Insert a new row into the `CategoryEntry` table. You will need to specify the following:

   - `projectID`: The ID of the project.
   - `categoryID`: The ID of the category for which the entry is being created.

   This creates a new data entry for a specific category within the project.

2. **Insert into `FieldValues`**  
   Insert a new row into the `FieldValues` table. You will need to specify the following:

   - `CategoryEntry.EntryID`: Foreign key linking the data entry to the `CategoryEntry`.
   - `CategoryFields.fieldID`: Foreign key linking to the specific field within the category.

   This links the data entry to the category and field it belongs to.

3. **Repeat for all fields in the category**  
   For each field within the category, repeat **Step 2** to ensure all field values are stored.

To view the code which carries out these queries to insert data in the relevant tables for an entry, [see line 577 in **_database.tsx_**](../../../../src/database.tsx)

### Database Queries

The table below lists key database queries that can be found in [database.tsx](../../../../../src/database.tsx), as well as their purpose. These queries should be reused throughout the codebase to improve code reability for all developers.

| Query                             | Description                                                                                                                        |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| checkAndAddCategories             | Checks if the given categories exist in the database. If not, adds them and creates their associated fields                        |
| createCategoryFields              | Creates fields for a list of categories by inserting fields into the CategoryFields table                                          |
| getProjectName                    | Fetches the project name from the Project table using the stored projectID in localStorage                                         |
| createProjectQuery                | Creates a new project in the Project table and links it to the user and institution                                                |
| createUserInstitutionProjectQuery | Links a user to a project under a specific institution by inserting an entry into the UserInstitutionProject table                 |
| getInstitutionID                  | Retrieves the ID of an institution based on its name from the Institutions table                                                   |
| getUsersInstitutions              | Fetches a list of institutions associated with the logged-in user                                                                  |
| inviteUserToProject               | Sends an invitation to a user by inserting an entry into the Invites table                                                         |
| getSentInvites                    | Retrieves all invitations sent by the given user                                                                                   |
| getPendingInvites                 | Fetches all pending invitations for a user                                                                                         |
| acceptInvite                      | Accepts an invitation, adds the user to the project in UserInstitutionProject, and updates the invite status to "accepted"         |
| rejectInvite                      | Rejects an invitation by updating the invite status to "rejected"                                                                  |
| getUsersProjects                  | Fetches all projects associated with the logged-in user                                                                            |
| removeCollaborator                | Removes a user from a project by deleting their entry from the UserInstitutionProject table                                        |
| createCategoryEntry               | Creates a new category entry in the CategoryEntry table. If the category doesn't exist, it inserts into the Categories table first |
| insertFieldValues                 | Inserts values into the FieldValues table for a given entryID and categoryID. If a field doesn't exist, it creates it first        |
| createEntry                       | Uses 'createCategoryEntry' and 'insertFieldValues' to insert forms into the database                                               |
| createEntryWithSubEntry           | Creates an entry that contains a sub-entry and adds corresponding field values                                                     |
| addWithSubEntry                   | Handles inserting field values for an entry and its sub-entries, linking them together                                             |
| createSubEntry                    | Inserts a new sub-entry record and returns its ID                                                                                  |
| addToSubValues                    | Associates sub-entry IDs with value IDs in the SubValues table                                                                     |
| getSubEntriesForEntry             | Retrieves all sub-entries related to a given entry and their associated field values                                               |
| getFieldNameAndValue              | Fetches the field name and value for a given value ID                                                                              |
| getFieldName                      | Retrieves the field name corresponding to a given field ID                                                                         |
| getRoles                          | Fetches all available roles from the database                                                                                      |
| getCategoryID                     | Retrieves the category ID using category name and project ID                                                                       |
| getAllCategoryEntries             | Fetches all entry IDs for a given category                                                                                         |
| haveSubEntry                      | Checks whether an entry has sub-entries                                                                                            |
| getAllSubEntries                  | Retrieves all sub-entry IDs for a given entry                                                                                      |
| getValueIDsOfSubEntry             | Fetches value IDs associated with a sub-entry                                                                                      |
| getSubValue                       | Retrieves a value from a sub-entry based on field ID                                                                               |
| getFieldID                        | Retrieves a field ID using a category ID and field name                                                                            |
| getValue                          | Fetches a value for a given entry ID and field ID                                                                                  |
| getValueID                        | Retrieves the value ID for a given entry ID and field ID, creating a blank value if none exists                                    |
| createBlankValue                  | Inserts a blank field value of "0" if no value exists for an entry and field ID                                                    |
| updateIndividualField             | Updates a specific field value in FieldValues                                                                                      |
| getGlobalEntryID                  | Checks if a category has an entry, creating one if it doesn’t exist                                                                |
| createBlankEntry                  | Creates a new blank entry for a category in a project                                                                              |
| addInstitution                    | Adds an institution to Institutions and returns its ID                                                                             |
| checkExisitingInstitution         | Checks if an institution exists in Institutions and returns its ID if found                                                        |
| getInstitutions                   | Retrieves a list of institutions matching an input value                                                                           |
| addUserInstitution                | Links a user to an institution in UserInstitutions                                                                                 |
| getUserRoleInProject              | Fetches the role ID of a user for a given project                                                                                  |

## Clone Database

If you need to setup your own instance of the database on Supabase, you can copy the PostgreSQL table schema from [here](./sql_copy.md). This can then be ran as a PostgreSQl query in Supabase to generate the database used throughout the project.
