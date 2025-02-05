import { useState, useEffect } from 'react';
import useProductsFetch from './fetch/useProductsFetch';
import './productsComparision.css'
import DataGrid from '../datagrid';

function ProductsComparision() {
    const { data, loading, error, fetchData } = useProductsFetch();
    const [selectedRows, setSelectedRows] = useState<any[]>([]);

    useEffect(() => {
        fetchData && fetchData();
    }, []);

    const handleRowSelect = (row: any) => {
        setSelectedRows((prevSelectedRows) => {
            if (prevSelectedRows.find((selectedRow) => selectedRow.id === row.id)) {
                return prevSelectedRows.filter((selectedRow) => selectedRow.id !== row.id);
            } else {
                return [...prevSelectedRows, row];
            }
        });
    };

    const getValue = (row: any, key: any) => {
        return key.split(".").reduce((acc: any, val: any) => acc[val], row) || null;
    };

    // Get the difference in values between selected rows for comparison
    // Get the difference in values between selected rows for comparison within the same category
    const getComparisonDifference = (columnKey: string) => {
        if (selectedRows.length < 2) return null;

        // Group selected products by category
        const groupedByCategory = selectedRows.reduce((acc: any, row: any) => {
            const category = row.category;
            if (!acc[category]) acc[category] = [];
            acc[category].push(row);
            return acc;
        }, {});

        const differences: any = {};
        const comparisonKeys = ['rating.rate', 'rating.count', 'price'];


        Object.keys(groupedByCategory).forEach((category) => {
            const categoryProducts = groupedByCategory[category];

            if (categoryProducts.length > 1) {
                const values = categoryProducts.map((row: any) => comparisonKeys.includes(columnKey) && getValue(row, columnKey));
                const min = Math.min(...values);
                const max = Math.max(...values);

                if (min !== max) {
                    differences[category] = { min, max };
                }
            }
        });

        return differences;
    };



    const getCellStyle = (columnKey: string, value: any, category: string) => {
        if (selectedRows.length < 2) return {};

        const differences = getComparisonDifference(columnKey);
        if (!differences || !differences[category]) return {};

        const { min, max } = differences[category];

        return {
            backgroundColor: value === max ? "#d9ffd9" : value === min ? "#ffd2d2" : "",
            fontWeight: value === max || value === min ? "bold" : "normal",
        };
    };



    // Usage example
    const columns = [
        {
            label: "", key: "", width: 10, render: (rowData: any) => {
                return <input type="checkbox" className='product-select' onChange={() => handleRowSelect(rowData)} />
            }
        },
        {
            label: "Image", key: "image", width: 40, render: (rowData: any) => {
                return <img src={rowData.image} alt={rowData.title} className="product-image" />
            }
        },
        { label: "Title", key: "title", width: 180, render: (rowData: any) => <div className="product-title" title={rowData.title}>{rowData.title}</div> },
        { label: "Price", key: "price", width: 40, sort: true },
        {
            label: "Rating", key: "rating.rate", width: 70, sort: true, render: (rowData: any) => <><div className="star-rating" style={{ "--rating": `${rowData.rating.rate}` } as React.CSSProperties} aria-label="Rating of this product is 2.3 out of 5."></div>
                <div className='ratings-count'>{rowData.rating.count} ratings</div></>
        },
        {
            label: "Description", key: "description", width: 200, render: (rowData: any) => <div className="product-description" title={rowData.description}>
                {rowData.description.length > 100 ? `${rowData.description.slice(0, 100)}...` : rowData.description} </div>
        },
        { label: "Category", key: "category", width: 80 }
    ];


    return (
        <>
            {(loading || error) && (<div className='no-data-container'>
                {loading && <p>Loading...</p>}
                {error && <><h2>{error}</h2>
                    <button className='btn-refresh' onClick={() => window.location.reload()}>Try again</button></>}
            </div>)
            }
            {
                <div className='products-container'>
                    <h2>Products Comparison</h2>
                    <DataGrid data={data} columns={columns} cellStyles={getCellStyle} />
                </div>
            }
        </>
    )
}
export default ProductsComparision;
