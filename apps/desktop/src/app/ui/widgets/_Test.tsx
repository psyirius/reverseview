import {Component} from "preact";
import VirtualList from "@app/ui/widgets/VirtualList";

// Generate 100,000 rows of data
const DATA = [];
for (let x=1e5; x--; ) DATA[x] = `Item #${x+1}`;

class Demo extends Component {
    // 30px tall rows
    rowHeight = 30;

    // Renders a single row
    renderRow(row) {
        return <div class="row">{row}</div>;
    }

    render() {
        return (
            <VirtualList sync class="list"
                 data={DATA}
                 rowHeight={this.rowHeight}
                 renderRow={this.renderRow}
            />
        );
    }
}

export default Demo;