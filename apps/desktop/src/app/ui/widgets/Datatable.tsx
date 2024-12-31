import {useCallback, useEffect, useState} from "preact/hooks";
import {Component} from "preact";

// const DataTable = ({ data, columns, pageSize = 10 }) => {
//     const [currentPage, setCurrentPage] = useState(1);
//     const [paginatedData, setPaginatedData] = useState([]);
//     const [totalPageCount, setTotalPageCount] = useState(0);
//
//
//     // Calculate paginated data whenever data or currentPage changes
//     useEffect(() => {
//         if (!data || data.length === 0) {
//             setPaginatedData([]);
//             setTotalPageCount(0);
//             return;
//         }
//
//         const startIndex = (currentPage - 1) * pageSize;
//         const endIndex = startIndex + pageSize;
//         const currentPageData = data.slice(startIndex, endIndex);
//
//         setPaginatedData(currentPageData);
//         setTotalPageCount(Math.ceil(data.length / pageSize));
//     }, [data, currentPage, pageSize]);
//
//
//     const handlePageChange = useCallback((pageNumber) => {
//         if (pageNumber >= 1 && pageNumber <= totalPageCount) {
//             setCurrentPage(pageNumber);
//         }
//     }, [totalPageCount]);
//
//     // Render a single cell of the table
//     const renderCell = (row, column) => {
//         if (column.render) {
//             return column.render(row)
//         }
//         return row[column.key];
//     };
//
//     const renderTableHeader = () => {
//         return(
//             <thead>
//             <tr>
//                 {columns.map((column) => (
//                     <th key={column.key}>{column.label}</th>
//                 ))}
//             </tr>
//             </thead>
//         )
//     }
//
//     const renderTableBody = () => {
//         return(
//             <tbody>
//             {paginatedData.map((row, rowIndex) => (
//                 <tr key={rowIndex}>
//                     {columns.map((column, colIndex) => (
//                         <td key={colIndex}>{renderCell(row, column)}</td>
//                     ))}
//                 </tr>
//             ))}
//             </tbody>
//         )
//     }
//
//     const renderPagination = () => {
//         if (totalPageCount <= 1) {
//             return null; // Hide if only one page
//         }
//
//         const pages = [];
//         for (let i = 1; i <= totalPageCount; i++) {
//             pages.push(
//                 <button
//                     key={i}
//                     onClick={() => handlePageChange(i)}
//                     disabled={i === currentPage}
//                     class={i === currentPage ? 'active-page-button' : null}
//                 >
//                     {i}
//                 </button>
//             );
//         }
//
//         return (
//             <div class="pagination-container">
//                 <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage <= 1}>
//                     Previous
//                 </button>
//                 {pages}
//                 <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPageCount}>
//                     Next
//                 </button>
//             </div>
//         );
//     };
//
//     return (
//         <div class="xui data-table-container">
//             <table class="data-table">
//                 {renderTableHeader()}
//                 {renderTableBody()}
//             </table>
//             {renderPagination()}
//         </div>
//     );
// };

