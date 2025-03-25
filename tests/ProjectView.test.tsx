import React from "react"
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, vi, beforeEach } from "vitest";
import ProjectView from "../src/pages/ProjectView"; // Adjust the import path
import { MemoryRouter } from "react-router-dom";

// Mock the database functions
vi.mock("../database", () => ({
  getProjectName: vi.fn(() => Promise.resolve("Test Project")),
  getUserRoleInProject: vi.fn(() => Promise.resolve(2)), // Example role ID
}));

describe("ProjectView Component", () => {
  beforeEach(() => {
    localStorage.setItem("projectID", "123"); // Set a mock project ID
  });

  it("displays the correct project name", async () => {
    render(
      <MemoryRouter>
        <ProjectView />
      </MemoryRouter>
    );

    // Wait for the project name to appear
    await waitFor(() => expect(screen.getByText("Test Project")).toBeInTheDocument());
  });
});
