import {useStoreState} from "@/utils/hooks";
import {
    currentBibleVersions, navFontSize,
    selectedBibleVersion1,
    selectedBibleVersion2,
    showBibleSelectPanel, twoVersesPerSlide
} from "@stores/global";
import {$RvW} from "@/rvw";
import { saveVersionSelection} from "@/bible/version";
import Modal from "@/app/ui/Modal";
import {useEffect, useRef, useState} from "preact/hooks";

export default function BibleSelectorDialog() {
    const navFontSizeSliderRef = useRef<HTMLDivElement>(null);

    const open = useStoreState(showBibleSelectPanel);

    const bibleVersions = useStoreState(currentBibleVersions);
    const bibleVersion1 = useStoreState(selectedBibleVersion1);
    const bibleVersion2 = useStoreState(selectedBibleVersion2);
    const twoVPS = useStoreState(twoVersesPerSlide);

    const dualLangNav = !!$RvW.vvConfigObj.get_navDualLanguage();

    const [version2Enable, setVersion2Enable] = useState(!$RvW.vvConfigObj.get_singleVersion());
    const [bookNameStyle, setBookNameStyle] = useState($RvW.vvConfigObj.get_booknamestyle() - 1);

    function handleCloseModal() {
        showBibleSelectPanel.set(false);
    }

    function onClickDualLangNav(e: Event) {
        const el = e.target as HTMLInputElement;

        $RvW.vvConfigObj.set_navDualLanguage(el.checked);

        $RvW.updateVerseContainer();
    }

    function onSave(e: Event) {
        e.preventDefault();

        saveVersionSelection(
            selectedBibleVersion1.get(),
            selectedBibleVersion2.get(),
            bookNameStyle,
        );

        handleCloseModal();
    }

    function onClickVer2Enable(e: Event) {
        const el = e.target as HTMLInputElement;
        const { checked } = el;

        setVersion2Enable(checked);

        $RvW.vvConfigObj.set_singleVersion(!checked);
        $RvW.vvConfigObj.save();
    }

    function onClickTwoVPS(e: Event) {
        const el = e.target as HTMLInputElement;
        const {checked} = el;

        twoVersesPerSlide.set(checked);
    }

    useEffect(() => {
        if (open) {
            // @ts-ignore
            $(navFontSizeSliderRef.current).range({
                min: 0,
                max: 200,
                start: ($RvW.vvConfigObj.get_navFontSize() - 8) * 10,
                onChange: function (sVal: number) {
                    $(navFontSizeSliderRef.current).val(sVal);

                    const fz = Math.round(sVal) / 10 + 8;

                    $RvW.vvConfigObj.set_navFontSize(fz);
                    navFontSize.set(fz);

                    // Update the font size
                    $RvW.updateVerseContainer();
                    $RvW.searchObj.setFontSize(fz);
                    // $RvW.scheduleObj.changeFontsizeScheduleTab();

                    console.trace("Slider value changed:", fz);
                },
            });
            $RvW.disableHotkeys = true;
        } else {
            $RvW.disableHotkeys = false;
        }
    }, [open]);

    return (
        <Modal
            title="Bible Version Selection"
            width="480px"
            isOpen={open}
            onClose={handleCloseModal}
        >
            <form class="ui form">
                <h4 class="ui dividing header">Primary</h4>

                <div class="field">
                    <label>Bible Version</label>

                    <select
                        class="selectboxStyle"
                        value={bibleVersion1}
                        onChange={(e) => selectedBibleVersion1.set((e.target as HTMLSelectElement).selectedIndex)}
                    >
                        {bibleVersions.map((version, i) => (
                            <option value={i} key={i}>{version.name}</option>
                        ))}
                    </select>
                </div>

                <h4 class="ui dividing header">Secondary</h4>

                <div class="field">
                    <label>Bible Version</label>

                    <select
                        class="selectboxStyle"
                        value={bibleVersion2}
                        onChange={(e) => selectedBibleVersion2.set((e.target as HTMLSelectElement).selectedIndex)}
                        disabled={!version2Enable}
                    >
                        {bibleVersions.map((version, i) => (
                            <option value={i} key={i}>{version.name}</option>
                        ))}
                    </select>
                </div>

                <div class="field">
                    <div class="ui checkbox">
                        <input
                            type="checkbox"
                            name="enable-version-2"
                            checked={version2Enable}
                            onClick={onClickVer2Enable}
                        />
                        <label>Enable Secondary</label>
                    </div>
                </div>

                <div class="field">
                    <label>BookName Style</label>

                    <select
                        class="selectboxStyle"
                        value={bookNameStyle}
                        onChange={(e) => setBookNameStyle((e.target as HTMLSelectElement).selectedIndex + 1)}
                    >
                        <option value="1">English</option>
                        <option value="2">Primary Language</option>
                        <option value="3">Primary Language with English</option>
                        <option value="4">Primary Language with Secondary</option>
                    </select>
                </div>

                <div class="field">
                    <div class="ui toggle checkbox">
                        <input
                            type="checkbox"
                            name="two-vps"
                            checked={twoVPS}
                            onClick={onClickTwoVPS}
                        />
                        <label>Display 2 verse per slide</label>
                    </div>
                </div>

                <div class="field">
                    <div class="ui toggle checkbox">
                        <input
                            type="checkbox"
                            name="dual-lang-nav"
                            checked={dualLangNav}
                            onClick={onClickDualLangNav}
                        />
                        <label>Dual language display for Navigation</label>
                    </div>
                </div>

                <div class="field">
                    <label>Navigation Font Size</label>

                    <div class="ui range" ref={navFontSizeSliderRef}></div>
                </div>

                <button class="ui icon button" tabIndex={0} onClick={onSave}>Save</button>
            </form>
        </Modal>
    );
}