// class DataTable extends Component<any, any> {
//     constructor(props) {
//         super(props);
//         this.state = {
//             loading: true,
//             data: [],
//             currentPage: 1,
//             itemsPerPage: props.itemsPerPage || 10,
//             totalPages: 0,
//         };
//     }
//
//     componentDidMount() {
//         this.fetchData();
//     }
//
//     fetchData() {
//         this.setState({ loading: true });
//         this.props.fetchDataCallback((data) => {
//             this.setState(
//                 {
//                     loading: false,
//                     data: data,
//                     totalPages: Math.ceil(data.length / this.state.itemsPerPage),
//                     currentPage: 1,
//                 },
//                 () => {
//                     this.forceUpdate();
//                 }
//             );
//         });
//     }
//
//     handlePageChange(page) {
//         this.setState({ currentPage: page });
//     }
//
//     getDisplayedData() {
//         const { data, currentPage, itemsPerPage } = this.state;
//         const startIndex = (currentPage - 1) * itemsPerPage;
//         const endIndex = startIndex + itemsPerPage;
//         return data.slice(startIndex, endIndex);
//     }
//
//     handlePreviousPageClick = () => {
//         if (this.state.currentPage > 1) {
//             this.handlePageChange(this.state.currentPage - 1);
//         }
//     }
//
//     handleNextPageClick = () => {
//         if (this.state.currentPage < this.state.totalPages) {
//             this.handlePageChange(this.state.currentPage + 1);
//         }
//     }
//
//
//     renderPagination() {
//         const { currentPage, totalPages } = this.state;
//         if (totalPages <= 1) {
//             return null; // Hide pagination if only one or zero pages
//         }
//
//         return (
//             <div className="pagination">
//                 <button
//                     disabled={currentPage === 1}
//                     onClick={this.handlePreviousPageClick}
//                 >
//                     Previous
//                 </button>
//                 <span>
//               Page {currentPage} of {totalPages}
//             </span>
//                 <button
//                     disabled={currentPage === totalPages}
//                     onClick={this.handleNextPageClick}
//                 >
//                     Next
//                 </button>
//             </div>
//         );
//     }
//
//
//     render() {
//         const { loading, data } = this.state;
//         const displayedData = this.getDisplayedData();
//
//         if (loading) {
//             return <div class="loading-indicator">Loading...</div>;
//         }
//
//         if (data.length === 0) {
//             return <div class="no-results">No results found.</div>;
//         }
//
//
//         return (
//             <div class="xui data-table-container">
//                 <table class="data-table">
//                     <thead>
//                     <tr>
//                         {this.props.columns.map((column, index) => (
//                             <th key={index}>{column.header}</th>
//                         ))}
//                     </tr>
//                     </thead>
//                     <tbody>
//                     {displayedData.map((row, rowIndex) => (
//                         <tr key={rowIndex}>
//                             {this.props.columns.map((column, colIndex) => (
//                                 <td key={colIndex}>{row[column.field]}</td>
//                             ))}
//                         </tr>
//                     ))}
//                     </tbody>
//                 </table>
//                 {this.renderPagination()}
//             </div>
//         );
//     }
// }

