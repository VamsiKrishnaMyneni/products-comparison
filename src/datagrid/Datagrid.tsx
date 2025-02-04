import { useEffect, useState } from 'react'
import './datagrid.css'

interface datagridProps {
    columns: any[],
    data: any[],
    height?: number,
    onRowClick?: (row: any) => {},
    cellStyles?: (row: any, key: string, category: string) => {},
}

function DataGrid(props: datagridProps) {
    const { columns = [], data = [], height = 400, onRowClick, cellStyles } = props;
    const [tableData, setTableData] = useState(data || []);
    const [sortConfig, setSortConfig] = useState({ key: '', direction: "asc" });

    useEffect(() => {
        setTableData(data);
    }, [data]);

    const getValue = (row: any, key: string) => {
        return key.split(".").reduce((acc, val) => acc[val], row) || "-";
    };

    const handleSort = (key: string) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });

        const sortedData = [...tableData].sort((a, b) => {
            const valueA = getValue(a, key);
            const valueB = getValue(b, key);

            if (valueA < valueB) return direction === "asc" ? -1 : 1;
            if (valueA > valueB) return direction === "asc" ? 1 : -1;
            return 0;
        });

        setTableData(sortedData);
    };

    return (
        <div id="datagrid-container" className="table-container" style={{ height: `${height}px` }}>
            <table className="table" style={{ width: `max(100%, ${columns.reduce((acc: any, col: any) => acc + (col.width || 200), 0)}px)` }}>
                <thead>
                    <tr>
                        {columns.map((col: any) => (
                            <th
                                key={col.key}
                                style={{ width: col.width || 200, cursor: "pointer" }}
                                onClick={() => (col.sort && col.key) && handleSort(col.key)}
                                className='col-header'
                            >
                                {col.label} &nbsp; {(sortConfig.key === col.key && col.sort && col.key) ? (sortConfig.direction === "asc" ? (
                                    <i className="fas fa-sort-up"></i>
                                ) : (
                                    <i className="fas fa-sort-down"></i>
                                )) : ""}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {tableData.length > 0 ? (
                        tableData.map((row: any, rowIndex: number) => (
                            <tr
                                key={rowIndex}
                                className={rowIndex % 2 === 0 ? "bg-white" : "bg-neutral-50"}
                                onClick={() => onRowClick && onRowClick(row)}

                            >
                                {columns.map((col: any) => (
                                    <td key={col.key}
                                        style={cellStyles && cellStyles(col.key, getValue(row, col.key), row.category)}
                                    >
                                        {col.render ? col.render(row, getValue(row, col.key)) : getValue(row, col.key)}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length} className="no-data">
                                No rows to display
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default DataGrid
