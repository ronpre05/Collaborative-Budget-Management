import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, vi, beforeEach, expect } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProjectView from "../src/pages/ProjectView";
import "@testing-library/jest-dom";

// Mocks
vi.mock("../src/queryFunctions", () => ({
  getCategoryDataCatOnly: vi.fn(() => Promise.resolve([["Category 1", "Data"]])),
}));

vi.mock("../src/TemplateParser.tsx", () => ({
  getTemplateFromID: vi.fn(() =>
    Promise.resolve({
      templateID: 1,
      categories: [],
      structure: {},
    })
  ),
}));

vi.mock("../src/expressionParser", () => ({
  categoryCalculation: vi.fn(() => Promise.resolve()),
}));

vi.mock("../src/database", () => ({
  getProjectName: vi.fn(() => Promise.resolve("Test Project")),
  getUserRoleInProject: vi.fn(() => Promise.resolve(3)),
  fetchProjectLockStatus: vi.fn(() => Promise.resolve(false)),
  updateProjectLockStatus: vi.fn((_id, newStatus) => Promise.resolve(newStatus)),
  getCategoryID: vi.fn(() => Promise.resolve(42)),
}));

vi.mock("../src/pages/DynamicBudgetForm", () => ({
  __esModule: true,
  default: ({ getCategoryName }: any) => (
    <button onClick={() => getCategoryName("Category 1")}>Set Category</button>
  ),
}));

vi.mock("../src/pages/ManageCollaborators", () => ({
  __esModule: true,
  default: () => <div>Manage Collaborators Component</div>,
}));

vi.mock("../src/categoryDisplay", () => ({
  __esModule: true,
  default: ({ data }: any) => (
    <div data-testid="category-display">{JSON.stringify(data)}</div>
  ),
}));

describe("ProjectView Component", () => {
  beforeEach(() => {
    localStorage.setItem("projectID", "1");
    vi.clearAllMocks();
  });

  const renderComponent = (initialPath = "/project-view") => {
    render(
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/project-view/*" element={<ProjectView />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it("renders project name and user role", async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Test Project")).toBeInTheDocument();
    });

    expect(await screen.findByText("User Role: Project Investigator")).toBeInTheDocument();
  });

  it("displays the lock button for role 3 and toggles lock state", async () => {
    renderComponent();

    const lockButton = await screen.findByRole("button", { name: "Lock Project" });

    expect(lockButton).toBeInTheDocument();

    fireEvent.click(lockButton);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Unlock Project" })).toBeInTheDocument();
    });
  });

  it("calls category logic when category is set", async () => {
    renderComponent();

    const categoryButton = await screen.findByText("Set Category");
    fireEvent.click(categoryButton);

    await waitFor(() => {
      expect(screen.getByTestId("category-display")).toHaveTextContent("Category 1");
    });
  });

  it("renders Manage Collaborators on correct route", async () => {
    renderComponent("/project-view/manage-collaborators");

    expect(await screen.findByText("Manage Collaborators Component")).toBeInTheDocument();
  });

  it("does not render lock button for lower roles", async () => {
    vi.doMock("../src/database", async () => {
      return {
        getProjectName: vi.fn(() => Promise.resolve("Test Project")),
        getUserRoleInProject: vi.fn(() => Promise.resolve(1)), // Simulate low role
        fetchProjectLockStatus: vi.fn(() => Promise.resolve(false)),
        updateProjectLockStatus: vi.fn((_id, newStatus) => Promise.resolve(newStatus)),
        getCategoryID: vi.fn(() => Promise.resolve(42)),
      };
    });
  
    const { default: ProjectView } = await import("../src/pages/ProjectView");
  
    render(
      <MemoryRouter initialEntries={["/project-view"]}>
        <Routes>
          <Route path="/project-view/*" element={<ProjectView />} />
        </Routes>
      </MemoryRouter>
    );
  
    await waitFor(() => {
      expect(screen.queryByText("Lock Project")).not.toBeInTheDocument();
    });
  });
  
});