// class DataTable extends Component<any, any> {
//     constructor(props) {
//         super(props);
//         this.state = {
//             loading: true,
//             data: [],
//             currentPage: 1,
//             itemsPerPage: props.itemsPerPage || 10,
//             totalPages: 0,
//             showRowsPerPage: props.showRowsPerPage,
//         };
//     }
//
//     componentDidMount() {
//         this.fetchData();
//     }
//
//     fetchData() {
//         this.setState({ loading: true });
//         this.props.fetchDataCallback((data) => {
//             this.setState(
//                 {
//                     loading: false,
//                     data: data,
//                     totalPages: Math.ceil(data.length / this.state.itemsPerPage),
//                     currentPage: 1,
//                 },
//                 () => {
//                     this.forceUpdate();
//                 }
//             );
//         });
//     }
//
//     handlePageChange(page) {
//         this.setState({ currentPage: page });
//     }
//
//     getDisplayedData() {
//         const { data, currentPage, itemsPerPage } = this.state;
//         const startIndex = (currentPage - 1) * itemsPerPage;
//         const endIndex = startIndex + itemsPerPage;
//         return data.slice(startIndex, endIndex);
//     }
//
//     handlePreviousPageClick = () => {
//         if (this.state.currentPage > 1) {
//             this.handlePageChange(this.state.currentPage - 1);
//         }
//     }
//
//     handleNextPageClick = () => {
//         if (this.state.currentPage < this.state.totalPages) {
//             this.handlePageChange(this.state.currentPage + 1);
//         }
//     }
//     handleItemsPerPageChange = (event) => {
//         const newItemsPerPage = parseInt(event.target.value, 10);
//         this.setState({
//             itemsPerPage: newItemsPerPage,
//             totalPages: Math.ceil(this.state.data.length / newItemsPerPage),
//             currentPage: 1,
//         });
//     };
//
//     renderPagination() {
//         const { currentPage, totalPages, showRowsPerPage, itemsPerPage } = this.state;
//         if (totalPages <= 1) {
//             return null; // Hide pagination if only one or zero pages
//         }
//
//         return (
//             <div className="pagination">
//                 {showRowsPerPage && (
//                     <span class="rows-per-page-container">
//                         Rows per page:
//                         <select
//                             value={itemsPerPage}
//                             onChange={this.handleItemsPerPageChange}
//                         >
//                             <option value="5">5</option>
//                             <option value="10">10</option>
//                             <option value="20">20</option>
//                         </select>
//                     </span>
//                 )}
//                 <button
//                     disabled={currentPage === 1}
//                     onClick={this.handlePreviousPageClick}
//                 >
//                     Previous
//                 </button>
//                 <span>
//               Page {currentPage} of {totalPages}
//             </span>
//                 <button
//                     disabled={currentPage === totalPages}
//                     onClick={this.handleNextPageClick}
//                 >
//                     Next
//                 </button>
//             </div>
//         );
//     }
//
//
//     render() {
//         const { loading, data } = this.state;
//         const displayedData = this.getDisplayedData();
//
//         if (loading) {
//             return <div class="loading-indicator">Loading...</div>;
//         }
//
//         if (data.length === 0) {
//             return <div class="no-results">No results found.</div>;
//         }
//
//
//         return (
//             <div class="xui data-table-container">
//                 <table class="data-table">
//                     {this.props.showHeader !== false && (
//                         <thead>
//                         <tr>
//                             {this.props.columns.map((column, index) => (
//                                 <th key={index}>{column.header}</th>
//                             ))}
//                         </tr>
//                         </thead>
//                     )}
//                     <tbody>
//                     {displayedData.map((row, rowIndex) => (
//                         <tr key={rowIndex}>
//                             {this.props.columns.map((column, colIndex) => (
//                                 <td key={colIndex}>{row[column.field]}</td>
//                             ))}
//                         </tr>
//                     ))}
//                     </tbody>
//                 </table>
//                 {this.renderPagination()}
//             </div>
//         );
//     }
// }

