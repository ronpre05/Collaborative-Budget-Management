# Collaborative Budget Management

A web application for planning research project budgets across several institutions. A principal investigator creates a project from a funding template, invites collaborators from partner institutions, and each party enters and reviews its own costs.

Built by a team of eight over an academic year using an agile process: James Burge, Tom Clarkson, Alexander Nadim, Kartik Kumar, Ioannis Eliades, Jamie Holt, Rahy Premji and Ron Prekopuca.

## Features

- **Template-driven projects.** Budget categories, fields and calculations are defined in JSON templates (`template-uk.json`, `template-Horizon-RIA.json`). Forms and tables are generated from the template, so supporting a new funder means writing a template rather than new code.
- **Expression parsing.** Calculated fields are defined as expressions in the template and evaluated by a custom parser.
- **Role-based access.** Principal investigators, institution leads and institution collaborators each see and edit only what their role allows.
- **Invitations.** A principal investigator invites users to a project; invitees accept or decline and choose their institution.
- **Project locking.** A principal investigator can lock a project to freeze its budget.

## Tech stack

React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Clerk (authentication), Supabase (PostgreSQL database), Vitest and React Testing Library.

## My contribution

- **Authentication and access control:** the sign-up and login screens with Clerk, the roles table, and restricting routes and form fields by role (for example, read-only budget access for institutions).
- **Collaborator management:** inviting users to a project, the invitations screen for accepting or declining with institution selection, removing collaborators, and limiting these actions to the principal investigator.
- **Project locking** for the principal investigator.
- **Tests** for the invitation, invite-user, project view and generic form components.
- **Documentation:** the user authentication section of the software manual.

## Getting started

Requires [Node.js](https://nodejs.org/en/download) and npm.

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173/`. It needs a Clerk application and a Supabase project. Copy `.env.example` to `.env` and fill in your own keys. The database schema is described in the [database manual](./Assets/Documentation/Manuals/Software/pages/database_manual.md).

Run the tests with:

```bash
npm run test
```

## Documentation

- [Software manual](./Assets/Documentation/Manuals/Software/software_manual.md): architecture, templates, database and authentication
- [Design documents](./Assets/Documentation/): user stories, use case, sequence and entity-relationship diagrams, and prototypes
