import React from "react"
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, vi, expect } from "vitest";
import "@testing-library/jest-dom";
import DynamicBudgetForm from "../src/pages/DynamicBudgetForm";
import { MemoryRouter } from "react-router-dom";
import template from "../template1.json";
import { TemplateData } from "../src/types";
import { getTemplate } from "../src/newTemplateParser";
import { cleanString } from "../src/expressionParser";

describe("DynamicBudgetForm Component", () => {
    // Mock getting category name,
    const templateData : TemplateData = getTemplate(template);
    const mockGetCategoryName = vi.fn();

    it("displays the correct category names from template", async () => {
        render(
            <MemoryRouter>
                <DynamicBudgetForm getCategoryName={mockGetCategoryName} readOnly={false} />
            </MemoryRouter>
        );

        // Check for category tabs based on template
        templateData.categories.forEach((category) => {
            expect(screen.getByText(cleanString(category.name))).toBeInTheDocument();
        });
    });

    
    it("displays the correct fields for the selected category", async () => {
        render(
          <MemoryRouter>
            <DynamicBudgetForm getCategoryName={mockGetCategoryName} readOnly={false} />
          </MemoryRouter>
        );
    
    // Loop through all categories
    for (const category of templateData.categories) {
        // Change category, by clicking on its name
        const categoryTab = screen.getByText(cleanString(category.name));
        fireEvent.click(categoryTab);
  
        // Wait for the category to load
        await waitFor(() => {
            // Loop through all fields in the current category
            category.fields.forEach((field) => {
                if (field.entryvisible) {
                // Check that fields with entryVisible true are in the document
                expect(screen.getByLabelText(cleanString(field.name + ":"))).toBeInTheDocument();
                } else {
                // Ensure fields with entryVisible false are not in the document
                expect(screen.queryByLabelText(cleanString(field.name))).not.toBeInTheDocument();
            }
        });
    });
    }
});
});