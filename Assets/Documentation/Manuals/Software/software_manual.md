# Software Manual

## Table of Contents

- [Projects](#projects)
  - [Project Creation](#project-creation)
  - [Project Dispaly](#project-display)
  - [Project View & Data Entry](#project-view-and-data-entry)
  - [Managing Collaborators](#managing-collaborators)
  - [Invitations](#sending-and-accepting-invitations)
  - [Summary](#summary-of-key-functions-and-files)

---

## Projects

The Projects section is a fundamental component of the system, enabling users to create, manage, and collaborate on projects within their institution. Users can define project metadata, assign roles, and send invitations to other collaborators. This section communicates with the backend database through Supabase’s JavaScript client for all project-related CRUD operations.

---

### Project Creation

Project creation is initiated from the `CreateProject.tsx` page. When a user creates a project, the following steps are performed:

#### 1. Institution Selection

Users select an institution from their associated list retrieved from the database using the `getUsersInstitutions()` function.

#### 2. Metadata Entry

Users input:

- **`projectName`**: A user-defined name for the project.
- **`projectAcronym`**: A short acronym for quick reference.

#### 3. Project Creation

The system calls `createProjectQuery()` with the selected institution ID and project details. A new row is inserted into the `Project` table.

If successful, the newly created `projectID` is stored in `localStorage` for use across other pages.

#### 4. Category Setup

The selected template is parsed to extract categories. These are inserted into the database via the `checkAndAddCategories()` function to ensure the correct structure for future data entry.

This entire flow is triggered when the user clicks the **Create Project** button.

---

### Project Display

On the `Projects.tsx` page, the system retrieves all projects linked to the user and displays them in a card-based UI. Each card includes:

- Project name
- Acronym
- Navigation button to the full project view

Routing is handled using React Router and links to the `/project-view` route.

---

### Project View and Data Entry

The `ProjectView.tsx` page allows users to view and interact with a project's budget and category entries. Depending on permissions, users may be in read-only mode or full-edit mode.

#### Interfaces Used

- **`DynamicBudgetForm.tsx`**  
  Provides a tab-based UI to navigate through each budget category.
- **`GenericForm.tsx`**  
  Dynamically generates input forms based on field definitions from the template file.

#### Data Entry Flow

1. The user selects a category tab.
2. All editable fields are rendered.
3. On submission:
   - Data is validated.
   - The `createEntry()` function is called to insert entries into the database.

Feedback is given to the user upon successful or failed submission.

---

### Managing Collaborators

Project collaboration is an integral feature of the system. Users can add or remove collaborators and assign them specific roles within a project.

#### Components Used

- **`InviteUser.tsx`**: Allows the project owner to send invitations to new members.
- **`ManageCollaborators.tsx`**: Displays and manages current collaborators and their roles.
- **`CollaboratorList.tsx`**: Shows a read-only list of collaborators, their emails, and assigned roles.

Collaborator data is fetched by querying the `UserInstitutionProject`, `Users`, and `Roles` tables using Supabase.

---

### Sending and Accepting Invitations

Invitations are handled through the `Invites` table in the database. This enables tracking of pending, accepted, and rejected invites.

#### Invitation Flow

1. The user enters the invitee's email and selects a role.
2. A new row is added to the `Invites` table with:
   - `invitedID`
   - `projectID`
   - `roleID`
   - `status = "pending"`

#### Managing Invites

- **`Invitations.tsx`** displays all pending and sent invitations.
- Users can:
  - Accept an invite: This creates a new record in the `UserInstitutionProject` table and updates the invite status to `"accepted"`.
  - Reject an invite: This updates the status to `"rejected"`.

The accepting user must also select an institution to associate with the project upon acceptance.

---

### Access Control and Roles

Each user in a project is associated with a role stored in the `Roles` table. When fetching collaborator info or rendering the UI, the system uses the user’s role to control visibility of editing tools and settings.

---

### Summary of Key Functions and Files

| Feature            | File/Function                               |
| ------------------ | ------------------------------------------- |
| Create Project     | `CreateProject.tsx`, `createProjectQuery()` |
| Fetch Institutions | `getUsersInstitutions()`                    |
| Add Categories     | `checkAndAddCategories()`                   |
| Project View UI    | `ProjectView.tsx`                           |
| Dynamic Form       | `DynamicBudgetForm.tsx`, `GenericForm.tsx`  |
| Data Entry         | `createEntry()`                             |
| Invite Users       | `InviteUser.tsx`, `Invitations.tsx`         |
| Manage Roles       | `ManageCollaborators.tsx`                   |
| Show Collaborators | `CollaboratorList.tsx`                      |

---

This Projects section handles everything from inception to collaboration, serving as the operational core of the system.
