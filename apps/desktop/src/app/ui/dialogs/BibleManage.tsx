import {useEffect, useState} from "preact/hooks";
import {useStoreState} from "@/utils/hooks";
import {showBibleManagePanel} from "@stores/global";
import {
    BIBLE_VERSIONS,
    deleteBibleVersion,
    fillVersionPanel,
    importBible,
    updateBibleVersionsJSON
} from "@/bible/version";
import Modal from "@app/ui/Modal";
import ScrollableSelect from "@app/ui/widgets/ScrollableSelect";
import {Toast} from "@app/toast";
import {console} from "@/platform/adapters/air";
import {$RvW} from "@/rvw";
import {showPrompt} from "@app/ui/Prompt";

export default function BibleManageDialog() {
    const open = useStoreState(showBibleManagePanel);

    const [addFontDlgOpen, setAddFontDlgOpen] = useState(false);
    const [selectedVersion, setSelectedVersion] = useState(-1);

    const [dirty, setDirty] = useState(false);
    const [fonts, setFonts] = useState([]);

    const [versions, setVersions] = useState([]);

    const [bvName, setBvName] = useState(null);
    const [bvLang, setBvLang] = useState(null);
    const [bvCopyright, setBvCopyright] = useState(null);

    const [bvFonts, setBvFonts] = useState([]);
    const [bvSelectedFont, setBvSelectedFont] = useState(null);

    useEffect(() => {
        if (open) {
            setDirty(false);

            setVersions(
                [...BIBLE_VERSIONS]
            );
            setSelectedVersion(0);

            fillVersionPanel();
        }
    }, [open]);

    useEffect(() => {
        const version = versions[selectedVersion];

        if (version) {
            // console.log("Selected version:", version);

            setBvName(version.name);
            setBvLang(version.lang);
            {
                const fonts = [...version.fonts];

                fonts.sort();
                setBvFonts([...fonts]);

                for (const sysFont of $RvW.systemFontList) {
                    if (fonts.indexOf(sysFont) === -1) {
                        fonts.push(sysFont);
                    }
                }

                fonts.sort();
                setFonts([...fonts]);
            }
            setBvCopyright(version.copyright);
            setBvSelectedFont(version.selectedFont);
        } else {
            setBvName(null);
            setBvLang(null);
            setBvFonts([]);
            setBvCopyright(null);
            setBvSelectedFont(null);
        }
    }, [selectedVersion]);

    function onClickAddFont() {
        setAddFontDlgOpen(true);
    }

    const [newFontName, setNewFontName] = useState("");

    function onAddNewFont(e: Event) {
        e.preventDefault();

        const fontName = newFontName.trim();

        if (fontName) {
            const _fonts = [...bvFonts];

            if (_fonts.indexOf(fontName) === -1) {
                _fonts.push(fontName);
            }

            _fonts.sort();
            setBvFonts(_fonts);

            const _allFonts = [...fonts];

            if (_allFonts.indexOf(fontName) === -1) {
                _allFonts.push(fontName);
            }

            _allFonts.sort();
            setFonts(_allFonts);

            setBvSelectedFont(fontName);

            setAddFontDlgOpen(false);
            setNewFontName("");
        }
    }

    function onClickImport() {
        importBible();
    }

    function onClickDelete() {
        const version = versions[selectedVersion];

        if (version) {
            const bvi = BIBLE_VERSIONS.indexOf(version);

            const v1 = $RvW.vvConfigObj.get_version1();
            const v2 = $RvW.vvConfigObj.get_version2();

            if ((bvi === v1) || (bvi === v2)) {
                Toast.error(
                    "Bible Version Manager",
                    "Can not delete the primary and secondary version."
                );
            } else if (BIBLE_VERSIONS.length === 1) {
                Toast.error(
                    "Bible Version Manager",
                    "Minimum one version should be available."
                );
            } else if (version.file === 'kjv.db') {
                Toast.error(
                    "Bible Version Manager",
                    "English KJV version can not be deleted.",
                );
            } else {
                showPrompt({
                    title: 'Bible Version Manager',
                    message: 'Are you sure you want to delete the selected version?',
                    onOk: () => {
                        if (deleteBibleVersion(bvi)) {
                            setVersions(
                                [...BIBLE_VERSIONS]
                            );
                            setSelectedVersion(-1);

                            Toast.success(
                                "Bible Version Manager",
                                "Version deleted successfully."
                            );

                        } else {
                            Toast.error(
                                "Bible Version Manager",
                                "Failed to delete version."
                            );
                        }
                    },
                    onCancel: () => {},
                });
            }
        }
    }

    function onClickSave() {
        const version = versions[selectedVersion];

        if (version) {
            version.name = bvName;
            version.lang = bvLang;
            version.fonts = [...bvFonts];
            version.selectedFont = bvSelectedFont;
            version.copyright = bvCopyright;

            updateBibleVersionsJSON();

            $RvW.setFontForList();
            $RvW.updateVerseContainer();
        }
    }

    function handleCloseModal() {
        showBibleManagePanel.set(false);
    }

    return (
        <>
            {/* Add Font */}
            <Modal
                title="Add Font"
                isOpen={addFontDlgOpen}
                onClose={() => setAddFontDlgOpen(false)}
                width="320px"
                zIndex={1002}
            >
                <div class="ui form">
                    <div class="field">
                        <label>Font Family</label>
                        <input
                            type="text"
                            placeholder="Font Family"
                            value={newFontName}
                            onChange={(e) => setNewFontName(e.currentTarget.value)}
                        />
                    </div>
                    <div class="ui basic buttons">
                        <button class="ui green icon button" tabIndex={0} onClick={onAddNewFont}>
                            OK
                        </button>
                        <button class="ui red icon button" tabIndex={0} onClick={() => setAddFontDlgOpen(false)}>
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Main */}
            <Modal
                title="Manage Bible Versions"
                width="700px"
                zIndex={1001}
                isOpen={open}
                onClose={handleCloseModal}
            >
                <div class="ui form">
                    <div class="fields" style={{ height: '200px' }}>
                        <div class="six wide field">
                            <ScrollableSelect
                                items={versions.map((v, i) => {
                                    return {
                                        label: v.name,
                                        value: v.name,
                                        $: v,
                                    }
                                })}
                                selectedItem={selectedVersion}
                                onSelectItem={(index, item) => {
                                    setSelectedVersion(index);
                                }}
                            />
                        </div>

                        <div class="ten wide field">
                            {versions[selectedVersion] ? (
                                <>
                                    <div class="fields">
                                        <div class="ten wide field">
                                            <label>Name</label>
                                            <input
                                                type="text"
                                                placeholder="Example: KJV"
                                                value={bvName}
                                                onChange={(e) => {
                                                    setBvName(e.currentTarget.value);
                                                }}
                                            />
                                        </div>
                                        <div class="six wide field">
                                            <label>Lang/Locale</label>
                                            <input
                                                type="text"
                                                placeholder="Example: en-US"
                                                value={bvLang}
                                                onChange={(e) => {
                                                    setBvLang(e.currentTarget.value);
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div class="field">
                                        <label>Font</label>

                                        <div class="ui action input">
                                            <select
                                                class="ui selection dropdown"
                                                value={bvSelectedFont}
                                                onChange={(e) => {
                                                    setBvSelectedFont(e.currentTarget.value);
                                                }}
                                            >
                                                {fonts.map((font, i) => (
                                                    <option value={font} key={i}>{font}</option>
                                                ))}
                                            </select>
                                            <div class="ui button small" tabIndex={0} onClick={() => onClickAddFont()}>
                                                <i class="plus icon"></i>
                                                Add
                                            </div>
                                        </div>
                                    </div>
                                    <div class="field">
                                        <label>Copyright</label>
                                        <input
                                            type="text"
                                            placeholder="Example: BSI"
                                            value={bvCopyright}
                                            onChange={(e) => {
                                                setBvCopyright(e.currentTarget.value);
                                            }}
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div class="flex flex-col h-full w-full justify-center items-center">
                                        <div class="ui compact message">
                                            <div class="header">No version selected</div>
                                            <p>Please select a version to manage</p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div class="ui buttons">
                        <button
                            class="ui button"
                            onClick={onClickImport}
                        >
                            Import
                        </button>
                        <button
                            class="ui button"
                            onClick={onClickDelete}
                        >
                            Delete
                        </button>
                        <button
                            class="ui button"
                            onClick={onClickSave}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
}