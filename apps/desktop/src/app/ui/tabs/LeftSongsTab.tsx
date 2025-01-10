// Song Lyric Navigation
import {Component} from "preact";
import {useState} from "preact/hooks";
import {
    selectedSong,
    selectedTab,
    songCategories,
    songTags
} from "@stores/global";
import {useStoreState} from "@/utils/hooks";
import debounce from '@/utils/debounce';
import {$RvW} from "@/rvw";

import {console} from "@/platform/adapters/air";
import {toast} from "@app/ui/Toaster";
import Spinner from "@app/ui/Spinner";
import Modal from "@app/ui/Modal";
// import VirtualList from "@app/ui/widgets/VirtualList";
// import Slider from "@app/ui/widgets/Slider";
// import DataTableX from "@app/ui/widgets/DataTableX";
// import FilterableTable from "@app/ui/widgets/FilterableTable";
import DataTable from "@app/ui/widgets/Datatable";
import PaginatedList from "@app/ui/widgets/PaginatedList";
import {songManager} from "@app/glc";
import {SearchFilter, SearchFilterType} from "@/song/song-manager";

const Zapp = () => {
    // const columns = [
    //     { key: 'id', label: 'ID' },
    //     { key: 'name', label: 'Name' },
    //     { key: 'email', label: 'Email' },
    //     { key: 'isPremium', label: 'Premium', render: (row) => row.isPremium ? 'Yes' : 'No'}
    // ];
    //
    // const data = [
    //     { id: 1, name: 'Alice', email: 'alice@example.com', isPremium: true },
    //     { id: 2, name: 'Bob', email: 'bob@example.com', isPremium: false },
    //     { id: 3, name: 'Charlie', email: 'charlie@example.com', isPremium: true },
    //     { id: 4, name: 'David', email: 'david@example.com', isPremium: false },
    //     { id: 5, name: 'Eve', email: 'eve@example.com', isPremium: true },
    //     { id: 6, name: 'Frank', email: 'frank@example.com', isPremium: false },
    //     { id: 7, name: 'Grace', email: 'grace@example.com', isPremium: true },
    //     { id: 8, name: 'Harry', email: 'harry@example.com', isPremium: false },
    //     { id: 9, name: 'Ivy', email: 'ivy@example.com', isPremium: true },
    //     { id: 10, name: 'Jack', email: 'jack@example.com', isPremium: false },
    //     { id: 11, name: 'Kelly', email: 'kelly@example.com', isPremium: true },
    //     { id: 12, name: 'Liam', email: 'liam@example.com', isPremium: false }
    // ];

    const mockData = [
        { id: 1, name: "Item 1 yn y nyybrtybyrtbty t ntry byrtbrtybyrt", value: 10 },
        { id: 2, name: "Item 2 trnynbyrbyt by brty", value: 20 },
        { id: 3, name: "Item 3 rtyb rtybytytn rtynjy", value: 30 },
        { id: 4, name: "Item 4 tyrh ytb rvb yb", value: 40 },
        { id: 5, name: "Item 5 y rty bnn yrtb", value: 50 },
        { id: 6, name: "Item 6 rtynytnrtyn", value: 60 },
        { id: 7, name: "Item 7", value: 70 },
        { id: 8, name: "Item 8", value: 80 },
        { id: 9, name: "Item 9", value: 90 },
        { id: 10, name: "Item 10", value: 100 },
        { id: 11, name: "Item 11", value: 110 },
        { id: 12, name: "Item 12", value: 120 },
    ];

    // function fetchDataCallback(callback) {
    //     // Simulate a data fetch
    //     setTimeout(() => {
    //         callback(mockData);
    //     }, 9999);
    // }

    function fetchDataCallback(page, itemsPerPage, callback) {
        // Simulate a data fetch
        console.log("fetching page: "+ page +", itemsPerPage: "+ itemsPerPage);
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const data = mockData.slice(startIndex, endIndex);

        setTimeout(() => {
            const total = mockData.length
            callback(data, total);
        }, 1000);
        // To Simulate Error
        //  setTimeout(() => {
        //       throw new Error('Failed to fetch data')
        // }, 500)
    }

    const columns = [
        { header: "ID", field: "id" },
        { header: "Name", field: "name" },
        { header: "Value", field: "value" },
    ];

    const handleRowSelect = (row) => {
        console.log("Selected row:", row);
        // alert(`Selected item: ID: ${row.id}, Name: ${row.name}, Value: ${row.value}`)
    };

    return (
        <>
            {/*<DataTable data={data} columns={columns} pageSize={5} />*/}

            {/*<DataTable columns={columns} itemsPerPage={10} fetchDataCallback={fetchDataCallback}/>*/}

            {/*<div style={{padding: "0px"}}>*/}
            {/*    <DataTable columns={columns} itemsPerPage={10} fetchDataCallback={fetchDataCallback} showHeader={false}/>*/}
            {/*</div>*/}

            <div class="xui" style={{padding: "0", height: "400px", overflow: "auto"}}>
                <h3>Table with Header and Rows per page</h3>
                <DataTable columns={columns} itemsPerPage={5} fetchDataCallback={fetchDataCallback}
                           showRowsPerPage={true} onRowSelect={handleRowSelect}/>
                <hr/>
                <h3>Table without Header and fixed 10 rows per page</h3>
                <DataTable columns={columns} itemsPerPage={10} fetchDataCallback={fetchDataCallback} showHeader={false}
                           onRowSelect={handleRowSelect}/>
                <hr/>
                <h3>Table with No Data</h3>
                <DataTable columns={columns} itemsPerPage={10} fetchDataCallback={(page, itemsPerPage, callback) => {
                    callback([], 0)
                }} showHeader={true} onRowSelect={handleRowSelect}/>
                <hr/>
                <h3>Table with Error</h3>
                <DataTable columns={columns} itemsPerPage={10} fetchDataCallback={() => {
                    throw new Error('Failed to fetch data')
                }} showHeader={true} onRowSelect={handleRowSelect}/>
            </div>
        </>
    );
}

