import { renderHook, act } from "@testing-library/react";
import useProductsFetch from "./useProductsFetch";

// Mock the fetch API
global.fetch = jest.fn();

describe("useProductsFetch", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return the correct initial state", () => {
        const { result } = renderHook(() => useProductsFetch());

        expect(result.current.data).toEqual([]);
        expect(result.current.loading).toBe(true);
        expect(result.current.error).toBeNull();
    });

    it("should fetch data successfully", async () => {
        const mockData = [{ id: 1, title: "Product 1" }];
        // Mock successful fetch response
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockData,
        });

        const { result } = renderHook(() => useProductsFetch());

        // Trigger the fetchData function
        await act(async () => {
            await result.current.fetchData();
        });

        expect(result.current.data).toEqual(mockData);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
    });

    it("should set error if fetch fails", async () => {
        // Mock a failed fetch response
        (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

        const { result } = renderHook(() => useProductsFetch());

        // Trigger the fetchData function
        await act(async () => {
            await result.current.fetchData();
        });

        expect(result.current.data).toEqual([]);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe("Oops! Something went wrong.");
    });

    it("should set error if response is not ok", async () => {
        // Mock a failed response (not OK status)
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            json: async () => [],
        });

        const { result } = renderHook(() => useProductsFetch());

        // Trigger the fetchData function
        await act(async () => {
            await result.current.fetchData();
        });

        expect(result.current.data).toEqual([]);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe("Oops! Something went wrong.");
    });

    it("should handle loading state properly", async () => {
        const mockData = [{ id: 1, title: "Product 1" }];
        // Mock successful fetch response
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockData,
        });

        const { result } = renderHook(() => useProductsFetch());

        expect(result.current.loading).toBe(true); // Initially loading is true

        // Trigger the fetchData function and wait for it to resolve
        await act(async () => {
            await result.current.fetchData();
        });

        expect(result.current.loading).toBe(false); // After fetching, loading should be false
    });

    it("should handle when the data is null", async () => {
        // Mock successful fetch response
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => null,
        });

        const { result } = renderHook(() => useProductsFetch());

        expect(result.current.loading).toBe(true); // Initially loading is true

        // Trigger the fetchData function and wait for it to resolve
        await act(async () => {
            await result.current.fetchData();
        });

        expect(result.current.loading).toBe(false); // After fetching, loading should be false
    });
});
