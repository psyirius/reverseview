import {useEffect, useId, useRef} from "preact/hooks";

export type ScrollableSelectItem = {
    label: string;
    value: string;
    meta?: string;
}

export type ScrollableSelectProps = {
    items: ScrollableSelectItem[];
    selectedItem?: number;
    onSelectItem?: (index: number, item: ScrollableSelectItem) => void;
}

export default function ScrollableSelect({ items, selectedItem, onSelectItem }: ScrollableSelectProps) {
    const ref = useRef<HTMLDivElement>(null);

    function _onSelectItem(index: number, item: ScrollableSelectItem) {
        onSelectItem?.(index, item);
    }

    useEffect(() => {
        // TODO: scroll to active item
    }, []);

    return (
        <div ref={ref} class="ui middle aligned selection list scrollable bg-white" style={{height: '100%'}}>
            {items.map((item, i) => (
                <div
                    key={i}
                    class={`item ${i === selectedItem ? 'active' : ''}`}
                    onClick={() => _onSelectItem(i, item)}
                >
                    <div class="content">
                        <div class="header">{item.label}</div>
                        {item.meta && <div class="meta">{item.meta}</div>}
                    </div>
                </div>
            ))}
        </div>
    );
}