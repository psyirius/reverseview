import {Component, ComponentChildren} from "preact";

interface Page<T> {
    id: number;
    items: T[];
}

interface Props<T> {
    // data: {
    //     count: number;
    // },
    // getPage: (page: number, size: number) => T[];
    items: T[];
    itemsPerPage: number;
    renderItem: (item: T) => ComponentChildren;
    onSelect: (item: T) => void;
    selectedItem?: T;
}

interface State<T> {
    loading: boolean;
    currentPage: number;
    // _currentPageItems: Page<T>;
    internalSelectedItem?: T;
}

class PaginatedList<T> extends Component<Props<T>, State<T>> {
    constructor(props: Props<T>) {
        super(props);
        this.state = {
            loading: false,
            currentPage: 1,
            // _currentPageItems: {
            //     id: 1,
            //     items: [],
            // },
            internalSelectedItem: props.selectedItem,
        };
    }

    componentDidUpdate(prevProps: Props<T>) {
        if (prevProps.selectedItem !== this.props.selectedItem) {
            this.setState({ internalSelectedItem: this.props.selectedItem });
        }
    }

    private getPageCount = (): number => {
        return Math.ceil(this.props.items.length / this.props.itemsPerPage);
    };

    private getCurrentPageItems = (): T[] => {
        const startIndex = (this.state.currentPage - 1) * this.props.itemsPerPage;
        const endIndex = startIndex + this.props.itemsPerPage;
        return this.props.items.slice(startIndex, endIndex);
    };

    private handlePageChange = (pageNumber: number) => {
        if (pageNumber >= 1 && pageNumber <= this.getPageCount()) {
            this.setState({ currentPage: pageNumber });
        }
    };

    private handleItemClick = (item: T) => {
        this.setState({ internalSelectedItem: item }, () => {
            if (this.props.onSelect) {
                this.props.onSelect(item);
            }
        });
    };

    private Paginator = () => {
        const pageCount = this.getPageCount();

        if (pageCount <= 1) {
            return null;
        }

        return (
            <div class="pagination-container">
                <button
                    class="pagination-button"
                    disabled={this.state.currentPage === 1}
                    onClick={() => this.handlePageChange(1)}
                    type="button"
                >
                    «
                </button>
                <button
                    class="pagination-button"
                    disabled={this.state.currentPage === 1}
                    onClick={() => this.handlePageChange(this.state.currentPage - 1)}
                    type="button"
                >
                    ‹
                </button>

                <span class="pagination-current-page">
                    {this.state.currentPage} of {pageCount}
                </span>

                <button
                    class="pagination-button"
                    disabled={this.state.currentPage === pageCount}
                    onClick={() => this.handlePageChange(this.state.currentPage + 1)}
                    type="button"
                >
                    ›
                </button>
                <button
                    class="pagination-button"
                    disabled={this.state.currentPage === pageCount}
                    onClick={() => this.handlePageChange(pageCount)}
                    type="button"
                >
                    »
                </button>
            </div>
        );
    };

    render() {
        return (
            <div class="paginated-list-container">
                <ul class="item-list">
                    {this.getCurrentPageItems().map((item, index) => (
                        <li
                            key={index}
                            class={`item-list-item ${
                                this.state.internalSelectedItem === item ? 'selected' : ''
                            }`}
                            onClick={() => this.handleItemClick(item)}
                        >
                            {this.props.renderItem(item)}
                        </li>
                    ))}
                </ul>
                {this.Paginator()}
            </div>
        );
    }
}

export default PaginatedList;