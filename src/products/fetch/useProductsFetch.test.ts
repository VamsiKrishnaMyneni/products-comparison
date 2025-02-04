import { renderHook, act } from "@testing-library/react";
import useProductsFetch from "./useProductsFetch"; // Adjust the path as needed

// Mock product data
const mockProducts = [
    { id: 1, title: "Product 1", price: 100 },
    { id: 2, title: "Product 2", price: 200 }
];

describe("useProductsFetch Hook", () => {
    beforeEach(() => {
        jest.spyOn(global, "fetch"); // Mock fetch
    });

    afterEach(() => {
        jest.restoreAllMocks(); // Restore fetch after each test
    });

    test("should fetch and return products data", async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue(mockProducts),
        });

        const { result } = renderHook(() => useProductsFetch());

        // Initially, loading should be true
        expect(result.current.loading).toBe(true);

        // Wait for fetch to complete
        await act(async () => { result.current.fetchData() });

        // Check final state
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
        expect(result.current.data).toEqual([{
            "id": 1,
            "price": 100,
            "title": "Product 1",
        }, {
            "id": 2,
            "price": 200,
            "title": "Product 2",
        }]);
    });

    test("should handle API errors", async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: false,
            json: jest.fn(),
        });

        const { result } = renderHook(() => useProductsFetch());

        await act(async () => { result.current.fetchData() });

        expect(result.current.loading).toBe(false);
        expect(result.current.data).toEqual([]);
        expect(result.current.error).toBe("Oops! Something went wrong.");
    });

    test("should handle network errors", async () => {
        (global.fetch as jest.Mock).mockRejectedValue(new Error("Network Error"));

        const { result } = renderHook(() => useProductsFetch());

        await act(async () => { result.current.fetchData() });

        expect(result.current.loading).toBe(false);
        expect(result.current.data).toEqual([]);
        expect(result.current.error).toBe("Oops! Something went wrong.");
    });

    test("should allow manual re-fetching with refetch", async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValue(mockProducts),
        });

        const { result } = renderHook(() => useProductsFetch());

        await act(async () => { result.current.fetchData() });

        // Mock new response for refetch
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValue([{ id: 3, title: "Product 3", price: 300 }]),
        });

        await act(async () => { result.current.fetchData() });

        // Check updated data
        expect(result.current.data).toEqual([{
            "id": 3,
            "price": 300,
            "title": "Product 3",
        }]);
    });
});
