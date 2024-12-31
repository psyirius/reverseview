import {Component, VNode} from 'preact';

/// https://github.com/developit/preact-virtual-list

const STYLE_INNER = 'position:relative; overflow:hidden; width:100%; min-height:100%;';

const STYLE_CONTENT = 'position:absolute; top:0; left:0; height:100%; width:100%; overflow:visible;';

/** Virtual list, renders only visible items.
 *    @param data           List of data items
 *    @param renderRow      Renders a single row
 *    @param rowHeight      Static height of a row
 *    @param overscanCount  Amount of rows to render above and below visible area of the list
 *    @param [sync=false]   true forces synchronous rendering
 *
 *    @example
 *    ```jsx
 *        <VirtualList
 *            data={['a', 'b', 'c']}
 *            renderRow={ row => <div>{row}</div> }
 *            rowHeight={22}
 *            sync
 *        />
 *    ```
 */
interface Props {
    data: any[];
    rowHeight: number;
    renderRow: (row: any) => VNode;
    overscanCount: number;
    sync: boolean;
    [key: string]: any;
}

interface State {
    height: number;
    offset: number;
}

export default class VirtualList extends Component<Props, State> {
    resize = () => {
        if (this.state.height !== this.base.offsetHeight) {
            this.setState({height: this.base.offsetHeight});
        }
    };

    handleScroll = () => {
        this.setState({ offset: this.base.scrollTop });

        if (this.props.sync) this.forceUpdate();
    };

    componentDidUpdate() {
        this.resize();
    }

    componentDidMount() {
        this.resize();
        addEventListener('resize', this.resize);
    }

    componentWillUnmount() {
        removeEventListener('resize', this.resize);
    }

    render({
       data,
       rowHeight,
       renderRow,
       overscanCount = 10,
       sync,
       ...props
    }, {
        offset = 0,
        height = 0
    }) {
        // first visible row index
        let start = (offset / rowHeight) | 0;

        // actual number of visible rows (without overscan)
        let visibleRowCount = (height / rowHeight) | 0;

        // Overscan: render blocks of rows modulo an overscan row count
        // This dramatically reduces DOM writes during scrolling
        if (overscanCount) {
            start = Math.max(0, start - (start % overscanCount));
            visibleRowCount += overscanCount;
        }

        // last visible + overscan row index
        let end = start + 1 + visibleRowCount;

        // data slice currently in viewport plus overscan items
        let selection = data.slice(start, end);

        return (
            <div onScroll={this.handleScroll} {...props}> {/* Container */}
                <div style={`${STYLE_INNER} height:${data.length * rowHeight}px;`}>
                    <div style={`${STYLE_CONTENT} top:${start * rowHeight}px;`}>
                        {selection.map(renderRow)}
                    </div>
                </div>
            </div>
        );
    }
}