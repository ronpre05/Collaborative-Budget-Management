import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, vi, beforeEach, expect } from "vitest";
import "@testing-library/jest-dom";
import GenericForm from "../src/pages/GenericForm";

// Mock the createEntry function to simulate database interaction
vi.mock("../src/database", () => ({
  createEntry: vi.fn(() => Promise.resolve())
}));

const mockCategory = {
  name: "Personnel",
  fields: [
    {
      name: "Role",
      type: "String",
      entryvisible: true,
      displayvisible: true,
      prefix: "",
      value: "",
      postfix: ""
    },
    {
      name: "Hours",
      type: "Int",
      entryvisible: true,
      displayvisible: true,
      prefix: "",
      value: "",
      postfix: ""
    },
    {
      name: "Rate",
      type: "Float",
      entryvisible: false,
      displayvisible: true,
      prefix: "",
      value: "",
      postfix: ""
    }
  ],
  hassubentry: false,
  calculations: [],
  subentries: []
};

describe("GenericForm Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders only entryvisible fields", () => {
    render(<GenericForm category={mockCategory} readOnly={false} />);
    expect(screen.getByLabelText(/^\s*Role\s*:\s*$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^\s*Hours\s*:\s*$/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/^\s*Rate\s*:\s*$/i)).not.toBeInTheDocument();
  });

  it("updates input values correctly when not readOnly", () => {
    render(<GenericForm category={mockCategory} readOnly={false} />);
    const roleInput = screen.getByLabelText(/^\s*Role\s*:\s*$/i);
    fireEvent.change(roleInput, { target: { value: "Researcher" } });
    expect(roleInput).toHaveValue("Researcher");
  });

  it("does not render any fields when readOnly is true", () => {
    render(<GenericForm category={mockCategory} readOnly={true} />);
    expect(screen.queryByLabelText(/^\s*Role\s*:\s*$/i)).not.toBeInTheDocument();
    expect(screen.queryByText("Add Item")).not.toBeInTheDocument();
  });

  it("alerts if a required field is missing on submit", () => {
    window.alert = vi.fn();
    render(<GenericForm category={mockCategory} readOnly={false} />);
    const form = screen.getByText("Add Item").closest("form")!;
    fireEvent.submit(form);
    expect(window.alert).toHaveBeenCalledWith("Please fill out the field: Role");
  });

  it("calls createEntry and shows success message when form is filled", async () => {
    const { createEntry } = await import("../src/database");

    render(<GenericForm category={mockCategory} readOnly={false} />);

    fireEvent.change(screen.getByLabelText(/^\s*Role\s*:\s*$/i), {
      target: { value: "Developer" }
    });
    fireEvent.change(screen.getByLabelText(/^\s*Hours\s*:\s*$/i), {
      target: { value: "40" }
    });

    const form = screen.getByText("Add Item").closest("form")!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(createEntry).toHaveBeenCalledWith("Personnel", {
        Role: "Developer",
        Hours: "40"
      }, mockCategory);
    });

    await waitFor(() => {
      expect(createEntry).toHaveBeenCalled();
    });
    
  });
});

