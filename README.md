## Running Application

# Prerequisites

Before running the application, ensure you have:

Node.js installed (Download from Node.js official site) 
Node version 22.12.0(goood to have)

npm (comes with Node.js)
npm version 10.9.0(goood to have)

A code editor (e.g., Visual Studio Code)

# Steps to Run the App

1. Clone the Repository

If the React project is hosted on a repository (e.g., GitHub), clone it using:

git clone [<repository-url>](https://github.com/VamsiKrishnaMyneni/products-comparison.git)
 
2. Navigate to the Project Directory

Move into the cloned project folder:
cd products-comparison

3. Install Dependencies

Run the following command to install required dependencies:

npm install
  
4. Start the Development Server

Run the app in development mode:

npm start

This will launch the app at http://localhost:3000/.
 
5. Running Tests (If Applicable)

To execute test cases in the project:

npm test
  
6. Running Tests coverage (If Applicable)

To execute test coverage in the project:

npm run test:coverage
  




# `DataGrid` Component Documentation

## Overview
The `DataGrid` is a flexible and customizable table component for rendering tabular data in React. It provides support for sorting, custom cell rendering, and dynamic styling, among other features. It is highly reusable and can handle data updates and user interactions seamlessly.

---

## Table of Contents
- [Props](#props)
  - [Column Interface](#column-interface)
  - [DataGridProps Interface](#datagridprops-interface)
- [Features](#features)
  - [Sorting](#sorting)
  - [Dynamic Data Rendering](#dynamic-data-rendering)
  - [Custom Cell Styles](#custom-cell-styles)
  - [Row Click Handler](#row-click-handler)
  - [Table Responsiveness](#table-responsiveness)
- [Usage Example](#usage-example)
- [Customization](#customization)
  - [Column Width](#column-width)
  - [Cell Rendering](#cell-rendering)
  - [Sorting Customization](#sorting-customization)
- [Performance and Optimization](#performance-and-optimization)

---

## Props

### `Column` Interface

The `Column` interface defines the structure of each column in the grid. It supports customizable behavior such as sorting and rendering.

| Field     | Type                 | Description                                         |
|-----------|----------------------|-----------------------------------------------------|
| `key`     | `string`             | A unique identifier for the column. Used for accessing data and sorting. |
| `label`   | `string`             | The display name for the column header. |
| `width`   | `number` (optional)  | The width of the column in pixels. Defaults to `200` if not provided. |
| `sort`    | `boolean` (optional) | Indicates if the column is sortable. Defaults to `false` if not provided. |
| `render`  | `(row: T, value: any) => React.ReactNode` (optional) | A custom render function to format the cell content. |

### `DataGridProps` Interface

The `DataGridProps` interface defines the overall structure of the `DataGrid` component.

| Field         | Type                    | Description                                                                 |
|---------------|-------------------------|-----------------------------------------------------------------------------|
| `columns`     | `Column<T>[]`            | An array of `Column` objects defining the columns for the table.            |
| `data`        | `T[]`                    | The data to be displayed in the table, where `T` is a generic type for row data. |
| `height`      | `number` (optional)      | The height of the table in pixels. Defaults to `400`.                        |
| `onRowClick`  | `(row: T) => void` (optional) | A callback function triggered when a row is clicked.                         |
| `cellStyles`  | `(key: string, value: any, category: string) => React.CSSProperties` (optional) | A function to apply custom styles to individual cells. |

---

## Features

### Sorting

- Columns marked with `sort: true` can be clicked to sort the data.
- Sorting alternates between ascending and descending order when clicked.
- The current sorting state is tracked using `sortConfig`, which includes the `key` (column name) and `direction` (`asc` or `desc`).
  
### Dynamic Data Rendering

- The table dynamically renders data based on the provided `columns` and `data`.
- Each row is rendered based on the values from the `data` array, with each cell displaying the corresponding value or using a custom `render` function if provided.

### Custom Cell Styles

- The `cellStyles` prop allows users to define custom styles for each cell.
- The `cellStyles` function receives three arguments: the column key, the cell value, and the category (optional).
  
### Row Click Handler

- The `onRowClick` prop provides a callback that is triggered when a row is clicked.
- It passes the entire row data to the callback function for further handling.

### Table Responsiveness

- The table adjusts its width based on the sum of individual column widths.
- By default, the height of the table is `400px`, but it can be customized via the `height` prop.

---

## Usage Example

```tsx
<DataGrid
  columns={[{ label: "Select", key: "id", width: 10, render: (rowData: any) => {
                return <input type="checkbox" onChange={() => handleRowSelect(rowData)} />
     }},
    { key: 'age', label: 'Age', width: 100, sort: true },
    { key: 'email', label: 'Email', width: 200 },
  ]}
  data={[
    { name: 'John Doe', age: 30, email: 'john@example.com' },
    { name: 'Jane Smith', age: 25, email: 'jane@example.com' },
  ]}
  height={500}
  onRowClick={(row) => console.log(row)}
  cellStyles={(key, value) => ({
    color: value === 'John Doe' ? 'blue' : 'black'
  })}
/>
```

In the example:
- The table will render three columns: "Name", "Age", and "Email".
- The "Name" and "Age" columns are sortable.
- Clicking a row will log the row data.
- Custom styling is applied to the "Name" column where `John Doe` will appear in blue text.

---

## Customization

### Column Width

- Column widths are defined in the `columns` array using the `width` property.
- If no width is provided, a default of `200px` is used for that column.

### Cell Rendering

- The `render` function allows custom formatting of cell content.
- Example: Formatting a date or currency value can be done through the `render` function for that specific column.

### Sorting Customization

- Sorting is performed based on the column's `key`.
- Custom sorting logic can be implemented by passing a custom sorting function to the `Column` interface if needed.

---

## Performance and Optimization

### Virtualization
For large datasets, consider using a virtualization technique to only render visible rows (e.g., `react-window` or `react-virtualized`).

### Sorting Optimization
Currently, sorting involves a full array re-sort, which may impact performance for very large datasets. Optimizations like memoization or lazy loading can improve performance.

### Re-rendering Optimization
To avoid unnecessary re-renders, ensure that data updates are minimal, and consider using React's `memo` or `useMemo` hooks to prevent re-sorting when data hasn't changed.

--- 

This documentation covers the key aspects of the `DataGrid` component. It should provide enough information to understand, implement, and customize the component in your React projects.
 



# Products Component Architecture

## Overview
The **Products** component is responsible for fetching, displaying, and enabling comparison of products using the **DataGrid** component. It allows users to select multiple products and compare values within the same category, highlighting the differences.

## Props
This component does not accept any props.

## State Management
The component maintains the following state variables:

| State Variable   | Type        | Description |
|-----------------|------------|-------------|
| `selectedRows`  | `any[]` | Stores the list of selected products for comparison. |

## Data Fetching
- Uses the `useProductsFetch` custom hook to fetch product data.
- The `useEffect` hook triggers `fetchData()` on component mount to fetch the initial product list.

## Component Structure
### 1. **Fetching Data**
- The `useProductsFetch` hook returns:
  - `data`: The fetched product list.
  - `loading`: A boolean indicating if data is being fetched.
  - `error`: An error message if the fetch fails.
  - `fetchData()`: A function to manually trigger a refetch.
- If `loading` is true, a loading message is displayed.
- If `error` is present, an error message with a retry button is shown.

### 2. **Product Selection for Comparison**
- The `handleRowSelect(row: any)` function updates `selectedRows`:
  - If a row is already selected, it is removed from `selectedRows`.
  - Otherwise, it is added to the selection.
- Users select products via checkboxes rendered in the first column.

### 3. **Comparison Logic**
- `getComparisonDifference(columnKey: string)`: Calculates the min and max values within each category for the selected products.
- `getCellStyle(columnKey: string, value: any, category: string)`: Applies background color styling to highlight the highest and lowest values in the selected rows.

### 4. **DataGrid Integration**
- The component defines `columns` for the **DataGrid**:
  - Includes an image, title, price, rating, description, and category.
  - The first column contains a checkbox for selection.
  - Some columns include custom renderers (e.g., star ratings, truncated descriptions).
- The `DataGrid` receives:
  - `data`: The fetched product data.
  - `columns`: The column configuration.
  - `cellStyles`: The styling function for comparison highlighting.

## Features & Enhancements
✅ Fetches product data dynamically  
✅ Displays product list in a table format  
✅ Allows multi-product selection for comparison  
✅ Highlights differences in numeric values  
✅ Handles loading and error states  

## Potential Improvements
🔹 Implement pagination for large datasets  
🔹 Allow multi-column sorting  
🔹 Improve accessibility with ARIA attributes  
🔹 Add filters to refine product selection  

## Usage Example
```tsx
<Products />
```

## Conclusion
The **Products** component seamlessly integrates with the **DataGrid** to display and compare products. It enhances user experience by allowing dynamic selection and highlighting significant differences in product attributes.

# useProductsFetch Hook Documentation

## Overview
The **useProductsFetch** hook is a custom React hook designed to fetch product data from an API. It manages the loading state, handles errors, and provides the fetched data to consuming components.

## Hook Signature
```tsx
const { data, loading, error, fetchData } = useProductsFetch();
```

## State Management
The hook maintains the following state variables:

| State Variable | Type      | Description |
|---------------|----------|-------------|
| `data`        | `any[]`  | Stores the fetched product data. Initially an empty array. |
| `loading`     | `boolean` | Indicates whether the API request is in progress. Initially `true`. |
| `error`       | `string | null` | Stores an error message if the request fails. Initially `null`. |

## Functions
### 1. **fetchData** (Fetches Product Data)
```tsx
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
```
- Fetches product data from `https://fakestoreapi.com/products`.
- Sets `loading` to `true` before making the request.
- If the response is not OK, sets an error message.
- Updates `data` state with the fetched products.
- If an error occurs, sets `error`.
- Finally, sets `loading` to `false` to indicate request completion.

## Usage Example
```tsx
import { useEffect } from "react";
import useProductsFetch from "./useProductsFetch";

const Products = () => {
    const { data, loading, error, fetchData } = useProductsFetch();

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return <p>Loading products...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <ul>
            {data.map((product) => (
                <li key={product.id}>{product.title}</li>
            ))}
        </ul>
    );
};
```

## Features & Enhancements
✅ Fetches product data dynamically  
✅ Handles loading and error states  
✅ Provides a simple API for fetching data  

## Potential Improvements
🔹 Add caching to reduce unnecessary API calls  
🔹 Implement pagination support  
🔹 Enhance error handling with specific messages  

## Conclusion
The **useProductsFetch** hook provides a reusable and efficient way to fetch product data. It ensures smooth state management and error handling, making it a valuable addition to React applications.
