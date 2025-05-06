import React from "react";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import { describe, it, vi, beforeEach, expect } from "vitest";
import "@testing-library/jest-dom";
import Invitations from "../src/pages/Invitations"; // Adjust path as needed
import { MemoryRouter } from "react-router-dom";
import { getPendingInvites, getSentInvites } from "../src/database";





// Mock the database functions
vi.mock("../src/database", () => ({
  getPendingInvites: vi.fn(() =>
    Promise.resolve([
      {
        invitedID: 1,
        projectID: 101,
        roleID: 1,
      },
    ])
  ),
  getSentInvites: vi.fn(() =>
    Promise.resolve([
      {
        invitedID: 2,
        projectID: 102,
        roleID: 2,
        email: "sent@example.com",
        status: "Pending",
      },
    ])
  ),
  acceptInvite: vi.fn(() => Promise.resolve(true)),
  rejectInvite: vi.fn(() => Promise.resolve(true)),
  getUsersInstitutions: vi.fn(() => Promise.resolve(["Institution A", "Institution B"])),
  getInstitutionID: vi.fn((name) =>
    name === "Institution A" ? Promise.resolve(1001) : Promise.resolve(null)
  ),
  getRoles: vi.fn(() =>
    Promise.resolve([
      { roleID: 1, roleName: "Admin" },
      { roleID: 2, roleName: "Researcher" },
    ])
  ),
}));

describe("Invitations Component", () => {
  const userEmail = "test@example.com";
  const userID = 123;

  beforeEach(() => {
    vi.clearAllMocks();
  });


  it("displays pending and sent invites", async () => {
    render(
      <MemoryRouter>
        <Invitations userEmail={userEmail} userID={userID} invitations={[]} />
      </MemoryRouter>
    );
  
    await waitFor(() => {
      expect(screen.getByText("Pending Invitations")).toBeInTheDocument();
    });
  
    const pendingInvites = screen.getByText("Pending Invitations").parentElement!;
    const inviteBlocks = within(pendingInvites).getAllByText((_, node) =>
      node?.textContent?.includes("Project ID: 101") ?? false
    );
  
    expect(inviteBlocks[0]).toHaveTextContent("Project ID: 101");
    expect(inviteBlocks[0]).toHaveTextContent("Role: Admin");
  
    const matchingElements = screen.getAllByText((_, node) =>
        node?.textContent?.includes("Invited sent@example.com to Project ID: 102") ?? false
    );
    expect(matchingElements.length).toBeGreaterThan(0);
  });
  

  

  it("shows alert if accepting without selecting institution", async () => {
    window.alert = vi.fn();

    render(
      <MemoryRouter>
        <Invitations userEmail={userEmail} userID={userID} invitations={[]} />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText("Accept"));

    fireEvent.click(screen.getByText("Accept"));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Please select an institution.");
    });
  });

  it("successfully accepts an invite", async () => {
    window.alert = vi.fn();

    render(
      <MemoryRouter>
        <Invitations userEmail={userEmail} userID={userID} invitations={[]} />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByRole("combobox"));

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "Institution A" },
    });

    fireEvent.click(screen.getByText("Accept"));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Invite accepted!");
    });
  });

  it("rejects an invite", async () => {
    window.alert = vi.fn();

    render(
      <MemoryRouter>
        <Invitations userEmail={userEmail} userID={userID} invitations={[]} />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText("Reject"));

    fireEvent.click(screen.getByText("Reject"));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Invite rejected.");
    });
  });

  it("renders with no invites", async () => {
    vi.mocked(getPendingInvites).mockResolvedValueOnce([]);
    vi.mocked(getSentInvites).mockResolvedValueOnce([]);

    render(
      <MemoryRouter>
        <Invitations userEmail={userEmail} userID={userID} invitations={[]} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("No pending invites.")).toBeInTheDocument();
      expect(screen.getByText("No invites sent.")).toBeInTheDocument();
    });
  });
});
