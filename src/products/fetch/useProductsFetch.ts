import { useState } from "react";

const useProductsFetch = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch("https://fakestoreapi.com/products");
            if (!response.ok) {
                setError("Oops! Something went wrong.");
            }
            const data = await response.json();
            setData(data || []);
        } catch (err: any) {
            setError("Oops! Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error, fetchData };
};

export default useProductsFetch;
