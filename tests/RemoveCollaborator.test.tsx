import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, vi, beforeEach, expect } from "vitest";
import "@testing-library/jest-dom";
import RemoveCollaborator from "../src/pages/RemoveCollaborator"; // update path if different
import { MemoryRouter } from "react-router-dom";

// Mock Supabase
const mockDelete = vi.fn(() => Promise.resolve({ error: null }));
const mockEq = vi.fn().mockReturnThis();
const mockSelect = vi.fn().mockReturnThis();
const mockFrom = vi.fn().mockReturnThis();

const fakeCollaborators = [
  {
    userID: 1,
    roleID: 2,
    Users: { firstName: "Alice", lastName: "Smith", email: "alice@example.com" },
    Roles: { roleName: "Collaborator" },
  },
  {
    userID: 2,
    roleID: 3,
    Users: { firstName: "Bob", lastName: "Johnson", email: "bob@example.com" },
    Roles: { roleName: "Viewer" },
  },
];

vi.mock("../src/database", () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: async () => ({ data: fakeCollaborators, error: null }),
      }),
      delete: () => ({
        eq: () => ({
          eq: mockDelete,
        }),
      }),
    }),
  },
}));

describe("RemoveCollaborator Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("displays collaborators fetched from supabase", async () => {
    render(
      <MemoryRouter>
        <RemoveCollaborator projectID={123} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Alice Smith")).toBeInTheDocument();
      expect(screen.getByText("Bob Johnson")).toBeInTheDocument();
    });

    expect(screen.getAllByText("Remove")).toHaveLength(2);
  });

  it("removes a collaborator when Remove is clicked", async () => {
    render(
      <MemoryRouter>
        <RemoveCollaborator projectID={123} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Alice Smith")).toBeInTheDocument();
    });

    const removeButtons = screen.getAllByText("Remove");
    fireEvent.click(removeButtons[0]);

    await waitFor(() => {
      expect(mockDelete).toHaveBeenCalled();
    });
  });
});
