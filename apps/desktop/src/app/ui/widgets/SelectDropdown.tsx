import {Component, createRef} from "preact";


interface Item {
    id: number;
    text: string;
    [key: string]: any;
}

interface Props {
    items: Item[];
    onItemSelected: (item: Item | null) => void;
    renderItem?: (item: Item) => any;
    selectedItemId?: number | null;
    placeholder?: string;
    clearable?: boolean;
    searchable?: boolean;
}

interface State {
    isOpen: boolean;
    selectedItemId: number | null;
    searchText: string;
}

// TODO:
//  - Scroll to Selected Item
//  - Virtualized List
//  - Proper Styling
//  - Fix Initial Selection
class SelectDropdown extends Component<Props, State> {
    listRef = createRef<HTMLDivElement>();
    dropdownRef = createRef<HTMLDivElement>();
    searchRef = createRef<HTMLInputElement>();

    constructor(props: Props) {
        super(props);
        this.state= {
            isOpen: false,
            selectedItemId: this.props.selectedItemId || null,
            searchText: "",
        };
    }

    toggleDropdown = () => {
        this.setState((prevState) => ({ isOpen: !prevState.isOpen }));
        if (this.props.searchable && this.state.isOpen === false && this.searchRef.current) {
            this.searchRef.current.focus();
        }
    };
    clearSelection = (e: MouseEvent) => {
        e.stopPropagation();
        this.setState({ selectedItemId: null, searchText: "" }, () => {
            if (this.props.onItemSelected) {
                this.props.onItemSelected(null);
            }
        });
    };

    handleItemClick = (item: Item) => {
        this.setState({ selectedItemId: item.id, isOpen: false, searchText: "" });
        this.props.onItemSelected(item);
    };

    renderItem = (item: Item) => {
        return (
            this.props.renderItem
                ? this.props.renderItem(item)
                : item.text
        );
    };

    handleOutsideClick = (e: MouseEvent) => {
        if (
            this.dropdownRef.current &&
            !this.dropdownRef.current.contains(e.target as Node)
        ) {
            this.setState({ isOpen: false });
        }
    };
    handleSearchChange = (e: Event) => {
        this.setState({ searchText: (e.target as HTMLInputElement).value });
    };
    componentDidMount() {
        document.addEventListener("mousedown", this.handleOutsideClick);
        if (this.listRef.current) {
            this.listRef.current.scrollTop = 0;
        }
    }
    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleOutsideClick);
    }

    getDisplayText = () => {
        const { items, placeholder } = this.props;
        const { selectedItemId } = this.state;

        if (selectedItemId === null) {
            return placeholder || "Select an Item";
        }
        let selectedItem = null;
        for (let i = 0; i < items.length; i++) {
            if (items[i].id === selectedItemId) {
                selectedItem = items[i];
                break;
            }
        }

        return selectedItem ? selectedItem.text : placeholder || "Select an Item";
    };
    filterItems = (items: Item[]): Item[] => {
        const { searchText } = this.state;
        if (!searchText) {
            return items;
        }
        const lowercasedSearchText = searchText.toLowerCase();
        return items.filter(item => {
            return item.text.toLowerCase().indexOf(lowercasedSearchText) !== -1;
        })
    };

    render() {
        const { items, placeholder, clearable, searchable } = this.props;
        const { isOpen, selectedItemId, searchText } = this.state;
        const filteredItems = this.filterItems(items);

        return (
            <div className="xyz-dd-sel select-dropdown" ref={this.dropdownRef}>
                <div className="select-dropdown-header" onClick={this.toggleDropdown}>
                    {this.getDisplayText()}
                    {clearable && selectedItemId !== null && (
                        <span className="select-dropdown-clear" onClick={this.clearSelection}>×</span>
                    )}
                </div>

                {isOpen && (
                    <div className="select-dropdown-list-container">
                        {searchable && (
                            <div className="select-dropdown-search">
                                <input
                                    type="text"
                                    placeholder="Search items"
                                    value={searchText}
                                    onInput={this.handleSearchChange}
                                    ref={this.searchRef}
                                />
                            </div>
                        )}
                        <div className="select-dropdown-list" ref={this.listRef}>
                            {filteredItems.map((item) => (
                                <div
                                    key={item.id}
                                    className={`select-dropdown-item ${
                                        selectedItemId === item.id ? 'selected' : ''
                                    }`}
                                    onClick={() => this.handleItemClick(item)}
                                >
                                    {this.renderItem(item)}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default SelectDropdown;