// class DataTable extends Component<any, any> {
//     constructor(props) {
//         super(props);
//         this.state = {
//             loading: true,
//             data: [],
//             currentPage: 1,
//             itemsPerPage: props.itemsPerPage || 10,
//             totalPages: 0,
//             showRowsPerPage: props.showRowsPerPage,
//             selectedRowIndex: null,
//         };
//     }
//
//     componentDidMount() {
//         this.fetchData();
//     }
//
//     fetchData() {
//         this.setState({ loading: true });
//         this.props.fetchDataCallback((data) => {
//             this.setState(
//                 {
//                     loading: false,
//                     data: data,
//                     totalPages: Math.ceil(data.length / this.state.itemsPerPage),
//                     currentPage: 1,
//                     selectedRowIndex: null,
//                 },
//                 () => {
//                     this.forceUpdate();
//                 }
//             );
//         });
//     }
//
//     handlePageChange(page) {
//         this.setState({ currentPage: page });
//     }
//
//     getDisplayedData() {
//         const { data, currentPage, itemsPerPage } = this.state;
//         const startIndex = (currentPage - 1) * itemsPerPage;
//         const endIndex = startIndex + itemsPerPage;
//         return data.slice(startIndex, endIndex);
//     }
//
//     handlePreviousPageClick = () => {
//         if (this.state.currentPage > 1) {
//             this.handlePageChange(this.state.currentPage - 1);
//         }
//     };
//
//     handleNextPageClick = () => {
//         if (this.state.currentPage < this.state.totalPages) {
//             this.handlePageChange(this.state.currentPage + 1);
//         }
//     };
//
//     handleItemsPerPageChange = (event) => {
//         const newItemsPerPage = parseInt(event.target.value, 10);
//         this.setState({
//             itemsPerPage: newItemsPerPage,
//             totalPages: Math.ceil(this.state.data.length / newItemsPerPage),
//             currentPage: 1,
//         });
//     };
//
//     handleRowClick = (rowIndex) => {
//         this.setState({ selectedRowIndex: rowIndex }, () => {
//             if (this.props.onRowSelect) {
//                 this.props.onRowSelect(this.getDisplayedData()[rowIndex]);
//             }
//         });
//     };
//     renderPagination() {
//         const { currentPage, totalPages, showRowsPerPage, itemsPerPage } = this.state;
//         if (totalPages <= 1) {
//             return null; // Hide pagination if only one or zero pages
//         }
//
//         return (
//             <div className="pagination">
//                 {showRowsPerPage && (
//                     <span class="rows-per-page-container">
//                         Rows per page:
//                         <select
//                             value={itemsPerPage}
//                             onChange={this.handleItemsPerPageChange}
//                         >
//                             <option value="5">5</option>
//                             <option value="10">10</option>
//                             <option value="20">20</option>
//                         </select>
//                     </span>
//                 )}
//                 <button
//                     disabled={currentPage === 1}
//                     onClick={this.handlePreviousPageClick}
//                 >
//                     Previous
//                 </button>
//                 <span>
//                     Page {currentPage} of {totalPages}
//                 </span>
//                 <button
//                     disabled={currentPage === totalPages}
//                     onClick={this.handleNextPageClick}
//                 >
//                     Next
//                 </button>
//             </div>
//         );
//     }
//
//
//     render() {
//         const { loading, data, selectedRowIndex } = this.state;
//         const displayedData = this.getDisplayedData();
//
//         if (loading) {
//             return <div class="loading-indicator">Loading...</div>;
//         }
//
//         if (data.length === 0) {
//             return <div class="no-results">No results found.</div>;
//         }
//
//         return (
//             <div class="xui data-table-container">
//                 <table class="data-table">
//                     {this.props.showHeader !== false && (
//                         <thead>
//                         <tr>
//                             {this.props.columns.map((column, index) => (
//                                 <th key={index}>{column.header}</th>
//                             ))}
//                         </tr>
//                         </thead>
//                     )}
//                     <tbody>
//                     {displayedData.map((row, rowIndex) => (
//                         <tr
//                             key={rowIndex}
//                             onClick={() => this.handleRowClick(rowIndex)}
//                             className={rowIndex === selectedRowIndex ? "selected" : ""}
//                         >
//                             {this.props.columns.map((column, colIndex) => (
//                                 <td key={colIndex}>{row[column.field]}</td>
//                             ))}
//                         </tr>
//                     ))}
//                     </tbody>
//                 </table>
//                 {this.renderPagination()}
//             </div>
//         );
//     }
// }

