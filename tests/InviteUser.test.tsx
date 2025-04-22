import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, vi, expect, beforeEach } from "vitest";
import "@testing-library/jest-dom";
import InviteUser from "../src/pages/InviteUser";
import { MemoryRouter } from "react-router-dom";

// Mock the database functions
vi.mock("../src/database", () => ({
  getRoles: vi.fn(() => 
    Promise.resolve([
      { roleID: 1, roleName: "Admin" },
      { roleID: 2, roleName: "Institution Lead" },
    ])
  ),
  inviteUserToProject: vi.fn(() => Promise.resolve(true)),
}));

describe("InviteUser Component", () => {
  const mockProjectID = 123;

  beforeEach(() => {
    // Clear mocks and local state
    vi.clearAllMocks();
  });

  it("renders input, select, and button", async () => {
    render(
      <MemoryRouter>
        <InviteUser projectID={mockProjectID} />
      </MemoryRouter>
    );

    // Wait for roles to be loaded and displayed
    await waitFor(() => {
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    expect(screen.getByPlaceholderText("Enter user email")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Send Invite" })).toBeInTheDocument();
  });

  it("displays roles fetched from the database", async () => {
    render(
      <MemoryRouter>
        <InviteUser projectID={mockProjectID} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Admin")).toBeInTheDocument();
      expect(screen.getByText("Institution Lead")).toBeInTheDocument();
    });
  });

  it("alerts when trying to invite without email", async () => {
    window.alert = vi.fn();

    render(
      <MemoryRouter>
        <InviteUser projectID={mockProjectID} />
      </MemoryRouter>
    );

    const inviteButton = screen.getByRole("button", { name: "Send Invite" });
    fireEvent.click(inviteButton);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Please enter an email.");
    });
  });

  it("calls inviteUserToProject with correct values", async () => {
    window.alert = vi.fn();

    const { getByPlaceholderText, getByRole } = render(
      <MemoryRouter>
        <InviteUser projectID={mockProjectID} />
      </MemoryRouter>
    );

    const emailInput = getByPlaceholderText("Enter user email");
    const inviteButton = getByRole("button", { name: "Send Invite" });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    // Wait for roles to load
    await waitFor(() => expect(screen.getByRole("combobox")).toBeInTheDocument());

    fireEvent.click(inviteButton);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("User invited successfully!");
    });
  });
});
