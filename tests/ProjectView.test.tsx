import React from "react"
import { render, screen, waitFor, } from "@testing-library/react";
import { describe, it, vi, beforeEach, expect } from "vitest";
import "@testing-library/jest-dom";
import ProjectView from "../src/pages/ProjectView";
import { MemoryRouter } from "react-router-dom";

// Mock the database functions

vi.mock("../src/database", () => ({
  getProjectName: vi.fn(() => Promise.resolve("Test Project")),
  getUserRoleInProject: vi.fn(() => Promise.resolve(2)),
  getCategoryID: vi.fn(() => Promise.resolve(1)),
  getAllCategoryEntries: vi.fn(() => Promise.resolve([101, 102])),
  getFieldID: vi.fn(() => Promise.resolve(1)),
  getValue: vi.fn(() => Promise.resolve(1)),
  getValueID: vi.fn(() => Promise.resolve(1)),
  updateIndividualField: vi.fn(() => Promise.resolve(1)),

  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockResolvedValue({ data: [{ entryID: 101 }, { entryID: 102 }], error: null }),
  },
}));

describe("ProjectView Component", () => {
  beforeEach(() => {
    // Mock the project ID
    localStorage.setItem("projectID", "123");
  });

  it("displays the correct template name", async () => {
    render(
      <MemoryRouter>
        <ProjectView />
      </MemoryRouter>
    );

    // Wait for the template name to appear
    await waitFor(() => {
      expect(
      screen.getByText("Horizon RIA - Budget Management")).toBeInTheDocument();
    });
  });

  it("displays the correct project name", async () => {
    render(
      <MemoryRouter>
        <ProjectView />
      </MemoryRouter>
    );

    // Wait for the project name to appear in h1
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Test Project" })).toBeInTheDocument();
    });
  });
});