// class DataTable extends Component<any, any> {
//     constructor(props) {
//         super(props);
//         this.state = {
//             loading: true,
//             data: [],
//             currentPage: 1,
//             itemsPerPage: props.itemsPerPage || 10,
//             totalPages: 0,
//             showRowsPerPage: props.showRowsPerPage,
//             selectedRowIndex: null,
//         };
//     }
//
//     componentDidMount() {
//         this.fetchData();
//     }
//
//     fetchData() {
//         this.setState({ loading: true });
//         this.props.fetchDataCallback((data) => {
//             this.setState(
//                 {
//                     loading: false,
//                     data: data,
//                     totalPages: Math.ceil(data.length / this.state.itemsPerPage),
//                     currentPage: 1,
//                     selectedRowIndex: null,
//                 },
//                 () => {
//                     this.forceUpdate();
//                 }
//             );
//         });
//     }
//
//     handlePageChange(page) {
//         this.setState({ currentPage: page });
//     }
//
//     getDisplayedData() {
//         const { data, currentPage, itemsPerPage } = this.state;
//         const startIndex = (currentPage - 1) * itemsPerPage;
//         const endIndex = startIndex + itemsPerPage;
//         return data.slice(startIndex, endIndex);
//     }
//
//     handlePreviousPageClick = () => {
//         if (this.state.currentPage > 1) {
//             this.handlePageChange(this.state.currentPage - 1);
//         }
//     };
//
//     handleNextPageClick = () => {
//         if (this.state.currentPage < this.state.totalPages) {
//             this.handlePageChange(this.state.currentPage + 1);
//         }
//     };
//
//     handleItemsPerPageChange = (event) => {
//         const newItemsPerPage = parseInt(event.target.value, 10);
//         this.setState({
//             itemsPerPage: newItemsPerPage,
//             totalPages: Math.ceil(this.state.data.length / newItemsPerPage),
//             currentPage: 1,
//         });
//     };
//
//     handleRowClick = (rowIndex) => {
//         this.setState({ selectedRowIndex: rowIndex }, () => {
//             if (this.props.onRowSelect) {
//                 this.props.onRowSelect(this.getDisplayedData()[rowIndex]);
//             }
//         });
//     };
//     renderPagination() {
//         const { currentPage, totalPages, showRowsPerPage, itemsPerPage } = this.state;
//         if (totalPages <= 1) {
//             return null; // Hide pagination if only one or zero pages
//         }
//
//         return (
//             <div className="pagination">
//                 {showRowsPerPage && (
//                     <span class="rows-per-page-container">
//                         Rows per page:
//                         <select
//                             value={itemsPerPage}
//                             onChange={this.handleItemsPerPageChange}
//                         >
//                             <option value="5">5</option>
//                             <option value="10">10</option>
//                             <option value="20">20</option>
//                         </select>
//                     </span>
//                 )}
//                 <button
//                     disabled={currentPage === 1}
//                     onClick={this.handlePreviousPageClick}
//                 >
//                     Previous
//                 </button>
//                 <span>
//                     Page {currentPage} of {totalPages}
//                 </span>
//                 <button
//                     disabled={currentPage === totalPages}
//                     onClick={this.handleNextPageClick}
//                 >
//                     Next
//                 </button>
//             </div>
//         );
//     }
//
//
//     render() {
//         const { loading, data, selectedRowIndex } = this.state;
//         const displayedData = this.getDisplayedData();
//
//         if (loading) {
//             return <div class="loading-indicator">Loading...</div>;
//         }
//
//         return (
//             <div class="data-table-container">
//                 <table class="data-table">
//                     {this.props.showHeader !== false && (
//                         <thead>
//                         <tr>
//                             {this.props.columns.map((column, index) => (
//                                 <th key={index}>{column.header}</th>
//                             ))}
//                         </tr>
//                         </thead>
//                     )}
//                     <tbody>
//                     {data.length === 0 ? (
//                         <tr>
//                             <td colSpan={this.props.columns.length} class="no-results">
//                                 No results found.
//                             </td>
//                         </tr>
//                     ) : (displayedData.map((row, rowIndex) => (
//                         <tr
//                             key={rowIndex}
//                             onClick={() => this.handleRowClick(rowIndex)}
//                             className={rowIndex === selectedRowIndex ? "selected" : ""}
//                         >
//                             {this.props.columns.map((column, colIndex) => (
//                                 <td key={colIndex}>{row[column.field]}</td>
//                             ))}
//                         </tr>
//                     )))}
//
//                     </tbody>
//                 </table>
//                 {this.renderPagination()}
//             </div>
//         );
//     }
// }

