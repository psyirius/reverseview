import {Component, ComponentChildren, createRef, RefObject, RenderableProps, VNode} from "preact";
import {createResizeSensor} from "@app/ui/utils/resize-observer";

interface Props<T> {
    onSelect: (song: any) => void;
    items: T[],
    itemsPerPageOptions?: number[];
    defaultItemsPerPage?: number;
    emptyListMessage?: string;
    renderItem: (item: T, index: number) => ComponentChildren; // Function to render each item
}

interface State<T> {
    loading: boolean;
    currentPage: number;
    itemsPerPage: number;
    internalSelectedItem?: T;
}

export default class PaginatedSongSelect<T = any> extends Component<Props<T>, State<T>> {
    private readonly divRef: RefObject<HTMLDivElement>;

    constructor(props: Props<T>) {
        super(props);
        this.state = {
            loading: true,
            currentPage: 1,
            itemsPerPage: props.defaultItemsPerPage || 10,
        };
        this.divRef = createRef();
    }

    DEFAULT_ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50, 100];
    ITEM_HEIGHT = 37;

    componentWillMount() {
        // this.setState({
        //     loading: false,
        // });
    }

    componentDidMount() {
        createResizeSensor(this.divRef.current, ({width, height}) => {
            this.setState({
                itemsPerPage: Math.floor(height / this.ITEM_HEIGHT),
            });
        });
    }

    private onItemsPerPageChange = (event: Event) => {
        this.setState({
            itemsPerPage: parseInt((event.target as HTMLSelectElement).value),
        });
    };

    private getPageCount = (): number => {
        return Math.ceil(this.props.items.length / this.state.itemsPerPage);
    };

    onSelectItem = (item: any) => {
        this.props.onSelect(item);
    };

    private handlePageChange = (pageNumber: number) => {
        if (pageNumber >= 1 && pageNumber <= this.getPageCount()) {
            this.setState({ currentPage: pageNumber });
        }
    };

    private Paginator = () => {
        const pageCount = this.getPageCount();

        if (pageCount <= 1) {
            return null;
        }

        return (
            <div class="flex flex-row justify-between items-center w-full h-full">
                <div>
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
                </div>

                {/* 138px is good for 9999999 */}
                <div
                    class="inline-block px-1 max-w-[138px] overflow-hidden text-ellipsis whitespace-nowrap"
                    data-tooltip={
                        `${(this.state.currentPage - 1) * this.state.itemsPerPage + 1}-${Math.min(this.state.currentPage * this.state.itemsPerPage, this.props.items.length)} of ${this.props.items.length} items`
                    }
                >
                    <span class="text-black">{this.state.currentPage}</span>
                    &nbsp;
                    <span class="text-[#555]">of {pageCount}</span>
                </div>

                <div>
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
            </div>
        );
    };

    private getCurrentPageItems = (): T[] => {
        const startIndex = (this.state.currentPage - 1) * this.state.itemsPerPage;
        const endIndex = startIndex + this.state.itemsPerPage;
        return this.props.items.slice(startIndex, endIndex);
    };

    private handleItemClick = (item: T) => {
        this.setState({ internalSelectedItem: item }, () => {
            if (this.props.onSelect) {
                this.props.onSelect(item);
            }
        });
    };

    render(props?: RenderableProps<Props<T>, any>, state?: Readonly<State<T>>, context?: any): ComponentChildren {
        const itemsPerPageOptions = props.itemsPerPageOptions ?? this.DEFAULT_ITEMS_PER_PAGE_OPTIONS;

        return (
            // <div>
            //     <div>
            //         <select value={state.itemsPerPage} onChange={this.onItemsPerPageChange}>
            //             {props.itemsPerPageOptions?.map(option => (
            //                 <option value={option}>{option}</option>
            //             ))}
            //         </select>
            //     </div>
            //     <div>
            //         {props.items.length === 0 ? (
            //             <div>{props.emptyListMessage || "No items found"}</div>
            //         ) : (
            //             <div>
            //                 {props.items.slice((state.currentPage - 1) * state.itemsPerPage, state.currentPage * state.itemsPerPage).map((item, index) => (
            //                     <div onClick={() => props.onSelect(item)}>{props.renderItem(item, index)}</div>
            //                 ))}
            //             </div>
            //         )}
            //     </div>
            // </div>

            <div class="flex flex-col h-full w-full x-u-i pgssl">
                {/* List */}
                <div class="flex-[1] relative h-full w-full overflow-y-auto" style={{
                    border: '1px solid rgba(34, 36, 38, .15)',
                    borderRadius: '0.28571429rem',
                    borderBottomRightRadius: 0,
                    borderBottomLeftRadius: 0,
                    borderBottom: 'none',
                }}>
                    <div class="flex flex-col absolute h-full w-full">
                        <div class="h-full w-full" ref={this.divRef}>
                            <ul class="item-list">
                                {this.getCurrentPageItems().map((item, index) => (
                                    <li
                                        key={index}
                                        class={`item-list-item ${
                                            this.state.internalSelectedItem === item ? 'selected' : ''
                                        }`}
                                        onClick={() => this.handleItemClick(item)}
                                    >
                                        {this.props.renderItem(item, index)}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Pagination */}
                <div class="flex-[0] h-12">
                    <div class="flex flex-row justify-between items-center w-full h-full p-2 bg-[#f7f7f7]" style={{
                        border: '1px solid rgba(34, 36, 38, .15)',
                        borderRadius: '0.28571429rem',
                        borderTopRightRadius: 0,
                        borderTopLeftRadius: 0,
                    }}>
                        {/*<select value={state.itemsPerPage} onChange={this.onItemsPerPageChange}>*/}
                        {/*    {itemsPerPageOptions.map(option => (*/}
                        {/*        <option value={option}>{option}</option>*/}
                        {/*    ))}*/}
                        {/*</select>*/}

                        {this.Paginator()}
                    </div>
                </div>
            </div>
        );
    }
}