// const ZxApp = () => {
//     // Sample Usage
//     const mockData = [
//         { id: 1, title: "A Ambaram Umparam" },
//         { id: 2, title: "A Ennil Nooru" },
//         { id: 3, title: "A Inba Kala Mallo" },
//         { id: 4, title: "A Inba Nesare Yesuvin" },
//         { id: 5, title: "A Inba Sabaiye" },
//         { id: 6, title: "A Karththave Thalmaiya" },
//         { id: 7, title: "A Yesuve" },
//         { id: 8, title: "A Yesuve Nan" },
//         { id: 9, title: "A Yesuve Neer" },
//         { id: 10, title: "Another Title 1" },
//         { id: 11, title: "Another Title 2" },
//         { id: 12, title: "Another Title 3" },
//         { id: 13, title: "Another Title 4" },
//         { id: 14, title: "Another Title 5" },
//         { id: 15, title: "Another Title 6" },
//         { id: 16, title: "Another Title 7" },
//         { id: 17, title: "Another Title 8" },
//         { id: 18, title: "Another Title 9" },
//         { id: 19, title: "Another Title 10" },
//         { id: 20, title: "Another Title 11" },
//         { id: 21, title: "Another Title 12" },
//         { id: 22, title: "Another Title 13" },
//         { id: 23, title: "Another Title 14" },
//         { id: 24, title: "Another Title 15" },
//         { id: 25, title: "Another Title 16" },
//     ];
//
//     function fetchDataCallback(page, itemsPerPage, callback) {
//         // Simulate a data fetch
//         console.log("fetching page: "+ page +", itemsPerPage: "+ itemsPerPage);
//         const startIndex = (page - 1) * itemsPerPage;
//         const endIndex = startIndex + itemsPerPage;
//         const data = mockData.slice(startIndex, endIndex);
//
//         setTimeout(() => {
//             const total = mockData.length
//             callback(data, total);
//         }, 500);
//         // To Simulate Error
//         //  setTimeout(() => {
//         //       throw new Error('Failed to fetch data')
//         // }, 500)
//     }
//
//     const columns = [{ header: "Title", field: "title" }];
//     const handleRowSelect = (row) => {
//         console.log("Selected row:", row);
//         // alert(`Selected item: ${row.title}`)
//     };
//
//     return (
//         <div class="zui" style={{ padding: "0", height: "500px", overflow: "auto" }}>
//             <FilterableTable
//                 columns={columns}
//                 itemsPerPage={5}
//                 fetchDataCallback={fetchDataCallback}
//                 onRowSelect={handleRowSelect}
//             />
//         </div>
//     );
// };

