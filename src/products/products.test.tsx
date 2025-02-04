import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Products from "./Products";
import useProductsFetch from "./fetch/useProductsFetch";

// Mock API fetch hook
jest.mock("./fetch/useProductsFetch");

const mockProducts = [
    {
        id: 1,
        category: "Electronics",
        title: "Smartphone",
        price: 800,
        image: "phone.jpg",
        description: "A high-end smartphone",
        rating: { rate: 4.5, count: 120 }
    },
    {
        id: 2,
        category: "Electronics",
        title: "Laptop",
        price: 1200,
        image: "laptop.jpg",
        description: "A powerful laptop",
        rating: { rate: 4.8, count: 90 }
    },
    {
        id: 3,
        category: "Furniture",
        title: "Table",
        price: 150,
        image: "table.jpg",
        description: "A wooden table",
        rating: { rate: 3.9, count: 50 }
    }
];

describe("Products Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders loading state", () => {
        (useProductsFetch as jest.Mock).mockReturnValue({ data: [], loading: true, error: null });

        render(<Products />);
        expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    test("renders error state and retry button", async () => {
        (useProductsFetch as jest.Mock).mockReturnValue({ data: [], loading: false, error: "Failed to load data" });

        render(<Products />);
        expect(screen.getByText("Failed to load data")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Try again" })).toBeInTheDocument();
    });

    test("renders empty state message when no products are found", () => {
        (useProductsFetch as jest.Mock).mockReturnValue({ data: [], loading: false, error: null });

        render(<Products />);
        expect(screen.getByText("No rows to display")).toBeInTheDocument();
    });

    test("renders product list with correct data", () => {
        (useProductsFetch as jest.Mock).mockReturnValue({ data: mockProducts, loading: false, error: null });

        render(<Products />);

        expect(screen.getByText("Products Comparison")).toBeInTheDocument();
        expect(screen.getByText("Smartphone")).toBeInTheDocument();
        expect(screen.getByText("Laptop")).toBeInTheDocument();
        expect(screen.getByText("Table")).toBeInTheDocument();
    });

    test("allows selecting and unselecting products", () => {
        (useProductsFetch as jest.Mock).mockReturnValue({ data: mockProducts, loading: false, error: null });

        render(<Products />);

        const checkboxes = screen.getAllByRole("checkbox");

        // Select first two products
        fireEvent.click(checkboxes[0]);
        fireEvent.click(checkboxes[1]);

        expect(checkboxes[0]).toBeChecked();
        expect(checkboxes[1]).toBeChecked();

        // Unselect the first product
        fireEvent.click(checkboxes[0]);

        expect(checkboxes[0]).not.toBeChecked();
    });

    test("applies correct cell styling for selected products", () => {
        (useProductsFetch as jest.Mock).mockReturnValue({ data: mockProducts, loading: false, error: null });

        render(<Products />);

        const checkboxes = screen.getAllByRole("checkbox");
        fireEvent.click(checkboxes[0]); // Select Smartphone
        fireEvent.click(checkboxes[1]); // Select Laptop

        const smartphonePrice = screen.getByText("800");
        const laptopPrice = screen.getByText("1200");

        expect(smartphonePrice).toHaveStyle("background-color: #ffd2d2"); // Lower price
        expect(laptopPrice).toHaveStyle("background-color: #d9ffd9"); // Higher price
    });

    test("handles sorting correctly", async () => {
        (useProductsFetch as jest.Mock).mockReturnValue({ data: mockProducts, loading: false, error: null });

        render(<Products />);

        const priceHeader = screen.getByText("Price");

        // Click once for ascending order
        fireEvent.click(priceHeader);
        await waitFor(() => expect(screen.getAllByRole("row")[1]).toHaveTextContent("Table"));

        // Click again for descending order
        fireEvent.click(priceHeader);
        await waitFor(() => expect(screen.getAllByRole("row")[1]).toHaveTextContent("Laptop"));
    });

    test("renders category-based colors correctly", () => {
        (useProductsFetch as jest.Mock).mockReturnValue({ data: mockProducts, loading: false, error: null });

        render(<Products />);

        const rows = screen.getAllByRole("row");
        expect(rows[1]).toHaveClass("bg-white"); // Color should be applied
        expect(rows[2]).toHaveClass("bg-neutral-50"); // Color should be applied
    });
});
