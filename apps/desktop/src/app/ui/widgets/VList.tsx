import {Component} from "preact";
import {console} from "@/platform/adapters/air";

// interface Props {
//     items: any[];
//     itemHeight: number;
//     renderItem: (item: any, index: number) => any;
//     height?: string;
// }
//
// interface State {
//     scrollTop: number;
// }
//
// class VirtualList extends Component<Props, State> {
//     containerRef: HTMLDivElement | null;
//
//     constructor(props: Props) {
//         super(props);
//         this.state = {
//             scrollTop: 0,
//         };
//         this.containerRef = null
//     }
//
//     componentDidMount() {
//         if (this.containerRef) {
//             this.containerRef.addEventListener('scroll', this.handleScroll);
//             this.handleScroll();
//         }
//     }
//
//     componentWillUnmount() {
//         if (this.containerRef) {
//             this.containerRef.removeEventListener('scroll', this.handleScroll);
//         }
//     }
//
//     setRef = (element: any) => {
//         this.containerRef = element;
//
//         if (element) {
//             this.handleScroll()
//         }
//     };
//
//     handleScroll = () => {
//         // console.log('handleScroll', this.containerRef);
//
//         if (this.containerRef) {
//             this.setState({ scrollTop: this.containerRef.scrollTop });
//         }
//     };
//
//     render() {
//         const {items, itemHeight, renderItem, height = '400px'} = this.props;
//         const { scrollTop } = this.state;
//
//         const visibleItems = Math.ceil(parseInt(height, 10) / itemHeight);
//         const startIndex = Math.floor(scrollTop / itemHeight);
//         const endIndex = Math.min(startIndex + visibleItems, items.length);
//
//         const itemsToRender = items.slice(startIndex, endIndex);
//
//         console.log('render', items.length, itemHeight, height, scrollTop);
//         console.log('itemsToRender', itemsToRender);
//
//         return (
//             <div class="virtual-list-container" style={{height}}
//                  ref={this.setRef}
//             >
//                 <div class="virtual-list-scrollable" style={{height: items.length * itemHeight + 'px'}}>
//                     {itemsToRender.map((item, index) => {
//                         const absoluteIndex = startIndex + index
//
//                         return (
//                             <div
//                                 key={absoluteIndex}
//                                 style={{
//                                     position: 'absolute',
//                                     top: absoluteIndex * itemHeight + 'px'
//                                 }}
//                             >
//                                 {renderItem(item, absoluteIndex)}
//                             </div>
//                         )
//                     })}
//                 </div>
//             </div>
//         );
//     }
// }
//
// export default VirtualList;

interface Props {
    items: any[];
    itemHeight: number;
    renderItem: (item: any, index: number) => any;
    containerHeight: number;
}

interface State {
    startIndex: number;
    endIndex: number;
}

class VirtualList extends Component<Props, State> {
    scrollContainerRef: HTMLElement | null;

    constructor(props: Props) {
        super(props);
        this.state = {
            startIndex: 0,
            endIndex: this.calculateEndIndex(props, 0),
        };
        this.scrollContainerRef = null;
    }

    componentDidUpdate(prevProps: Props) {
        if (prevProps.items !== this.props.items) {
            this.setState({
                startIndex: 0,
                endIndex: this.calculateEndIndex(this.props, 0),
            })
        }
    }

    calculateEndIndex = (props: Props, startIndex: number) => {
        const visibleItemsCount = Math.ceil(props.containerHeight / props.itemHeight);
        return Math.min(startIndex + visibleItemsCount, props.items.length);
    };

    handleScroll = () => {
        if (this.scrollContainerRef) {
            const scrollTop = this.scrollContainerRef.scrollTop;
            const startIndex = Math.floor(scrollTop / this.props.itemHeight);
            const endIndex = this.calculateEndIndex(this.props, startIndex);
            this.setState({startIndex, endIndex});
        }
    };

    setScrollContainerRef = (element: HTMLElement) => {
        this.scrollContainerRef = element;
    }

    render() {
        const {items, itemHeight, renderItem, containerHeight} = this.props;
        const {startIndex, endIndex} = this.state;

        const visibleItems = items.slice(startIndex, endIndex);

        const paddingTop = startIndex * itemHeight;
        const paddingBottom = (items.length - endIndex) * itemHeight;

        return (
            <div
                class="virtual-list-container"
                style={{height: containerHeight + 'px', overflowY: 'auto'}}
                ref={this.setScrollContainerRef}
                onScroll={this.handleScroll}
            >
                <div style={{paddingTop: paddingTop + 'px', paddingBottom: paddingBottom + 'px'}}>
                    {visibleItems.map((item, index) => (
                        <div
                            key={startIndex + index}
                            class="virtual-list-item"
                            style={{height: itemHeight + 'px'}}
                        >
                            {renderItem(item, startIndex + index)}
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default VirtualList;