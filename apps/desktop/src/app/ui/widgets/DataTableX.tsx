import {useState} from "preact/hooks";
import {FC} from "preact/compat";

interface DataRow {
    id: any;
    value: any; // Single column value
}

interface DataTableProps {
    data: DataRow[];
    className?: string;
    pageSize?: number;
    onRowSelect?: (selectedRowIds: any[]) => void;
}

const DataTable: FC<DataTableProps> = ({ data, className, pageSize = 10, onRowSelect }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRowIds, setSelectedRowIds] = useState<any[]>([]);
    const totalPages = Math.ceil(data.length / pageSize);

    const arrayIncludes = (arr: any[], item: any) => {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === item) {
                return true;
            }
        }
        return false;
    }

    const arrayFilter = (arr: any[], callback: (item:any) => boolean) => {
        let result = [];
        for (let i = 0; i < arr.length; i++) {
            if (callback(arr[i])) {
                result.push(arr[i]);
            }
        }
        return result
    }

    const handleRowClick = (id: any) => {
        let newSelection = [...selectedRowIds]
        if(arrayIncludes(newSelection, id)){
            newSelection = arrayFilter(newSelection, selectedId => selectedId !== id)
        }else{
            newSelection.push(id);
        }
        setSelectedRowIds(newSelection);
        onRowSelect?.(newSelection); // Notify parent component of selection change
    };

    const getRowClassName = (id: any) => {
        return arrayIncludes(selectedRowIds, id) ? 'selected-row' : '';
    }


    const renderRow = (row: DataRow) => {
        return (
            <tr
                key={row.id}
                className={getRowClassName(row.id)}
            >
                <td style={{textAlign: 'center', padding: '5px'}}>
                    <input
                        type="checkbox"
                        checked={arrayIncludes(selectedRowIds, row.id)}
                        onChange={() => handleRowClick(row.id)}
                    />
                    <span> {row.value}</span>
                </td>
            </tr>
        );
    };

    const getCurrentPageData = () => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return data.slice(startIndex, endIndex);
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };


    const renderPagination = () => {
        if (totalPages <= 1) {
            return null;
        }

        const pageLinks = [];
        for (let i = 1; i <= totalPages; i++) {
            pageLinks.push(
                <a
                    href="#"
                    key={i}
                    onClick={(e) => { e.preventDefault(); handlePageChange(i)}}
                    style={i === currentPage ? { fontWeight: 'bold', textDecoration: 'none' } : {} }
                >
                    {i}
                </a>
            )

            if (i < totalPages){
                pageLinks.push(' ') // Add space between links for older browsers
            }
        }
        return (
            <div style={{marginTop: '10px'}}>
                Page: {pageLinks}
            </div>
        )
    };


    return (
        <div className={className}>
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                <tbody>
                {getCurrentPageData().map(renderRow)}
                </tbody>
            </table>
            {renderPagination()}
        </div>
    );
};

export default DataTable;