// function ZyApp() {
//     interface DataTableProps {
//         data?:
//             | object[]
//             | ((
//             page: number,
//             perPage: number,
//             callback: (data: object[], total: number) => void
//         ) => void);
//         perPage?: number;
//         showHeaders?: boolean;
//         onRowClick?: (row: object) => void;
//     }
//
//     interface DataTableState {
//         data: object[];
//         filteredData: object[];
//         currentPage: number;
//         perPage: number;
//         searchQuery: string;
//         sortColumn: string | null;
//         sortOrder: 'asc' | 'desc';
//         showHeaders: boolean;
//         selectedRowIndex: number | null;
//         loading: boolean;
//         error: string | null;
//         total: number;
//     }
//
//     class DataTable extends Component<DataTableProps, DataTableState> {
//         private searchTimeout: number | null = null;
//         constructor(props: DataTableProps) {
//             super(props);
//             this.state = {
//                 data: [],
//                 filteredData: [],
//                 currentPage: 1,
//                 perPage: props.perPage || 10,
//                 searchQuery: '',
//                 sortColumn: null,
//                 sortOrder: 'asc',
//                 showHeaders: props.showHeaders !== false,
//                 selectedRowIndex: null,
//                 loading: false,
//                 error: null,
//                 total: 0,
//             };
//         }
//
//         componentDidMount() {
//             this.loadData();
//         }
//
//         componentDidUpdate(prevProps: DataTableProps, prevState: DataTableState) {
//             if (this.props.data !== prevProps.data || this.state.perPage !== prevState.perPage) {
//                 this.loadData();
//             }
//             if (this.state.currentPage !== prevState.currentPage && typeof this.props.data === "function") {
//                 this.loadData();
//             }
//         }
//         loadData = () => {
//             this.setState({ loading: true, filteredData: [], selectedRowIndex: null, error: null });
//             try {
//                 const { data, currentPage, perPage } = this.state;
//                 const { data: dataProp } = this.props;
//                 if (typeof dataProp === "function") {
//                     dataProp(currentPage, perPage, (data, total) => {
//                         this.setState({
//                             data: data,
//                             filteredData: data,
//                             loading: false,
//                             total,
//                         });
//                     });
//                 }
//                 else if (Array.isArray(dataProp)) {
//                     this.setState({
//                         data: dataProp,
//                         filteredData: dataProp,
//                         loading: false,
//                         total: dataProp.length,
//                     });
//                 } else {
//                     this.setState({ loading: false });
//                 }
//
//             } catch (e) {
//                 this.setState({ error: "Failed to fetch data. Please try again.", loading: false });
//             }
//         };
//
//
//         handleSearch = (e: Event) => {
//             const searchQuery = (e.target as HTMLInputElement).value;
//             this.setState({ searchQuery }, () => this.debounceFilter());
//
//         };
//
//         debounceFilter = () => {
//             if (this.searchTimeout) {
//                 clearTimeout(this.searchTimeout);
//             }
//             this.searchTimeout = setTimeout(() => {
//                 this.filterData();
//             }, 300);
//         }
//
//         filterData = () => {
//             const { data, searchQuery } = this.state;
//             const filteredData: object[] = [];
//
//             for (let i = 0; i < data.length; i++) {
//                 const item = data[i];
//                 let matchFound = false;
//
//                 for (let key in item) {
//                     if (item.hasOwnProperty(key)) {
//                         const value = String(item[key]).toLowerCase();
//                         if (value.indexOf(searchQuery.toLowerCase()) !== -1) {
//                             matchFound = true;
//                             break;
//                         }
//                     }
//                 }
//                 if (matchFound) {
//                     filteredData.push(item);
//                 }
//             }
//             this.setState({ filteredData, currentPage: 1 });
//         };
//
//         handlePerPageChange = (e: Event) => {
//             const perPage = parseInt((e.target as HTMLSelectElement).value, 10);
//             this.setState({ perPage, currentPage: 1 }, () => this.loadData());
//         };
//
//         handlePageChange = (page: number) => {
//             this.setState({ currentPage: page },() => {
//                 if(typeof this.props.data !== 'function'){
//                     const { filteredData, perPage } = this.state;
//                     const totalPages = Math.ceil(filteredData.length / perPage);
//                     if(page <= totalPages){
//                         this.loadData();
//                     }
//                 }
//             });
//         };
//
//
//         handleSort = (column: string) => {
//             let { sortColumn, sortOrder } = this.state;
//             if (column === sortColumn) {
//                 sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
//             } else {
//                 sortColumn = column;
//                 sortOrder = 'asc';
//             }
//             this.setState({ sortColumn, sortOrder }, () => this.sortData());
//         };
//
//         sortData = () => {
//             const { filteredData, sortColumn, sortOrder } = this.state;
//             if (!sortColumn) return;
//             const sortedData = this.customSort(filteredData, sortColumn, sortOrder);
//             this.setState({ filteredData });
//         };
//
//         customSort = (arr: object[], column: string, order: 'asc' | 'desc'): object[] => {
//             const sorted = [...arr];
//             sorted.sort((a: any, b: any) => {
//                 const aValue = a[column];
//                 const bValue = b[column];
//
//                 if(aValue === null || aValue === undefined){
//                     return order === 'asc' ? -1 : 1;
//                 }
//                 if(bValue === null || bValue === undefined){
//                     return order === 'asc' ? 1 : -1;
//                 }
//
//                 if (typeof aValue === 'number' && typeof bValue === 'number') {
//                     return order === 'asc' ? aValue - bValue : bValue - aValue;
//                 }
//                 if(typeof aValue === 'string' && typeof bValue === 'string'){
//                     if(aValue.toLowerCase() > bValue.toLowerCase()){
//                         return order === 'asc' ? 1 : -1;
//                     }
//                     if(aValue.toLowerCase() < bValue.toLowerCase()){
//                         return order === 'asc' ? -1 : 1;
//                     }
//                     return 0;
//                 }
//
//                 return 0;
//             });
//
//             return sorted;
//         };
//
//         handleRowClick = (index: number) => {
//             this.setState({ selectedRowIndex: index });
//             if (this.props.onRowClick) {
//                 const { filteredData, currentPage, perPage } = this.state;
//                 const actualIndex =  index;
//                 this.props.onRowClick(filteredData[actualIndex]);
//             }
//         };
//
//         handleRetry = () => {
//             this.loadData();
//         };
//
//         render() {
//             const { filteredData, currentPage, perPage, searchQuery, showHeaders, sortColumn, sortOrder, selectedRowIndex, loading, error, total } = this.state;
//             const startIndex = 0;
//             const endIndex = perPage;
//             const currentData = filteredData.slice(startIndex, endIndex);
//             const totalPages = Math.ceil(total / perPage);
//
//             const headers = showHeaders ? this.getHeaders(filteredData) : [];
//
//             return (
//                 <div className="data-table-container">
//                     {/* Loading Overlay */}
//                     {loading && (
//                         <div className="loading-overlay">
//                             <div className="loading-spinner">Loading...</div>
//                         </div>
//                     )}
//
//                     {/* Error handling */}
//                     {error && (
//                         <div className="error-container">
//                             <div className="error-message">{error}</div>
//                             <button className="retry-button" onClick={this.handleRetry}>Retry</button>
//                         </div>
//                     )}
//
//                     {/* Search and Per Page */}
//                     <div className="search-and-perpage">
//                         <label>Search:
//                             <input type="text" value={searchQuery} onChange={this.handleSearch} style={{ marginLeft: '5px' }} />
//                         </label>
//                         <label >Per Page:
//                             <select value={perPage} onChange={this.handlePerPageChange} style={{ marginLeft: '5px' }}>
//                                 {[5, 10, 20, 50].map(val => (
//                                     <option key={val} value={val}>{val}</option>
//                                 ))}
//                             </select>
//                         </label>
//                     </div>
//
//                     <table >
//                         {showHeaders && (
//                             <thead>
//                             <tr>
//                                 {headers.map((header) => (
//                                     <th key={header} onClick={() => this.handleSort(header)}>
//                                         {header}
//                                         {sortColumn === header && (
//                                             <span>{sortOrder === 'asc' ? ' ▲' : ' ▼'}</span>
//                                         )}
//                                     </th>
//                                 ))}
//                             </tr>
//                             </thead>
//                         )}
//                         <tbody>
//                         {currentData.map((item, index) => (
//                             <tr
//                                 key={index}
//                                 onClick={() => this.handleRowClick(index)}
//                                 className={selectedRowIndex === index ? 'selected' : ''}
//                             >
//                                 {headers.map((header, headerIndex) => (
//                                     <td key={headerIndex}>
//                                         {item[header]}
//                                     </td>
//
//                                 ))}
//                             </tr>
//                         ))}
//                         {filteredData.length === 0 && !loading && !error && (
//                             <tr>
//                                 <td colSpan={headers.length} style={{ padding: '8px', textAlign: 'center' }}> No Results Found.</td>
//                             </tr>
//                         )}
//                         </tbody>
//                     </table>
//
//                     {/* Pagination */}
//                     {filteredData.length > 0 && (
//                         <div className="pagination">
//                             <div className="pagination-controls">
//                                 <div className="page-button-container">
//                                     <div className="pagination-button-group">
//                                         <button
//                                             onClick={() => this.handlePageChange(1)}
//                                             disabled={currentPage === 1}
//                                             className={currentPage === 1 ? 'disabled' : ''}
//                                         >
//                                             <i className="angle double left icon"></i>
//                                         </button>
//                                         <button
//                                             onClick={() => this.handlePageChange(currentPage - 1)}
//                                             disabled={currentPage === 1}
//                                             className={currentPage === 1 ? 'disabled' : ''}
//
//                                         >
//                                             <i className="angle left icon"></i>
//                                         </button>
//                                     </div>
//                                     {this.createPaginationButtonsWithEllipsis(totalPages)}
//                                     <div className="pagination-button-group">
//                                         <button
//                                             onClick={() => this.handlePageChange(currentPage + 1)}
//                                             disabled={currentPage === totalPages}
//                                             className={currentPage === totalPages ? 'disabled' : ''}
//
//                                         >
//                                             <i className="angle right icon"></i>
//                                         </button>
//                                         <button
//                                             onClick={() => this.handlePageChange(totalPages)}
//                                             disabled={currentPage === totalPages}
//                                             className={currentPage === totalPages ? 'disabled' : ''}
//                                         >
//                                             <i className="angle double right icon"></i>
//                                         </button>
//                                     </div>
//                                 </div>
//                                 <span className="pagination-info">
//                                 Page {currentPage} of {totalPages}
//                             </span>
//                             </div>
//
//
//                         </div>
//                     )}
//
//
//                 </div>
//             );
//         }
//
//         getHeaders(data: object[]): string[] {
//             if (!data || data.length === 0) {
//                 return [];
//             }
//             const headers: string[] = [];
//             for (let key in data[0]) {
//                 if (data[0].hasOwnProperty(key)) {
//                     headers.push(key);
//                 }
//             }
//             return headers;
//         }
//
//
//         createPaginationButtonsWithEllipsis(totalPages: number) {
//             const buttons: any[] = [];
//             const maxButtons = 5; // Maximum number of page buttons to display
//             const {currentPage} = this.state;
//
//             if (totalPages <= maxButtons) {
//                 // Show all buttons if total pages are less than or equal to maxButtons
//                 for (let i = 1; i <= totalPages; i++){
//                     buttons.push(
//                         <button
//                             key={i}
//                             onClick={() => this.handlePageChange(i)}
//                             className={currentPage === i ? 'active' : ''}
//                         >
//                             {i}
//                         </button>
//                     );
//                 }
//             } else {
//                 // Calculate start and end indices for buttons
//                 let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
//                 let endPage = Math.min(totalPages, startPage + maxButtons - 1);
//
//                 // Adjust startPage if it's too close to the end
//                 if (endPage - startPage + 1 < maxButtons) {
//                     startPage = Math.max(1, endPage - maxButtons + 1);
//                 }
//
//
//                 // Add first button
//                 buttons.push(
//                     <button
//                         key={1}
//                         onClick={() => this.handlePageChange(1)}
//                         className={currentPage === 1 ? 'active' : ''}
//                     >
//                         {1}
//                     </button>
//                 );
//
//                 if(startPage > 2){
//                     buttons.push(<span key="ellipsis-start">...</span>);
//                 }
//
//                 for(let i = startPage; i <= endPage; i++){
//                     if(i > 1 && i < totalPages){
//                         buttons.push(
//                             <button
//                                 key={i}
//                                 onClick={() => this.handlePageChange(i)}
//                                 className={currentPage === i ? 'active' : ''}
//                             >
//                                 {i}
//                             </button>
//                         );
//                     }
//                 }
//
//                 if(endPage < totalPages - 1){
//                     buttons.push(<span key="ellipsis-end">...</span>);
//                 }
//
//                 if(totalPages > 1){
//                     buttons.push(
//                         <button
//                             key={totalPages}
//                             onClick={() => this.handlePageChange(totalPages)}
//                             className={currentPage === totalPages ? 'active' : ''}
//                         >
//                             {totalPages}
//                         </button>
//                     );
//                 }
//
//             }
//
//             return buttons;
//         }
//     }
//
//     const data = [
//         { id: 1, name: 'Apple', category: 'Fruit', price: 0.5, available: true },
//         { id: 2, name: 'Banana', category: 'Fruit', price: 0.3, available: false },
//         { id: 3, name: 'Carrot', category: 'Vegetable', price: 0.7, available: true },
//         { id: 4, name: 'Dragon Fruit', category: 'Fruit', price: 1.2, available: true },
//         { id: 5, name: 'Eggplant', category: 'Vegetable', price: 0.8, available: false },
//         { id: 6, name: 'Fig', category: 'Fruit', price: 0.9, available: true },
//         { id: 7, name: 'Grape', category: 'Fruit', price: 0.4, available: false },
//         { id: 8, name: 'Honeydew', category: 'Fruit', price: 1.1, available: true },
//         { id: 9, name: 'Iceberg Lettuce', category: 'Vegetable', price: 0.6, available: false },
//         { id: 10, name: 'Jackfruit', category: 'Fruit', price: 1.5, available: true },
//         { id: 11, name: 'Kiwi', category: 'Fruit', price: 0.7, available: true },
//         { id: 12, name: 'Lemon', category: 'Fruit', price: 0.4, available: false },
//         { id: 13, name: 'Mango', category: 'Fruit', price: 1, available: true },
//         { id: 14, name: 'Nectarine', category: 'Fruit', price: 0.8, available: true },
//         { id: 15, name: 'Orange', category: 'Fruit', price: 0.6, available: false },
//         { id: 16, name: 'Papaya', category: 'Fruit', price: 0.9, available: true },
//         { id: 17, name: 'Quince', category: 'Fruit', price: 0.7, available: false },
//         { id: 18, name: 'Raspberry', category: 'Fruit', price: 0.5, available: true },
//         { id: 19, name: 'Strawberry', category: 'Fruit', price: 0.3, available: true },
//         { id: 20, name: 'Tomato', category: 'Vegetable', price: 0.7, available: false },
//         { id: 21, name: 'Ugli Fruit', category: 'Fruit', price: 1.2, available: true },
//         { id: 22, name: 'Vanilla Bean', category: 'Fruit', price: 1.1, available: true },
//         { id: 23, name: 'Watermelon', category: 'Fruit', price: 0.8, available: false },
//         { id: 24, name: 'Xigua', category: 'Fruit', price: 1.5, available: true },
//         { id: 25, name: 'Yellow Squash', category: 'Vegetable', price: 0.6, available: true },
//         { id: 26, name: 'Zucchini', category: 'Vegetable', price: 0.9, available: false },
//         { id: 27, name: 'Apple', category: 'Fruit', price: 0.5, available: true },
//         { id: 28, name: 'Banana', category: 'Fruit', price: 0.3, available: false },
//         { id: 29, name: 'Carrot', category: 'Vegetable', price: 0.7, available: true },
//         { id: 30, name: 'Dragon Fruit', category: 'Fruit', price: 1.2, available: true },
//         { id: 31, name: 'Eggplant', category: 'Vegetable', price: 0.8, available: false },
//         { id: 32, name: 'Fig', category: 'Fruit', price: 0.9, available: true },
//         { id: 33, name: 'Grape', category: 'Fruit', price: 0.4, available: false },
//         { id: 34, name: 'Honeydew', category: 'Fruit', price: 1.1, available: true },
//         { id: 35, name: 'Iceberg Lettuce', category: 'Vegetable', price: 0.6, available: false },
//         { id: 36, name: 'Jackfruit', category: 'Fruit', price: 1.5, available: true },
//     ];
//
//     const fetchData = (
//         page:number,
//         perPage:number,
//         callback:(data:object[], total:number) => void
//     ) => {
//         setTimeout(() => {
//             const startIndex = (page - 1) * perPage;
//             const endIndex = startIndex + perPage;
//             const currentPageData = data.slice(startIndex, endIndex);
//             callback(currentPageData, data.length);
//         }, 2500);
//     };
//
//     const handleRowClick = (row: object) => {
//         console.log("Selected Row:", row);
//     };
//
//     return (
//         <div class="vxui" style={{ padding: "0", height: "400px", overflowY: 'auto' }}>
//             <DataTable
//                 data={fetchData}
//                 perPage={5}
//                 onRowClick={handleRowClick}
//             />
//         </div>
//     );
// }

