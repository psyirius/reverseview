import {useRef, useState} from "preact/hooks";

function Switch({ label = 'Toggle Me', onChange = null }) {
    const [checked, setChecked] = useState(true);

    function _onChange(e: Event) {
        const { checked } = (e.target as HTMLInputElement);

        setChecked(checked);
        onChange?.(checked);
    }

    return (
        <>
            <div class="relative inline-block">
                <label for="toggle" class="relative inline-flex cursor-pointer items-center">
                    <input type="checkbox" id="toggle" class="peer sr-only" />
                    <div class="peer h-6 w-11 rounded-full bg-gray-200 outline-none transition-all duration-300 peer-checked:bg-blue-600"></div>
                    <span class="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-300 peer-checked:translate-x-5"></span>
                </label>
            </div>

            <div class="swx">
                <div class="flex items-center">
                    <label for="toggle" class="flex cursor-pointer items-center">
                        <div class="relative">
                            <input id="toggle" type="checkbox" class="sr-only" onChange={_onChange}/>
                            <div
                                class={`block h-8 w-14 rounded-full transition-colors  ${checked ? 'bg-blue-400' : 'bg-gray-200'}`}></div>
                            <div class={`absolute left-1 top-1 h-6 w-6 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : ''}`}></div>
                        </div>
                        <span class="ml-3 font-medium text-gray-700">{label}</span>
                    </label>
                </div>
            </div>
        </>
    )
}

function Slider() {
    const elRef = useRef<HTMLDivElement>(null);

    return (
        <>
            <div class="ui range" ref={elRef}>
                <div class='inner'>
                    <div class='track'></div>
                    <div class='track-fill'></div>
                    <div class='thumb'></div>
                </div>
            </div>
        </>
    )
}