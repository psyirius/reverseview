import {useEffect, useRef, useState} from "preact/hooks";

interface ColorInputProps {
    value: string;
    resetValue?: string;
    onChange?: (value: string) => void;
}

export default function ColorInput({ value, resetValue, onChange }: ColorInputProps) {
    const pickerRef = useRef<HTMLButtonElement>(null);

    const [color, setColor] = useState(value);

    useEffect(() => {
        // @ts-ignore
        $(pickerRef.current).spectrum('set', color);

        setColor(value);
    }, [value]);

    useEffect(() => {
        // @ts-ignore
        $(pickerRef.current).spectrum({
            color,
            showAlpha: false,
            showInitial: true,
            showInput: true,
            showButtons: false,
            preferredFormat: "hex",
            change: function(color: any) {
                _setColor(color.toHexString(), true);
            },
        });
    }, []);

    function _setColor(color: string, update = false) {
        // @ts-ignore
        $(pickerRef.current).spectrum('set', color);

        if (update) {
            setColor(color);
            onChange?.(color);
        }
    }

    function onColorInput(e: Event, update = false) {
        const { value } = (e.target as HTMLInputElement);
        const color = $Y.Color.toRGB(value);
        const hex = $Y.Color.toHex(color);

        _setColor(hex, update);
    }

    function onColorInputBlur(e: Event) {
        onColorInput(e, true);
    }

    function onColorInputKeyUp(e: KeyboardEvent) {
        if (e.keyCode === 13 /* Enter */) {
            onColorInput(e, true);
        }
    }

    function onColorReset() {
        _setColor(resetValue, true);
    }

    // parent must be a field
    return (
        <div class="ui action input">
            <input
                type="text"
                value={color}
                onInput={e => onColorInput(e)}
                onBlur={e => onColorInputBlur(e)}
                onKeyUp={e => onColorInputKeyUp(e)}
            />

            <button
                class="ui right icon button"
                style={{
                    borderStyle: 'solid',
                    borderWidth: '1px',
                    borderColor: 'rgba(34, 36, 38, 0.148438)',
                    backgroundColor: color,
                }}
                ref={pickerRef}
            >
                <i class="icon"></i>
            </button>

            {resetValue && (
                <button
                    class="ui icon button"
                    onClick={() => onColorReset()}
                    data-tooltip="Reset">
                    <i class="undo icon"></i>
                </button>
            )}
        </div>
    );
}