// function XomApp() {
//     interface MultiSelectDropdownProps {
//         options: string[];
//         selectedOptions?: string[];
//         onSelectionChange: (selected: string[]) => void;
//         placeholder?: string;
//         label?: string;
//     }
//
//     interface MultiSelectDropdownState {
//         isOpen: boolean;
//         selected: string[];
//     }
//
//     class MultiSelectDropdown extends Component<MultiSelectDropdownProps, MultiSelectDropdownState> {
//         constructor(props: MultiSelectDropdownProps) {
//             super(props);
//             this.state = {
//                 isOpen: false,
//                 selected: props.selectedOptions || [],
//             };
//         }
//
//         toggleDropdown = () => {
//             this.setState((prevState) => ({ isOpen: !prevState.isOpen }));
//         };
//
//         handleOptionSelect = (option: string) => {
//             const { selected } = this.state;
//             let updatedSelected: string[] = [];
//             let found = false;
//             for(let i = 0; i < selected.length; i++){
//                 if(selected[i] === option){
//                     found = true;
//                 } else {
//                     updatedSelected.push(selected[i]);
//                 }
//             }
//             if(!found){
//                 updatedSelected = [...selected, option];
//             }
//             this.setState({ selected: updatedSelected }, () => {
//                 if (this.props.onSelectionChange) {
//                     this.props.onSelectionChange(updatedSelected);
//                 }
//             });
//         };
//
//         isSelected = (option: string) => {
//             const {selected} = this.state;
//             for (let i = 0; i < selected.length; i++){
//                 if(selected[i] === option){
//                     return true
//                 }
//             }
//             return false;
//         }
//
//         render() {
//             const { options, placeholder, label } = this.props;
//             const { isOpen, selected } = this.state;
//             const displayValue = selected.length > 0 ? selected.join(', ') : placeholder || 'Select Options';
//             const dropdownStyle = isOpen ? {display:'block'} : {display: 'none'}
//
//             return (
//                 <div className="multi-select-dropdown">
//                     {label && <label className="dropdown-label">{label}</label>}
//                     <div className="dropdown-header" onClick={this.toggleDropdown}>
//                         <span className="dropdown-display">{displayValue}</span>
//                         <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>
//                          <i className="dropdown icon"></i>
//                      </span>
//                     </div>
//                     <div className="dropdown-options" style={dropdownStyle}>
//                         {options.map((option) => (
//                             <div
//                                 key={option}
//                                 className={`dropdown-option ${this.isSelected(option) ? 'selected' : ''}`}
//                                 onClick={() => this.handleOptionSelect(option)}
//                             >
//                                 <input
//                                     type="checkbox"
//                                     checked={this.isSelected(option)}
//                                     readOnly
//                                 />
//                                 <span>{option}</span>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             );
//         }
//     }
//
//     interface AppState {
//         selectedFruits: string[];
//         selectedColors: string[];
//     }
//     class App extends Component<{}, AppState> {
//         constructor(props: {}) {
//             super(props);
//             this.state = {
//                 selectedFruits: [],
//                 selectedColors: []
//             };
//         }
//
//         handleFruitChange = (selected: string[]) => {
//             this.setState({ selectedFruits: selected });
//             console.log("Selected Fruits:", selected);
//         };
//
//         handleColorChange = (selected: string[]) => {
//             this.setState({ selectedColors: selected });
//             console.log("Selected Colors:", selected);
//         };
//
//         render() {
//             const fruits = ['Apple', 'Banana', 'Orange', 'Mango', 'Grape'];
//             const colors = ['Red', 'Green', 'Blue', 'Yellow', 'Black'];
//             return (
//                 <div style={{padding: '20px'}}>
//                     <h1>Multi-Select Dropdown</h1>
//                     <MultiSelectDropdown
//                         options={fruits}
//                         onSelectionChange={this.handleFruitChange}
//                         placeholder="Select Fruits"
//                         label="Fruits"
//                     />
//                     <div style={{marginTop: '20px'}}>
//                         Selected Fruits: {this.state.selectedFruits.join(', ')}
//                     </div>
//
//
//                     <div style={{marginTop: '20px'}}>
//                         <MultiSelectDropdown
//                             options={colors}
//                             onSelectionChange={this.handleColorChange}
//                             placeholder="Select Colors"
//                             label="Colors"
//                         />
//                     </div>
//                     <div style={{marginTop: '20px'}}>
//                         Selected Colors: {this.state.selectedColors.join(', ')}
//                     </div>
//                 </div>
//             );
//         }
//     }
//
//     return (
//         <div class="xom">
//             <App />
//         </div>
//     )
// }

