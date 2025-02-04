import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DataGrid from "./DataGrid";

const mockColumns = [
    { key: "category", label: "Category", sort: true },
    { key: "title", label: "Title", sort: false },
    { key: "price", label: "Price", sort: true },
];

const mockData = [
    { category: "Electronics", title: "Laptop", price: 1000 },
    { category: "Electronics", title: "Smartphone", price: 800 },
    { category: "Furniture", title: "Table", price: 200 },
];

const mockRowClick = jest.fn();
const mockCellStyles = jest.fn(() => ({ backgroundColor: "lightgray" }));

describe("DataGrid Component", () => {
    test("renders the component with provided data", () => {
        render(<DataGrid columns={mockColumns} data={mockData} />);

        // Check if table headers are present
        expect(screen.getByText("Category")).toBeInTheDocument();
        expect(screen.getByText("Title")).toBeInTheDocument();
        expect(screen.getByText("Price")).toBeInTheDocument();

        // Check if rows are rendered
        expect(screen.getByText("Laptop")).toBeInTheDocument();
        expect(screen.getByText("Smartphone")).toBeInTheDocument();
        expect(screen.getByText("Table")).toBeInTheDocument();
    });

    test("applies cell styles correctly", () => {
        render(<DataGrid columns={mockColumns} data={mockData} cellStyles={mockCellStyles} />);

        // Ensure the cell styling function is called
        expect(mockCellStyles).toHaveBeenCalled();
    });

    test("sorts data in ascending and descending order", () => {
        render(<DataGrid columns={mockColumns} data={mockData} />);

        const priceHeader = screen.getByText("Price");

        // Click once to sort ascending
        fireEvent.click(priceHeader);
        expect(screen.getAllByRole("row")[1]).toHaveTextContent("Table");

        // Click again to sort descending
        fireEvent.click(priceHeader);
        expect(screen.getAllByRole("row")[1]).toHaveTextContent("Laptop");
    });

    test("triggers row click event", () => {
        render(<DataGrid columns={mockColumns} data={mockData} onRowClick={mockRowClick} />);

        const firstRow = screen.getAllByRole("row")[1]; // First row in tbody
        fireEvent.click(firstRow);

        expect(mockRowClick).toHaveBeenCalledWith(mockData[0]); // Should pass first row data
    });

    test("renders 'No rows to display' when data is empty", () => {
        render(<DataGrid columns={mockColumns} data={[]} />);

        expect(screen.getByText("No rows to display")).toBeInTheDocument();
    });

    test("applies category-based colors correctly", () => {
        render(<DataGrid columns={mockColumns} data={mockData} />);

        const rows = screen.getAllByRole("row");
        expect(rows[1]).toHaveClass("bg-white"); // Color should be applied
        expect(rows[2]).toHaveClass("bg-neutral-50"); // Color should be applied
    });
});
