import {useEffect, useState} from "preact/hooks";
import {console} from "@/platform/adapters/air";

export default function SlidePreviewItem({
    index,
    slide,
    onDoubleClickOnSlide,
    onClickOnSlide,
    isPresentingSlide,
    isActiveSlide,
}) {
    const [selectedPreview, setSelectedPreview] = useState(0);

    useEffect(() => {
        console.log('SlidePreviewItem:', slide);
    }, [selectedPreview]);

    return (
        <div
            class="inline-block float-left m-[1px] cursor-pointer rounded-md"
            style={{
                // width: 0, height: 0, // 3:2
                // width: 0, height: 0, // 4:3
                width: 352, height: 198, // 16:9
                // width: 462, height: 198, // 21:9

                borderStyle: 'solid',
                borderWidth: '2px',
                borderColor: isPresentingSlide(index) ? '#fc5c65' : (
                    isActiveSlide(index) ? '#45aaf2' : 'rgba(34, 36, 38, .15)'
                ),
            }}
            // onContextMenu={showContextMenu}
            onClick={(e) => onClickOnSlide(e, index)}
            onDblClick={(e) => onDoubleClickOnSlide(e, index)}
        >
            <div class="flex flex-col h-full w-full">
                <div class="flex-1 h-full w-full relative">
                    <div
                        class="absolute h-full w-full cursor-pointer overflow-hidden"
                        role="button"
                        // tabIndex={0}
                        // style="-khtml-user-select:auto;"
                    >
                        {slide[selectedPreview] ? (
                            <div
                                class="flex flex-col justify-center items-center text-center h-full"
                                style={{
                                    fontFamily: slide[selectedPreview].font,
                                    fontSize: '1rem',
                                }}
                            >
                                <p class="m-0" dangerouslySetInnerHTML={{__html: slide[selectedPreview].content}}></p>
                            </div>
                        ) : (
                            <div class="flex flex-col justify-center items-center text-center h-full">
                                <div class="ui visible message">
                                    <p>No content</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div
                    class="flex flex-row h-8 w-full justify-between items-center px-2 rounded-b-[3px]"
                    style={{
                        backgroundColor: 'rgba(34, 36, 38, .15)',
                    }}
                >
                    {/* Slide Number */}
                    <div
                        class="ui tiny label"
                    >
                        {index + 1}
                    </div>

                    {/* Slide variant switcher */}
                    <div class=""> {/* This div should exist for justify to always work */}
                        {slide.map((_: any, j: number) => (
                            <a
                                key={j}
                                class={`ui tiny basic label`}
                                onClick={() => setSelectedPreview(j)}
                                style={(j === selectedPreview) ? {
                                    backgroundColor: 'white',
                                    borderColor: '#45aaf2',
                                    color: '#45aaf2',
                                } : {}}
                            >
                                {j + 1}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}