// function ZumApp() {
//     function SongNameList() {
//         return (<>
//             <div class="ui relaxed divided list">
//                 <div class="item">
//                     <i class="large music middle aligned icon"></i>
//                     <div class="content">
//                         <a class="header">A Ambaram Umparam</a>
//                     </div>
//                 </div>
//                 <div class="item">
//                     <i class="large music middle aligned icon"></i>
//                     <div class="content">
//                         <a class="header">A Ennil Nooru</a>
//                     </div>
//                 </div>
//                 <div class="item">
//                     <i class="large music middle aligned icon"></i>
//                     <div class="content">
//                         <a class="header">A Inba Kala Mallo</a>
//                     </div>
//                 </div>
//                 <div class="item">
//                     <i class="large music middle aligned icon"></i>
//                     <div class="content">
//                         <a class="header">A Inba Nesare Yesuvin</a>
//                     </div>
//                 </div>
//                 <div class="item">
//                     <i class="large music middle aligned icon"></i>
//                     <div class="content">
//                         <a class="header">A Inba Sabaiye</a>
//                     </div>
//                 </div>
//                 <div class="item">
//                     <i class="large music middle aligned icon"></i>
//                     <div class="content">
//                         <a class="header">A Karththave Thalmaiya</a>
//                     </div>
//                 </div>
//                 <div class="item">
//                     <i class="large music middle aligned icon"></i>
//                     <div class="content">
//                         <a class="header">A Yesuve</a>
//                     </div>
//                 </div>
//                 <div class="item">
//                     <i class="large music middle aligned icon"></i>
//                     <div class="content">
//                         <a class="header">A Yesuve Nan</a>
//                     </div>
//                 </div>
//                 <div class="item">
//                     <i class="large music middle aligned icon"></i>
//                     <div class="content">
//                         <a class="header">A
//                             Yesuve Yesuve</a>
//                     </div>
//                 </div>
//             </div>
//         </>)
//     }
//
//     return (
//         <div class="zum">
//             <SongNameList />
//         </div>
//     );
// }