// class DataTable extends Component<any, any> {
//     constructor(props) {
//         super(props);
//         this.state = {
//             loading: false,
//             data: [],
//             currentPage: 1,
//             itemsPerPage: props.itemsPerPage || 10,
//             totalPages: 0,
//             showRowsPerPage: props.showRowsPerPage,
//             selectedRowIndex: null,
//             statusMessage: null,
//             loadingData: false, //loading data state
//         };
//     }
//
//     componentDidMount() {
//         this.fetchData();
//     }
//
//     fetchData() {
//         this.setState({ loadingData: true, statusMessage: null });
//         try {
//             this.props.fetchDataCallback((data) => {
//                 this.setState(
//                     {
//                         loadingData: false,
//                         data: data,
//                         totalPages: Math.ceil(data.length / this.state.itemsPerPage),
//                         currentPage: 1,
//                         selectedRowIndex: null,
//                         statusMessage: null
//                     },
//                     () => {
//                         this.forceUpdate();
//                     }
//                 );
//             });
//         }
//         catch(e){
//             this.setState({
//                 loadingData: false,
//                 statusMessage: 'Error: ' + e.message,
//             });
//         }
//     }
//
//     handlePageChange(page) {
//         this.setState({ currentPage: page });
//     }
//
//     getDisplayedData() {
//         const { data, currentPage, itemsPerPage } = this.state;
//         const startIndex = (currentPage - 1) * itemsPerPage;
//         const endIndex = startIndex + itemsPerPage;
//         return data.slice(startIndex, endIndex);
//     }
//
//     handlePreviousPageClick = () => {
//         if (this.state.currentPage > 1) {
//             this.handlePageChange(this.state.currentPage - 1);
//         }
//     };
//
//     handleNextPageClick = () => {
//         if (this.state.currentPage < this.state.totalPages) {
//             this.handlePageChange(this.state.currentPage + 1);
//         }
//     };
//
//     handleItemsPerPageChange = (event) => {
//         const newItemsPerPage = parseInt(event.target.value, 10);
//         this.setState({
//             itemsPerPage: newItemsPerPage,
//             totalPages: Math.ceil(this.state.data.length / newItemsPerPage),
//             currentPage: 1,
//         });
//     };
//
//     handleRowClick = (rowIndex) => {
//         this.setState({ selectedRowIndex: rowIndex }, () => {
//             if (this.props.onRowSelect) {
//                 this.props.onRowSelect(this.getDisplayedData()[rowIndex]);
//             }
//         });
//     };
//     renderPagination() {
//         const { currentPage, totalPages, showRowsPerPage, itemsPerPage } = this.state;
//         if (totalPages <= 1) {
//             return null; // Hide pagination if only one or zero pages
//         }
//
//         return (
//             <div className="pagination">
//                 {showRowsPerPage && (
//                     <span class="rows-per-page-container">
//                         Rows per page:
//                         <select
//                             value={itemsPerPage}
//                             onChange={this.handleItemsPerPageChange}
//                         >
//                             <option value="5">5</option>
//                             <option value="10">10</option>
//                             <option value="20">20</option>
//                         </select>
//                     </span>
//                 )}
//                 <button
//                     disabled={currentPage === 1}
//                     onClick={this.handlePreviousPageClick}
//                 >
//                     Previous
//                 </button>
//                 <span>
//                     Page {currentPage} of {totalPages}
//                 </span>
//                 <button
//                     disabled={currentPage === totalPages}
//                     onClick={this.handleNextPageClick}
//                 >
//                     Next
//                 </button>
//             </div>
//         );
//     }
//
//
//     render() {
//         const { loading, data, selectedRowIndex, statusMessage, loadingData } = this.state;
//         const displayedData = this.getDisplayedData();
//
//         return (
//             <div class="data-table-container">
//                 {loadingData && <div class="loading-overlay"><div class="loading-indicator">Loading...</div></div>}
//                 {statusMessage && <div class="status-message">{statusMessage}</div>}
//
//                 <table class="data-table">
//                     {this.props.showHeader !== false && (
//                         <thead>
//                         <tr>
//                             {this.props.columns.map((column, index) => (
//                                 <th key={index}>{column.header}</th>
//                             ))}
//                         </tr>
//                         </thead>
//                     )}
//                     <tbody>
//                     {data.length === 0 ? (
//                         <tr>
//                             <td colSpan={this.props.columns.length} class="no-results">
//                                 No results found.
//                             </td>
//                         </tr>
//                     ) : (displayedData.map((row, rowIndex) => (
//                         <tr
//                             key={rowIndex}
//                             onClick={() => this.handleRowClick(rowIndex)}
//                             className={rowIndex === selectedRowIndex ? "selected" : ""}
//                         >
//                             {this.props.columns.map((column, colIndex) => (
//                                 <td key={colIndex}>{row[column.field]}</td>
//                             ))}
//                         </tr>
//                     )))}
//
//                     </tbody>
//                 </table>
//                 {this.renderPagination()}
//             </div>
//         );
//     }
// }

