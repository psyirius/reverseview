import {Component} from "preact";

class FilterableTable extends Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            category: "All",
            tag: "All",
            searchQuery: "",
            currentPage: 1,
            itemsPerPage: 5,
            selectedRowIndex: null,
            loadingData: false,
            statusMessage: null,
            totalPages: 0,
            data: [],
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


    handleCategoryChange = (event) => {
        this.setState({ category: event.target.value });
    };

    handleTagChange = (event) => {
        this.setState({ tag: event.target.value });
    };

    handleSearchChange = (event) => {
        this.setState({ searchQuery: event.target.value });
    };
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
    handleClearSearch = () => {
        this.setState({ searchQuery: "" });
    };

    handleRowClick = (rowIndex) => {
        this.setState({ selectedRowIndex: rowIndex }, () => {
            if (this.props.onRowSelect) {
                this.props.onRowSelect(this.getDisplayedData()[rowIndex]);
            }
        });
    };
    renderPagination() {
        const { currentPage, totalPages, itemsPerPage } = this.state;
        if (totalPages <= 1) {
            return null; // Hide pagination if only one or zero pages
        }

        return (
            <div className="pagination">
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
                <button
                    disabled={currentPage === 1}
                    onClick={this.handlePreviousPageClick}
                >
                    prev
                </button>
                <span>
                    {currentPage} / {totalPages}
                </span>
                <button
                    disabled={currentPage === totalPages}
                    onClick={this.handleNextPageClick}
                >
                    next
                </button>
            </div>
        );
    }


    render() {
        const { category, tag, searchQuery, selectedRowIndex, loadingData, statusMessage } = this.state;
        const displayedData = this.getDisplayedData();
        const {columns} = this.props;
        return (
            <div class="filterable-table-container">
                {loadingData && <div class="loading-overlay"><div class="loading-indicator">Loading...</div></div>}
                {statusMessage && <div class="status-message">{statusMessage}</div>}
                <div className="filters">
                    <form>
                        <div className="filter-group">
                            <label htmlFor="category">Category</label>
                            <select id="category" value={category} onChange={this.handleCategoryChange}>
                                <option value="All">All</option>
                                <option value="Category 1">Category 1</option>
                                <option value="Category 2">Category 2</option>
                                {/* Add more options as needed */}
                            </select>
                        </div>
                        <div className="filter-group">
                            <label htmlFor="tag">Tag</label>
                            <select id="tag" value={tag} onChange={this.handleTagChange}>
                                <option value="All">All</option>
                                <option value="Tag 1">Tag 1</option>
                                <option value="Tag 2">Tag 2</option>
                                {/* Add more options as needed */}
                            </select>
                        </div>
                        <div class="search-group">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={this.handleSearchChange}
                            />
                            {searchQuery && (
                                <button class="clear-search-button" type="button" onClick={this.handleClearSearch}>
                                    ✖
                                </button>
                            )}
                        </div>
                        <div class="buttons-group">
                            <button type="button" class="icon-button">
                                
                            </button>
                            <button type="button" class="icon-button">
                                
                            </button>
                            <button type="button" class="icon-button">
                                ✖
                            </button>
                        </div>
                    </form>
                </div>
                <div class="table-wrapper">
                    <table class="data-table">
                        <thead>
                        <tr>
                            {columns.map((column, index) => (
                                <th key={index}>{column.header}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {displayedData.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} class="no-results">
                                    No results found.
                                </td>
                            </tr>
                        ) : (displayedData.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                onClick={() => this.handleRowClick(rowIndex)}
                                className={rowIndex === selectedRowIndex ? "selected" : ""}
                            >
                                {columns.map((column, colIndex) => (
                                    <td key={colIndex}>{row[column.field]}</td>
                                ))}
                            </tr>
                        )))}
                        </tbody>
                    </table>
                </div>
                {this.renderPagination()}
            </div>
        );
    }
}

export default FilterableTable;