function ZuxApp() {

    interface Column {
        key: string;
        label: string;
    }

    interface Props {
        columns: Column[];
        showHeader?: boolean;
        maxHeight?: string;
        onSelect?: (row: any) => void;
        dataSource?: (
            page: number,
            pageSize: number,
            callback: (result: any[], total:number, err?: Error | null) => void
        ) => void;
        defaultPageSize?: number;
        pageSizeOptions?: number[]
    }

    interface State {
        sortColumn: string | null;
        sortOrder: 'asc' | 'desc';
        selectedRow: number | null;
        data: any[];
        loading: boolean;
        total: number;
        error: string | null;
        currentPage: number;
        pageSize: number;
    }

    class DataTable extends Component<Props, State> {
        constructor(props: Props) {
            super(props);
            this.state = {
                sortColumn: null,
                sortOrder: 'asc',
                selectedRow: null,
                data: [],
                loading: false,
                total: 0,
                error: null,
                currentPage: 1,
                pageSize: props.defaultPageSize || 10,
            };
        }

        componentDidMount() {
            this.fetchData();
        }

        componentDidUpdate(prevProps: Props, prevState: State) {
            if (
                this.props.dataSource !== prevProps.dataSource ||
                this.state.currentPage !== prevState.currentPage ||
                this.state.pageSize !== prevState.pageSize
            ) {
                this.fetchData();
            }
        }


        fetchData = () => {
            if (this.props.dataSource) {
                this.setState({ loading: true, error: null });
                try {
                    this.props.dataSource(this.state.currentPage, this.state.pageSize, (result, total, err) => {
                        if (err) {
                            this.setState({ error: err.message || 'Error fetching data' });
                            return;
                        }
                        this.setState({ data: result, total });
                    });
                } catch (err) {
                    this.setState({ error: err.message || 'Error fetching data' });
                } finally {
                    this.setState({ loading: false });
                }
            }
        };


        handleSort = (column: string) => {
            this.setState((prevState) => ({
                sortColumn: column,
                sortOrder: prevState.sortColumn === column ? (prevState.sortOrder === 'asc' ? 'desc' : 'asc') : 'asc',
            }));
        };

        handleRowClick = (rowIndex: number) => {
            if (rowIndex !== this.state.selectedRow){
                this.setState({ selectedRow: rowIndex });
                if (this.props.onSelect) {
                    this.props.onSelect(this.state.data[rowIndex]);
                }
            }
        };

        handlePageChange = (newPage: number) => {
            this.setState({currentPage: newPage});
        };

        handlePageSizeChange = (e: any) => {
            const newPageSize = parseInt(e.target.value, 10);
            this.setState({ pageSize: newPageSize, currentPage: 1 });
        };

        sortedData = () => {
            if (!this.state.sortColumn) return this.state.data;
            const multiplier = this.state.sortOrder === 'asc' ? 1 : -1;
            return [...this.state.data].sort((a, b) => {
                const valA = a[this.state.sortColumn];
                const valB = b[this.state.sortColumn];

                if (typeof valA === 'number' && typeof valB === 'number') {
                    return (valA - valB) * multiplier;
                }
                if (typeof valA === 'string' && typeof valB === 'string') {
                    return valA.localeCompare(valB) * multiplier;
                }
                // Handle cases where comparison is not easily done
                if (valA < valB) return -1 * multiplier;
                if (valA > valB) return 1 * multiplier;
                return 0;
            });
        };


        totalPages = () => {
            return Math.ceil(this.state.total / this.state.pageSize);
        };

        render() {
            const {
                columns,
                showHeader = false,
                maxHeight = '100%',
                pageSizeOptions = [5, 10, 20, 50]
            } = this.props;

            return (
                <div class="datatable-wrapper">
                    {this.state.loading && <div class="loading-overlay">Loading...</div>}
                    {this.state.error && <div class="error-overlay">Error: {this.state.error}</div>}
                    <div class="datatable-scrollable" style={{ maxHeight }}>
                        <table class="datatable">
                            {showHeader && (
                                <thead>
                                <tr>
                                    {columns.map((column) => (
                                        <th key={column.key} onClick={() => this.handleSort(column.key)}>
                                            {column.label}
                                            {this.state.sortColumn === column.key && (
                                                <span>{this.state.sortOrder === 'asc' ? ' ▲' : ' ▼'}</span>
                                            )}
                                        </th>
                                    ))}
                                </tr>
                                </thead>
                            )}
                            <tbody>
                            {this.sortedData().map((row, rowIndex) => (
                                <tr
                                    key={rowIndex}
                                    class={
                                        (this.state.selectedRow===rowIndex?'selected-row':(rowIndex%2===0?'even':'odd'))
                                    }
                                    onClick={() => this.handleRowClick(rowIndex)}
                                >
                                    {columns.map((column) => (
                                        <td key={column.key} class="text-ellipsis-cell">{row[column.key]}</td>
                                    ))}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <div class="pagination-controls">
                        <div class="page-size-select">
                            <span>Rows per page: </span>
                            <select
                                value={this.state.pageSize}
                                onChange={this.handlePageSizeChange}
                            >
                                {pageSizeOptions.map(option =>(
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                        <div class="pagination">
                            <button
                                disabled={this.state.currentPage === 1}
                                onClick={() => this.handlePageChange(this.state.currentPage - 1)}
                            >
                                Previous
                            </button>
                            <span>Page {this.state.currentPage} of {this.totalPages()}</span>
                            <button
                                disabled={this.state.currentPage === this.totalPages()}
                                onClick={() => this.handlePageChange(this.state.currentPage + 1)}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            );
        }
    }

    const data = [
        { id: 1, name:'New York New York New York New York' },
        { id: 2, name:'Los AngelesAngelesAngelesAngelesAngeles' },
        { id: 3, name:'Chicago' },
        { id: 4, name:'Houston' },
        { id: 5, name:'Phoenix'},
        { id: 6, name:'Philadelphia' },
        { id: 7, name:'San Antonio' },
        { id: 8, name:'San Diego' },
        { id: 9, name:'Dallas' },
        { id: 10, name:'San Jose' },
        { id: 11, name:'Austin' },
        { id: 12, name:'Jacksonville' },
        { id: 13, name:'Fort Worth' },
        { id: 14, name:'Columbus' },
        { id: 15, name:'San Francisco' },
        { id: 16, name:'Charlotte' },
        { id: 17, name:'Indianapolis' },
        { id: 18, name:'Seattle' },
        { id: 19, name:'Denver' },
        { id: 20, name:'Washington' },
        { id: 21, name:'Boston' },
        { id: 22, name:'El Paso' },
        { id: 23, name:'Nashville' },
        { id: 24, name:'Detroit' },
        { id: 25, name:'Oklahoma City' },
        { id: 26, name:'Portland' },
        { id: 27, name:'Las Vegas' },
        { id: 28, name:'Memphis' },
        { id: 29, name:'Louisville' },
        { id: 30, name:'Baltimore' },
        { id: 31, name:'Milwaukee' },
        { id: 32, name:'Albuquerque' },
        { id: 33, name:'Tucson' },
        { id: 34, name:'Fresno' },
        { id: 35, name:'Sacramento' },
        { id: 36, name:'Mesa' },
        { id: 37, name:'Kansas City' },
        { id: 38, name:'Atlanta' },
        { id: 39, name:'Long Beach' },
        { id: 40, name:'Colorado Springs' },
        { id: 41, name:'Raleigh' },
        { id: 42, name:'Miami' },
        { id: 43, name:'Virginia Beach' },
        { id: 44, name:'Omaha' },
        { id: 45, name:'Oakland' },
        { id: 46, name:'Minneapolis' },
    ];

    const fetchData = (page, pageSize, callback) => {
        setTimeout(() => {
            const allData = data;

            const startIndex = (page - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            const paginatedData = allData.slice(startIndex, endIndex);
            callback(paginatedData, allData.length);
        }, 1000); // simulate delay
    };

    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name' },
    ];

    const handleRowSelection = (selectedRow) => {
        if (selectedRow) {
            console.log('Selected row:', selectedRow);
        }
    };

    return (
        <div class="zux">
            <DataTable
                dataSource={fetchData}
                columns={columns}
                maxHeight='100%'
                showHeader={true}
                onSelect={handleRowSelection}
            />
        </div>
    )
}

function ProgBarComp() {
    interface Props {
        message: string;
        progress: number;
        onClose: () => void;
        duration?: number;
    }

    interface State {
        remaining: number
        intervalId?: number
    }

    class ProgressBarToast extends Component<Props, State> {
        constructor(props: Props) {
            super(props);
            this.state = {
                remaining: props.duration || 5000
            };
        }

        componentDidMount(){
            if (this.props.duration) {
                this.startTimer()
            }
        }
        componentWillUnmount(){
            clearInterval(this.state.intervalId)
        }

        startTimer = () => {
            const intervalId = setInterval(() => {
                this.setState((state)=>({remaining: Math.max(0, state.remaining-100)}),
                    ()=>{
                        if(this.state.remaining<=0){
                            clearInterval(this.state.intervalId)
                            this.handleClose();
                        }
                    });
            }, 100);
            this.setState({ intervalId });
        };

        handleClose = () => {
            if (this.props.onClose) {
                clearInterval(this.state.intervalId)
                this.props.onClose();
            }
        };

        render() {
            const { message, duration } = this.props;
            const { remaining } = this.state;
            const progress = duration ? (1-remaining/(duration||1)) * 100: this.props.progress;
            return (
                <div class="toast">
                    <div class="toast-message">{message}</div>
                    <div class="progress-bar-container">
                        <div class="progress-bar" style={{ width: `${progress}%` }}></div>
                    </div>
                    <button class="toast-close-button" onClick={this.handleClose}>
                        X
                    </button>
                </div>
            );
        }
    }

    const handleToastClose = () => {
        console.log('Toast closed!');
    };

    return (
        <div class="mewo">
            <h1>Progress Bar Toast Component Example</h1>
            <ProgressBarToast
                message="Loading data..."
                progress={50}
                onClose={handleToastClose}
            />
            <ProgressBarToast
                message="Success!"
                duration={2000}
                progress={100}
                onClose={handleToastClose}
            />
            <ProgressBarToast
                message="Processing..."
                progress={80}
                onClose={handleToastClose}
            />
        </div>
    )
}

function CBox() {
    interface Props {
        id: string;
        label: string;
        checked?: boolean;
        onChange?: (checked: boolean) => void;
    }

    interface State {
        checked: boolean;
    }

    class Checkbox extends Component<Props, State> {
        constructor(props: Props) {
            super(props);
            this.state = {
                checked: props.checked || false,
            };
        }

        handleChange = (event: any) => {
            const checked = event.target.checked;
            this.setState({ checked });
            if (this.props.onChange) {
                this.props.onChange(checked);
            }
        };

        render() {
            const { id, label } = this.props;
            return (
                <div class="checkbox-container">
                    <input
                        type="checkbox"
                        id={id}
                        checked={this.state.checked}
                        onChange={this.handleChange}
                    />
                    <label for={id}>{label}</label>
                </div>
            );
        }
    }

    const handleCheckboxChange = (checked: boolean) => {
        console.log('Checkbox changed:', checked);
        // Handle checked status here, for example, setting a state variable.
    };

    return (
        <div class="mmui">
            <Checkbox
                id="my-checkbox-1"
                label="Check this box"
                onChange={handleCheckboxChange}
            />
            <Checkbox
                id="my-checkbox-2"
                label="Another checkbox, initially checked"
                checked={true}
                onChange={handleCheckboxChange}
            />
            <Checkbox
                id="my-checkbox-3"
                label="Without Callback"
            />
        </div>
    )
}

const MdlApp = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
            <button onClick={handleOpenModal}>Open Modal</button>
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title="Settings"
            >
                <p>This is modal content</p>
                <p>You can add any element inside the modal.</p>
            </Modal>
        </div>
    );
};

// function VListComp() {
//     const items = [];
//
//     for (let i = 0; i < 100; i++) {
//         items.push({
//             id: i,
//             text: `Item ${i + 1}`,
//         });
//     }
//
//     const renderRow = (item: any) => {
//         return (<div>{item.text}</div>);
//     };
//
//     return (
//         <div class="x-u-i sel" style={{height: '200px'}}>
//             <VirtualList
//                 data={items}
//                 rowHeight={22}
//                 overscanCount={10}
//                 renderRow={renderRow}
//                 sync
//             />
//         </div>
//     )
// }

// function SliderComp() {
//     const [sliderValue, setSliderValue] = useState(50)
//
//     const handleSliderChange = (value: number) => {
//         setSliderValue(value)
//         console.log('Slider value changed:', value);
//     };
//
//     return (
//         <div class="x-u-i sli">
//             <Slider min={0} max={100} onChange={handleSliderChange} step={10} />
//             <Slider min={0} max={100} value={25} onChange={handleSliderChange} step={5} orientation="vertical" />
//             <Slider min={0} max={100} size="300px" onChange={handleSliderChange} value={sliderValue} step={20} orientation="vertical"/>
//         </div>
//     )
// }

function DTComp({results, onSelect}) {
    const { items, perPage, total, page } = results;

    return (
        <div class="x-u-i pgl" style={{
            width: '100%',
            height: '100%',
        }}>
            <PaginatedList
                items={items}
                itemsPerPage={perPage}
                renderItem={(item: any) => (
                    <span>{item.name}</span>
                )}
                onSelect={onSelect}
            />
        </div>
    )
}

interface Props {
    searchDebounceDelay?: number;
    categories: string[];
    tags: string[];
}

interface State {
    results: {
        items: any[];
        page: number;
        total: number;
        perPage: number;
    };
    searchFilters: SearchFilter[];
    searchQuery?: string;
    searchError?: string;
    searchInProgress: boolean;
    selectedCategory: number;
    selectedTag: number;
    page: number; // index based
    itemsPerPage: number;
}

class _LeftSongsTab_ extends Component<Props, State> {
    private readonly search: (query: string) => void;
    private readonly searchDelayed: (query: string) => void;

    constructor(props: Props) {
        super(props);

        this.props.searchDebounceDelay ??= 200;
        this.state = {
            results: {
                items: [],
                page: 0,
                total: 0,
                perPage: 10,
            },
            searchFilters: [],
            searchQuery: null,
            searchError: null,
            selectedTag: -1,
            selectedCategory: -1,
            searchInProgress: false,
            page: 0,
            itemsPerPage: 10,
        };

        this.search = (query?: string) => {
            this.setState({
                searchError: null,
                searchInProgress: true,
            });

            const filters = [...this.state.searchFilters];

            if (query) {
                filters.push({
                    type: SearchFilterType.TITLE,
                    value: query,
                });
            }

            const opts = { page: this.state.page, limit: this.state.itemsPerPage };

            // @ts-ignore
            songManager.search(filters, opts, (data, err) => {
                if (err) {
                    console.error(err);
                    this.setState({
                        searchError: err.toString(),
                        searchInProgress: false,
                    });
                    return;
                }

                this.setState({
                    searchInProgress: false,
                    results: {
                        ...this.state.results,
                        items: data,
                    }
                });
            });
        };
        this.searchDelayed = debounce(this.search, this.props.searchDebounceDelay);
    }

    componentDidMount() {
        // Initialize the results
        // this.search(null); // don't call it, right tab view wont be ready
    }

    onSearchInput = (e: KeyboardEvent) => {
        const q = (e.target as HTMLInputElement).value;
        this.setState({ searchQuery: q });

        if (e.keyCode === 13) { // Enter key
            this.onSearchGo();
        } else {
            this.searchDelayed(q);
        }
    };

    onSearchGo = () => {
        this.search(this.state.searchQuery);
    };

    onClearQueryAndFilters = () => {
        this.setState({
            searchQuery: '',
            searchFilters: [],
        });
    };

    onCategoryChange = (e: Event) => {
        const filters = [...this.state.searchFilters];

        for (const filter of filters) {
            if (filter.type === SearchFilterType.CATEGORY) {
                filters.splice(filters.indexOf(filter), 1);
                break;
            }
        }

        const categoryIndex = (e.target as HTMLSelectElement).selectedIndex;
        const category = this.props.categories[categoryIndex - 1];

        if (category) {
            filters.push({
                type: SearchFilterType.CATEGORY,
                value: category,
            });
        }

        this.setState({ selectedCategory: categoryIndex, searchFilters: filters });
    };

    onTagChange = (e: Event) => {
        const filters = [...this.state.searchFilters];

        for (const filter of filters) {
            if (filter.type === SearchFilterType.TAGS) {
                filters.splice(filters.indexOf(filter), 1);
                break;
            }
        }

        const tagIndex = (e.target as HTMLSelectElement).selectedIndex;
        const tag = this.props.tags[tagIndex - 1];

        if (tag) {
            filters.push({
                type: SearchFilterType.TAGS,
                value: [tag],
            });
        }

        this.setState({ selectedTag: tagIndex, searchFilters: filters });
    };

    removeSearchFilter = (index: number) => {
        const filters = [...this.state.searchFilters];
        filters.splice(index, 1);
        this.setState({ searchFilters: filters });
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot: any) {
        if (this.state.searchFilters != prevState.searchFilters) {
            this.search(this.state.searchQuery);
        }
    }

    handleSelect = (item: any) => {
        selectedTab.set(1); // make the lyrics tab active if on another tab
        selectedSong.set(item);

        console.log(`Selected Song:`, item);
    };

    render() {
        const { categories, tags } = this.props;
        const { searchQuery, searchFilters, results, selectedCategory, selectedTag, searchInProgress } = this.state;

        return (
            <>
                <div class="left-songs-tab">
                    <div class="flex flex-col h-full w-full">
                        {/* CATEGORY & TAGS */}
                        <div class="flex-[0]">
                            <div class="ui form">
                                <div class="two fields">
                                    <div class="field">
                                        <label>Category</label>
                                        <div class="ui input">
                                            <select
                                                class="ui search dropdown"
                                                onChange={this.onCategoryChange}
                                                value={selectedCategory === -1 ? null : selectedCategory}
                                            >
                                                <option value={null}>All</option>
                                                {categories.map((category, i) => (
                                                    <option value={category} key={i}>{category}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div class="field">
                                        <label>Tag</label>
                                        <div class="ui input">
                                            <select
                                                class="ui search dropdown"
                                                onChange={this.onTagChange}
                                                value={selectedTag === -1 ? null : selectedTag}
                                            >
                                                <option value={null}>All</option>
                                                {tags.map((tag, i) => (
                                                    <option value={tag} key={i}>{tag}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="flex-[0] h-4"></div>

                        {/* Search Input */}
                        <div class="flex-[0]">
                            <div class="ui fluid action input">
                                <input
                                    type="text"
                                    size={20}
                                    id="songnav_editbox"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onKeyUp={this.onSearchInput}
                                />

                                <button
                                    class="ui icon button"
                                    id="song-search-lyrics"
                                    data-tooltip="Search"
                                    onClick={this.onSearchGo}
                                >
                                    <i class="search icon"></i>
                                </button>

                                {/*<button*/}
                                {/*    class="ui icon button"*/}
                                {/*    id="song-search-author"*/}
                                {/*    data-tooltip="Search by Author"*/}
                                {/*    onClick={filterByAuthor}*/}
                                {/*>*/}
                                {/*    <i class="user icon"></i>*/}
                                {/*</button>*/}

                                <button
                                    class="ui icon button"
                                    id="song-search-clear"
                                    data-tooltip="Clear Filters"
                                    onClick={this.onClearQueryAndFilters}
                                >
                                    <i class="times circle icon"></i>
                                </button>
                            </div>
                        </div>

                        {searchInProgress && (
                            <>
                                <div class="flex-[0] h-4"></div>

                                <div class="flex-[0]">
                                    LOADING...
                                </div>
                            </>
                        )}

                        {searchFilters.length > 0 && (
                            <>
                                <div class="flex-[0] h-4"></div>

                                <div class="flex-[0]">
                                    {searchFilters.map((filter, i) => (
                                        <a key={i} class="ui label">
                                            {filter.type === SearchFilterType.CATEGORY && (
                                                <span>Category: {filter.value}</span>
                                            )}
                                            {filter.type === SearchFilterType.TAGS && (
                                                <span>Tag: {filter.value}</span>
                                            )}
                                            <i class="delete icon" onClick={() => this.removeSearchFilter(i)}></i>
                                        </a>
                                    ))}
                                </div>
                            </>
                        )}

                        <div class="flex-[0] h-4"></div>

                        {/* Song List */}
                        {/* TODO: remove overflow auto after setting list to auto height  */}
                        <div class="flex-[1] relative h-full w-full overflow-y-auto">
                            <div class="absolute h-full w-full">
                                <DTComp
                                    results={results}
                                    onSelect={this.handleSelect}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default function LeftSongsTab() {
    const categories = useStoreState(songCategories);
    const tags = useStoreState(songTags);

    return (
        <_LeftSongsTab_
            tags={tags}
            categories={categories}
            searchDebounceDelay={200}
        />
    )
}