import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, vi, beforeEach, expect } from "vitest";
import "@testing-library/jest-dom";
import Invitations from "../src/pages/Invitations";

// Mock database functions
vi.mock("../src/database", () => ({
  getUsersInstitutions: vi.fn(() => Promise.resolve(["Institution A", "Institution B"])),
  getRoles: vi.fn(() => Promise.resolve([{ roleID: 1, roleName: "Admin" }])),
  getPendingInvites: vi.fn(() => Promise.resolve([])),
  getSentInvites: vi.fn(() => Promise.resolve([])),
  getInstitutionID: vi.fn((name: string) => Promise.resolve(name === "Institution A" ? 1 : null)),
  getProjectNameFromID: vi.fn((id: number) => Promise.resolve(`Project ${id}`)),
  acceptInvite: vi.fn(() => Promise.resolve(true)),
  rejectInvite: vi.fn(() => Promise.resolve(true)),
}));

const mockInvites = [
  { invitedID: 1, projectID: 101, roleID: 1 },
];

const mockSentInvites = [
  { invitedID: 2, projectID: 102, roleID: 1, email: "test@example.com", status: "Pending" },
];

describe("Invitations Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders pending and sent invites", async () => {
    const { rerender } = render(
      <Invitations
        userEmail="user@example.com"
        userID={1}
        invitations={mockInvites}
      />
    );
  
    await waitFor(() => {
      expect(screen.getByText(/Pending Invitations/i)).toBeInTheDocument();
      expect(screen.getByText(/Sent Invitations/i)).toBeInTheDocument();
      
      
      
    });
  
    rerender(
      <Invitations
        userEmail="user@example.com"
        userID={1}
        invitations={[]}
      />
    );
  
    await waitFor(() => {
      expect(screen.getByText("No pending invites.")).toBeInTheDocument();
      expect(screen.getByText("No invites sent.")).toBeInTheDocument();
    });
  });
  

  it("requires institution selection before accepting", async () => {
    window.alert = vi.fn();

    render(
      <Invitations
        userEmail="user@example.com"
        userID={1}
        invitations={mockInvites}
      />
    );

    await screen.findByText("Select Institution:");
    fireEvent.click(screen.getByText("Accept"));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Please select an institution.");
    });
  });

  it("accepts an invite after selecting a valid institution", async () => {
    window.alert = vi.fn();

    render(
      <Invitations
        userEmail="user@example.com"
        userID={1}
        invitations={mockInvites}
      />
    );

    const select = await screen.findByRole("combobox");
    fireEvent.change(select, { target: { value: "Institution A" } });

    fireEvent.click(screen.getByText("Accept"));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Invite accepted!");
    });
  });

  it("rejects an invite", async () => {
    window.alert = vi.fn();

    render(
      <Invitations
        userEmail="user@example.com"
        userID={1}
        invitations={mockInvites}
      />
    );

    fireEvent.click(await screen.findByText("Reject"));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Invite rejected.");
    });
  });
});
