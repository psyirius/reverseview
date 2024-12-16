import {useState} from "preact/hooks";

export type ScrollableSelectItem = {
    label: string;
    value: string;
}

export type ScrollableSelectProps = {
    items: ScrollableSelectItem[];
    selectedItem?: number;
    onSelectItem?: (index: number, item: ScrollableSelectItem) => void;
}

export default function ScrollableSelect({ items, selectedItem, onSelectItem }: ScrollableSelectProps) {
    function _onSelectItem(index: number, item: ScrollableSelectItem) {
        onSelectItem?.(index, item);
    }

    return (
        <div class="ui middle aligned selection list scrollable bg-white" style={{height: '100%'}}>
            {items.map((item, i) => (
                <div
                    key={i}
                    class={`item ${i === selectedItem ? 'active' : ''}`}
                    onClick={() => _onSelectItem(i, item)}
                >
                    <div class="content">
                        {item.label}
                    </div>
                </div>
            ))}
        </div>
    );
}