class DataTable extends Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: [],
            currentPage: 1,
            itemsPerPage: props.itemsPerPage || 10,
            totalPages: 0,
            showRowsPerPage: props.showRowsPerPage,
            selectedRowIndex: null,
            statusMessage: null,
            loadingData: false, //loading data state
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData(page = this.state.currentPage) {
        this.setState({ loadingData: true, statusMessage: null });
        try {
            this.props.fetchDataCallback(page, this.state.itemsPerPage, (data, total) => {
                this.setState(
                    {
                        loadingData: false,
                        data: data,
                        totalPages: Math.ceil(total / this.state.itemsPerPage),
                        currentPage: page,
                        selectedRowIndex: null,
                        statusMessage: null
                    },
                    () => {
                        this.forceUpdate();
                    }
                );
            });
        } catch (e) {
            this.setState({
                loadingData: false,
                statusMessage: 'Error: ' + e.message,
            });
        }
    }


    handlePageChange(page) {
        this.fetchData(page);
    }

    getDisplayedData() {
        return this.state.data;
    }


    handlePreviousPageClick = () => {
        if (this.state.currentPage > 1) {
            this.handlePageChange(this.state.currentPage - 1);
        }
    };

    handleNextPageClick = () => {
        if (this.state.currentPage < this.state.totalPages) {
            this.handlePageChange(this.state.currentPage + 1);
        }
    };

    handleItemsPerPageChange = (event) => {
        const newItemsPerPage = parseInt(event.target.value, 10);
        this.setState({
            itemsPerPage: newItemsPerPage,
            totalPages: 0, // Setting to 0 to force the fetch of the total pages.
            currentPage: 1
        },()=> {
            this.fetchData(1);
        });
    };

    handleRowClick = (rowIndex) => {
        this.setState({ selectedRowIndex: rowIndex }, () => {
            if (this.props.onRowSelect) {
                this.props.onRowSelect(this.getDisplayedData()[rowIndex]);
            }
        });
    };
    renderPagination() {
        const { currentPage, totalPages, showRowsPerPage, itemsPerPage } = this.state;
        if (totalPages <= 1) {
            return null; // Hide pagination if only one or zero pages
        }

        return (
            <div className="pagination">
                {showRowsPerPage && (
                    <span class="rows-per-page-container">
                        Rows per page:
                        <select
                            value={itemsPerPage}
                            onChange={this.handleItemsPerPageChange}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                        </select>
                    </span>
                )}
                <button
                    disabled={currentPage === 1}
                    onClick={this.handlePreviousPageClick}
                >
                    Previous
                </button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    disabled={currentPage === totalPages}
                    onClick={this.handleNextPageClick}
                >
                    Next
                </button>
            </div>
        );
    }


    render() {
        const { loading, data, selectedRowIndex, statusMessage, loadingData } = this.state;
        const displayedData = this.getDisplayedData();
        return (
            <div class="data-table-container">
                {loadingData && <div class="loading-overlay"><div class="loading-indicator">Loading...</div></div>}
                {statusMessage && <div class="status-message">{statusMessage}</div>}

                <table class="data-table">
                    {this.props.showHeader !== false && (
                        <thead>
                        <tr>
                            {this.props.columns.map((column, index) => (
                                <th key={index}>{column.header}</th>
                            ))}
                        </tr>
                        </thead>
                    )}
                    <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={this.props.columns.length} class="no-results">
                                No results found.
                            </td>
                        </tr>
                    ) : (displayedData.map((row, rowIndex) => (
                        <tr
                            key={rowIndex}
                            onClick={() => this.handleRowClick(rowIndex)}
                            className={rowIndex === selectedRowIndex ? "selected" : ""}
                        >
                            {this.props.columns.map((column, colIndex) => (
                                <td key={colIndex}>{row[column.field]}</td>
                            ))}
                        </tr>
                    )))}

                    </tbody>
                </table>
                {this.renderPagination()}
            </div>
        );
    }
}

export default DataTable;