import React, { useEffect } from "react"
import { render, screen, waitFor, } from "@testing-library/react";
import { describe, it, vi, beforeEach, expect } from "vitest";
import "@testing-library/jest-dom";
import Projects from "../src/pages/Projects";
import { MemoryRouter } from "react-router-dom";

// Mock fetching projects
vi.mock("../src/fetchProjects", () => ({
  __esModule: true,
  default: ({ onProjectsFetched }: any) => {
    useEffect(() => {
      onProjectsFetched([
        {
          Project: {
            projectID: 1,
            projectName: "Project Test",
            projectAcronym: "PT",
          },
        },
      ]);
    }, []);
    return null;
  },
}));

describe("Projects Component", () => {
  beforeEach(() => {
    // Mock the userID
    localStorage.setItem("userID", "123");
  });

  it("displays the correct project name in ui card", async () => {
    render(
      <MemoryRouter>
        <Projects />
      </MemoryRouter>
    );

    // Wait for the project name to appear
    await waitFor(() => {
      expect(
      screen.getByText("Project Test")).toBeInTheDocument();
    });
  });

  it("displays the correct project acronym in ui card", async () => {
    render(
      <MemoryRouter>
        <Projects />
      </MemoryRouter>
    );

    // Wait for the project name to appear
    await waitFor(() => {
      expect(
      screen.getByText("PT")).toBeInTheDocument();
    });
  });
});
