import {useEffect, useRef} from "preact/hooks";

export type ScrollableSelectItem = {
    label: string;
    value: string;
    meta?: string;
    [key: string]: any;
}

export type ScrollableSelectProps = {
    items: ScrollableSelectItem[];
    selectedItem?: number;
    onSelectItem?: (index: number, item: ScrollableSelectItem) => void;
    renderItem?: (item: ScrollableSelectItem) => any;
}

export default function ScrollableSelect({ items, selectedItem, onSelectItem, renderItem }: ScrollableSelectProps) {
    const ref = useRef<HTMLDivElement>(null);

    function _onSelectItem(index: number, item: ScrollableSelectItem) {
        onSelectItem?.(index, item);
    }

    useEffect(() => {
        // TODO: scroll to active item
    }, []);

    function _renderItem(item: ScrollableSelectItem) {
        return renderItem ? renderItem(item) : (
            <div class="content">
                <div class="header">{item.label}</div>
                {item.meta && <div class="meta">{item.meta}</div>}
            </div>
        );
    }

    return (
        <div ref={ref} class="ui middle aligned selection list scrollable bg-white" style={{height: '100%'}}>
            {items.map((item, i) => (
                <div
                    key={i}
                    class={`item ${i === selectedItem ? 'active' : ''}`}
                    onClick={() => _onSelectItem(i, item)}
                >
                    {_renderItem(item)}
                </div>
            ))}
        </div>
    );
}