# [Return Home](../software_manual.md)

# Table of Contents

- [Database](#database)
  - [ERD Diagram](#erd-diagram)
  - [Connection](#connection)
    - [Project API Keys](#project-api-keys)
  - [Schema Overview](#schema-overview)
  - [Data Entry](#data-entry)
    - [Steps for Data Entry](#steps-for-data-entry)

# Database

The database is the core data storage component of the system, managing both user and project data in their respective tables. It uses **PostgreSQL**, hosted on **Supabase**.

## ERD Diagram

An up-to-date copy of the ERD diagram for the database currently being hosted on Supabase can be found [here](../../ERDDiagram.md).

## Connection

The connection to the database is established once the website is launched, this can be found in [main.tsx](../../../../src/main.tsx). The system makes use of **Supabase's JavaScript Client** to allow the code to interact witht he database via REST APIs.

As seen in [main.tsx](../../../../src/main.tsx), connection to the database is made using the **Supabase Client**.

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
