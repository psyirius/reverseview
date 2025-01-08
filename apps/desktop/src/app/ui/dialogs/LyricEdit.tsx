import {useEffect, useRef, useState} from "preact/hooks";
import {useStoreState} from "@/utils/hooks";
import {showLyricEditPanel} from "@stores/global";
import {$RvW} from "@/rvw";
import Modal from "@app/ui/Modal";

const DEFAULT_DELIMITER = '\\n\\n\\n';

function unescapeSlidesDelimiter(delimiter: string) {
    let res = "";

    for (let i = 0; i < delimiter.length; i++) {
        if (delimiter[i] === '\\') {
            i++;
            switch (delimiter[i]) {
                case 'n': res += '\n'; break;
                case 'r': res += '\r'; break;
                case 'v': res += '\v'; break;
                case 't': res += '\t'; break;
                case '\\': res += '\\'; break;
                case 's': res += ' '; break;
                case '0': res += '\0'; break;
                case 'x': {
                    res += String.fromCharCode(parseInt(delimiter.substr(i + 1, 2), 16));
                    i += 2;
                    break;
                }
                case 'u': {
                    res += String.fromCharCode(parseInt(delimiter.substr(i + 1, 4), 16));
                    i += 4;
                    break;
                }
                default: res += delimiter[i]; break;
            }
        } else {
            res += delimiter[i];
        }
    }

    return res;
}

interface Props {
    slides: [string[], string[]];
    fonts: [string, string];
    onSubmit: (slides: [string[], string[]]) => void;
}

export default function LyricEditDialog(props: Props) {
    const open = useStoreState(showLyricEditPanel);

    const [slideDelimiter, setSlideDelimiter] = useState(DEFAULT_DELIMITER);
    const [trimEmpty, setTrimEmpty] = useState(
        $RvW.rvwPreferences.get("app.state.song.create.trim_empty", true)
    );
    const [trimSlides, setTrimSlides] = useState(
        $RvW.rvwPreferences.get("app.state.song.create.trim_slides", true)
    );

    const {slides: slideSet, fonts} = props;

    const [slides1, setSlides1] = useState('');
    const [slides2, setSlides2] = useState('');

    useEffect(() => {
        if (open) {
            const delimiter = unescapeSlidesDelimiter(slideDelimiter);

            const _slides0 = slideSet[0].join(delimiter);
            const _slides1 = slideSet[1].join(delimiter);

            setSlides1(_slides0);
            setSlides2(_slides1);
        } else {
            setSlides1('');
            setSlides2('');
        }
    }, [open]);

    function onClickGenerate() {
        $RvW.rvwPreferences.set("app.state.song.create.delimiter", slideDelimiter);
        $RvW.rvwPreferences.set("app.state.song.create.trim_empty", trimEmpty);
        $RvW.rvwPreferences.set("app.state.song.create.trim_slides", trimSlides);
        $RvW.rvwPreferences.commit();

        const delimiter = unescapeSlidesDelimiter(slideDelimiter);

        let sl1 = slides1.split(delimiter);
        let sl2 = slides2.split(delimiter);

        if (trimSlides) {
            sl1 = sl1.map((slide) => slide.trim());
            sl2 = sl2.map((slide) => slide.trim());
        }

        if (trimEmpty) {
            sl1 = sl1.filter((slide) => !!slide.trim());
            sl2 = sl2.filter((slide) => !!slide.trim());
        }

        props.onSubmit([sl1, sl2]);

        handleClose();
    }

    function handleClose() {
        showLyricEditPanel.set(false);
    }

    return (
        <>
            <Modal
                title="Generate Slides"
                isOpen={open}
                onClose={handleClose}
                width="80%"
                zIndex={1005}
            >
                <div class="ui form">
                    {/* Slides */}
                    <div class="two fields">
                        <div class="field">
                            <textarea
                                class="text-lg"
                                value={slides1}
                                style={{
                                    fontFamily: fonts[0],
                                    minHeight: '320px',
                                }}
                                onChange={(e) => {
                                    setSlides1(e.currentTarget.value)
                                }}
                            ></textarea>
                        </div>
                        <div class="field">
                            <textarea
                                class="text-lg"
                                value={slides2}
                                style={{
                                    fontFamily: fonts[1],
                                    minHeight: '320px',
                                }}
                                onChange={(e) => {
                                    setSlides2(e.currentTarget.value)
                                }}
                            ></textarea>
                        </div>
                    </div>

                    {/* Delim Controls */}
                    <div class="ui message">
                        <div class="header">Separate the slides with the delimiter</div>
                        <ul class="list">
                            <li><code>\r</code> for CR (carriage return)</li>
                            <li><code>\n</code> for LF (newline)</li>
                            <li><code>\t</code> for TAB</li>
                            <li><code>\s</code> for WHITESPACE</li>
                        </ul>
                    </div>

                    <div class="field">
                        <label>Delimiter</label>
                        <input
                            type="text"
                            placeholder="\n\n\n"
                            value={slideDelimiter}
                            onInput={(e) => {
                                setSlideDelimiter((e.target as HTMLInputElement).value)
                            }}
                        />
                    </div>

                    <div class="inline fields">
                        <label>Options:</label>

                        <div class="field">
                            <div class="ui checkbox">
                                <input
                                    type="checkbox"
                                    tabIndex={0}
                                    class="hidden"
                                    checked={trimSlides}
                                    onChange={(e) => {
                                        setTrimSlides(e.currentTarget.checked)
                                    }}
                                />
                                <label>Trim Slides</label>
                            </div>
                        </div>
                        <div class="field">
                            <div class="ui checkbox">
                                <input
                                    type="checkbox"
                                    tabIndex={0}
                                    class="hidden"
                                    checked={trimEmpty}
                                    onChange={(e) => {
                                        setTrimEmpty(e.currentTarget.checked)
                                    }}
                                />
                                <label>Remove Empty</label>
                            </div>
                        </div>
                    </div>

                    <div class="ui buttons">
                        <button class="ui blue button" tabIndex={0} onClick={onClickGenerate}>
                            Generate
                        </button>
                        <button class="ui button" tabIndex={0} onClick={() => handleClose()}>
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
}