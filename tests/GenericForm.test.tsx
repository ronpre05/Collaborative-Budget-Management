import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, vi, beforeEach, expect } from "vitest";
import "@testing-library/jest-dom";
import GenericForm from "../src/pages/GenericForm";
import { cleanString } from "../src/expressionParser";

//Mock the createEntry function to simulate successful database interaction
vi.mock("../src/database", () => ({
  createEntry: vi.fn(() => Promise.resolve())
}));

//Mocked category data that matches the expected CategoryType structure
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
      entryvisible: false, // Hidden field
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
  //Reset all mocks before each test to avoid test interference
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders only entryvisible fields", () => {
    //Render the component
    render(<GenericForm category={mockCategory} readOnly={false} />);
    
    //Expect visible fields ("Role" and "Hours") to appear
    expect(screen.getByLabelText(`${cleanString("Role")}:`)).toBeInTheDocument();
    expect(screen.getByLabelText(`${cleanString("Hours")}:`)).toBeInTheDocument();

    //Hidden fields ("Rate") should NOT appear
    expect(screen.queryByLabelText(`${cleanString("Rate")}:`)).not.toBeInTheDocument();
  });

  it("updates input values correctly when not readOnly", () => {
    //Render the form
    render(<GenericForm category={mockCategory} readOnly={false} />);

    //Simulate typing into the "Role" input field
    const roleInput = screen.getByLabelText(`${cleanString("Role")}:`);
    fireEvent.change(roleInput, { target: { value: "Researcher" } });

    //Check that the input value updated correctly
    expect(roleInput).toHaveValue("Researcher");
  });

  it("does not render any fields when readOnly is true", () => {
    //Render the form in readOnly mode
    render(<GenericForm category={mockCategory} readOnly={true} />);

    //No fields or "Add Item" button should be visible
    expect(screen.queryByLabelText(`${cleanString("Role")}:`)).not.toBeInTheDocument();
    expect(screen.queryByText("Add Item")).not.toBeInTheDocument();
  });

  it("alerts if a required field is missing on submit", () => {
    //Mock window.alert to catch alerts
    window.alert = vi.fn();

    render(<GenericForm category={mockCategory} readOnly={false} />);

    //Try to submit the form without filling any inputs
    const form = screen.getByText("Add Item").closest("form")!;
    fireEvent.submit(form);

    //Expect an alert about missing "Role" field
    expect(window.alert).toHaveBeenCalledWith("Please fill out the field: Role");
  });

  it("calls createEntry and shows success message when form is filled", async () => {
    //Import the mocked createEntry function
    const { createEntry } = await import("../src/database");

    render(<GenericForm category={mockCategory} readOnly={false} />);

    //Fill out all required fields
    fireEvent.change(screen.getByLabelText(`${cleanString("Role")}:`), {
      target: { value: "Developer" }
    });
    fireEvent.change(screen.getByLabelText(`${cleanString("Hours")}:`), {
      target: { value: "40" }
    });

    //Submit the form
    const form = screen.getByText("Add Item").closest("form")!;
    fireEvent.submit(form);

    //Wait for createEntry to be called with the correct data
    await waitFor(() => {
      expect(createEntry).toHaveBeenCalledWith("Personnel", {
        Role: "Developer",
        Hours: "40"
      });
    });

    //Confirm the success message appears after adding the entry
    expect(await screen.findByText("Entry successfully added!")).toBeInTheDocument();
  });
});
