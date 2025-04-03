# Software Manual TODO:

- [x] Build instructions (clone, run, test)
- [x] Coding/Maintainbaility conventions
- [x] Links to further documentation
- [x] Introduction
- [x] Definitions of project specific teminology and jargon
- [ ] Feedback on project scope/goals
- [ ] Proof read tomorrow

# Software Manual

## Table of Contents

- [User Authentication](./pages/user_authentication_manual.md)
- [Projects](./pages/projects_manual.md)
- [Data Display](./pages/data_display_manual.md)
- [Database](./pages/database_manual.md)
- [Templates](./pages/template_manual.md)

---

## Introduction

Welcome to the **Collaborative Budget Management Software Manual**. This is a guide fo developers working on the system, providing an overview of the architecture, core features and best practices for development and maintainability.

### Project Goal

The goal of the software is to provide an efficient and scalable budget management system which allows users to:

- Create and manage budgets for pojects
- Invite project collaborators to projects to enter/view budget data
- View budget breakdowns for projects
- Allow for projects to be dynamically created based on the **project template** they are using

### Project Scope

The system is a web-based application built using, **React, TypeScript, Supabase, Shadcn and Clerk** supporting:

- Multi-user access with role-based permissions
- Dynamic project creation using custom-made JSON templates
- A flexible database schema that supports any properly structured template

## Terminology

Within this software manual, specific teminology to the project may be used frequently. This section defines these key terms to ensure clarity and consistency for all developers working on the system.

- **Project Template** - A JSON-based structure defining the categories, fields, calculations.
- **Principal Investigator (PI)** - The lead responsible for overseeing the project. By default, this is the project creator.
- **Institution Lead** - A leader within an institution, managing project-related activites and users from their institution.
- **Institution Collaborator** - A user working on the project under a specific institution.

## Get Started

### Build Instructions

To start developing, following these steps to set up the project environment and build the application locally:

1. **Clone the Repository**

   ```bash
   git clone https://projects.cs.nott.ac.uk/comp2002/2024-2025/team45_project.git
   cd team45_project
   ```

2. **Install Dependencies**

   Ensure that you have [Node.js](https://nodejs.org/en/download) and npm installed. Then run, this command to instal the required packages:

   ```bash
   npm install
   ```

3. **Run the Development Serrver**

   Start the development server by running:

   ```bash
   npm run dev
   ```

   This will launch the application at `http://localhost:5173/`.

4. **Run Tests**

   To run the unit tests and ensure everything is working correctly, run the command:

   ```bash
   npm run test
   ```

### Coding Conventions

Coding conventions that must be followed when developing this project can be found [here](../../../Documentation/CodingConventions.md).

### Git Conventions

Git conventions that must be followed when developing this project can be found [here](../../../Documentation/GitStrategy.md).

### Further Documentation

To gain a deeper understanding of different sections of the project, read more of the software manual [here](#table-of-contents).

Any further documentation including: prototypes, requirements and UML diagrams can be found [here](../../../Documentation/).
