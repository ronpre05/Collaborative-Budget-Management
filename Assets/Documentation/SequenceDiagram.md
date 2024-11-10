
# UML Sequence Diagram for Project Management Workflow

This sequence diagram illustrates the workflow for managing a project within the collaborative budget management system. The coordinator, represented as the primary user, performs various actions to set up and manage project elements, while the system and database components handle data processing and storage.

### Participants

- **Coordinator**: The primary user who creates and manages the project, including tasks like setting up metadata, inviting partners, and handling budget approvals.
- **System**: The application interface responsible for facilitating user interactions, processing requests, and communicating with the database.
- **Database**: The storage component that manages data, confirming actions, and retrieving details as requested by the system.

### Workflow Overview

The workflow begins with the coordinator creating a project, followed by defining essential metadata and inviting partners. The coordinator can add budget categories and enter specific costs (such as personnel or travel expenses) as part of the project setup. 

Budget-related actions involve reviewing and approving/rejecting costs. The system retrieves and updates data in the database as directed by the coordinator, ensuring that all project modifications are tracked and confirmed. Towards the end, the coordinator has the flexibility to add additional metadata, allowing for adaptability and growth within the project’s data structure.

### Key Points

- Each interaction between the **Coordinator**, **System**, and **Database** maintains data integrity by ensuring that each action is confirmed and stored.
- The coordinator has complete control over project management tasks, from inviting partners to managing budget approvals and entering new information.
- The **Add Additional Metadata** step offers adaptability by allowing new project details to be included at any stage, accommodating evolving requirements.


![Project Workflow Diagram](Assets/sequencediagram.png)


---

