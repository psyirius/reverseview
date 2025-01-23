import {useEffect, useRef, useState} from "preact/hooks";
import {selectedSong2Edit, showLyricEditPanel, showSongEditPanel} from "@stores/global";
import {useStoreState} from "@/utils/hooks";
import {$RvW} from "@/rvw";
import Modal from "@app/ui/Modal";
import Tabs from "@app/ui/Tabz";
import {console} from "@/platform/adapters/air";
import {Toast} from "@app/toast";
import LyricEditDialog from "@app/ui/dialogs/LyricEdit";
import {presenter, songManager} from "@app/glc";
import {SongItem} from "@/song/song-manager";
import {showPrompt} from "@app/ui/Prompt";

interface LSProps {
    slidesInitial: [string[], string[]];
    fonts: [string, string];
    onChange?: (slides1: string[], slides2: string[]) => void;
    selected?: number;
    onSelect?: (index: number) => void;
}

function LyricSlides({ slidesInitial, onChange, selected, onSelect, fonts }: LSProps) {
    const slidesRef = useRef<Tabs>(null);

    const [slides1, slides2] = slidesInitial;

    useEffect(() => {
        console.log("Slides", slides1, slides2);
        console.log("Fonts", fonts);
    }, []);

    useEffect(() => {
        slidesRef.current.setSelectedTab(selected);
    }, [selected]);

    const maxSlides = Math.max(slides1.length, slides2.length);

    const ds = [];
    for (let i = 0; i < maxSlides; i++) {
        ds.push(null);
    }

    const tabs = ds.map((_, index) => {
        return {
            title: `${index + 1}`,
            content: () => (
                <div class="ui form">
                    <div class="fields">
                        <div class="eight wide field">
                            <textarea
                                placeholder="Primary Lyrics"
                                value={slides1[index] || ''}
                                onChange={(e) => {
                                    slides1[index] = e.currentTarget.value;
                                    onChange?.(slides1, slides2);
                                }}
                                style={{
                                    fontFamily: fonts[0],
                                }}
                            />
                        </div>
                        <div class="eight wide field">
                            <textarea
                                placeholder="Secondary Lyrics"
                                value={slides2[index] || ''}
                                onChange={(e) => {
                                    slides2[index] = e.currentTarget.value;
                                    onChange?.(slides1, slides2);
                                }}
                                style={{
                                    fontFamily: fonts[1],
                                }}
                            />
                        </div>
                    </div>
                </div>
            ),
        };
    });

    return (
        <>
            <Tabs
                tabs={tabs}
                ref={slidesRef}
                initialSelected={selected}
                onChange={(index) => {
                    onSelect?.(index);
                }}
            >
            </Tabs>
        </>
    )
}

export default function SongEditDialog() {
    const open = useStoreState(showSongEditPanel);
    const song2Edit = useStoreState(selectedSong2Edit);

    const [addFontDlgOpen, setAddFontDlgOpen] = useState(false);
    const [addCatDlgOpen, setAddCatDlgOpen] = useState(false);

    const [dirty, setDirty] = useState(false);

    const [title, setTitle] = useState("");
    const [title2, setTitle2] = useState("");
    const [songNumber, setSongNumber] = useState(null);

    const [songKey, setSongKey] = useState("");
    const [author, setAuthor] = useState("");
    const [youtube, setYoutube] = useState("");

    const [notes, setNotes] = useState("");
    const [tags, setTags] = useState("");

    const [slideSequence, setSlideSequence] = useState("");

    const [slides1, setSlides1] = useState([]);
    const [slides2, setSlides2] = useState([]);

    const [selectedSlide, setSelectedSlide] = useState(0);

    const [categories, setCategories] = useState([]);
    const [fonts, setFonts] = useState([]);

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedFont1, setSelectedFont1] = useState(null);
    const [selectedFont2, setSelectedFont2] = useState(null);

    useEffect(() => {
        if (open) {
            setDirty(false);

            const cats = songManager.getAllCategories();
            cats.sort();
            setCategories(cats);

            const fonts = songManager.getAllFonts();
            for (const sysFont of $RvW.systemFontList) {
                if (fonts.indexOf(sysFont) === -1) {
                    fonts.push(sysFont);
                }
            }
            fonts.sort();
            setFonts(fonts);

            if (song2Edit) {
                setTitle(song2Edit.name);
                setTitle2(song2Edit.title);

                setSongNumber(song2Edit.serial || null);

                setSongKey(song2Edit.key);
                setAuthor(song2Edit.author);
                setYoutube(song2Edit.youtube);

                setNotes(song2Edit.notes);
                setTags(song2Edit.tags.join(", "));

                setSlideSequence(song2Edit.sequence);

                setSlides1(
                    song2Edit.lyrics[0]?.slides || [],
                );
                setSlides2(
                    song2Edit.lyrics[1]?.slides || [],
                );

                setSelectedSlide(0);

                if (song2Edit.category) {
                    setSelectedCategory(cats.indexOf(song2Edit.category));
                } else {
                    setSelectedCategory(null);
                }

                const font1 = song2Edit.lyrics[0]?.font;
                const font2 = song2Edit.lyrics[1]?.font;

                console.log("Fonts", font1, font2);

                if (font1) {
                    setSelectedFont1(fonts.indexOf(font1));
                } else {
                    setSelectedFont1(null);
                }

                if (font2) {
                    setSelectedFont2(fonts.indexOf(font2));
                } else {
                    setSelectedFont2(null);
                }
            } else {
                setTitle("");
                setTitle2("");
                setSongNumber(null);

                setSongKey("");
                setAuthor("");
                setYoutube("");

                setNotes("");
                setTags("");

                setSlideSequence("");

                setSlides1([]);
                setSlides2([]);

                setSelectedSlide(0);
            }
        }
    }, [open]);

    function handleCloseModal() {
        showSongEditPanel.set(false);
    }

    function extractFormData(): SongItem {
        const _title = title.trim();

        if (!_title) {
            Toast.error("Add Edit Songs", "Enter a valid Song Name");
            return;
        }

        const _title2 = (title2 ?? '').trim();

        console.log("Slides", slides1, slides2);

        return {
            id: song2Edit?.id || null,
            name: _title.replace(/\s\s+/g, " "),
            title: _title2.replace(/\s\s+/g, " "),
            serial: songNumber,
            lyrics: [
                {
                    font: fonts[selectedFont1],
                    slides: slides1.map((s) => s.trim()),
                },
                {
                    font: fonts[selectedFont2],
                    slides: slides2.map((s) => s.trim()),
                },
            ],
            key: songKey,
            sequence: slideSequence,
            notes: notes,
            author: author,
            copyright: "",
            timestamp: song2Edit?.timestamp || new Date(),
            youtube: youtube,
            bpm: null,
            chords: null,
            tags: tags.split(",").map((t) => t.trim()),
            category: categories[selectedCategory],
        };
    }

    function onClickPresent(e: Event) {
        e.preventDefault();

        const so = extractFormData();

        if (so) {
            presenter.presentSong(so, selectedSlide);
        }
    }

    function onClickSave(e: Event) {
        e.preventDefault();

        const so = extractFormData();

        console.log('onSave:', song2Edit);

        if (so) {
            if (so.id) { // update mode
                console.log("Updating Song", so);
                songManager.update(so, (result, error) => {
                    if (error) {
                        console.error("Error updating song", error);
                        Toast.error("Error updating song", error);
                    } else {
                        console.log("Song updated", result);
                        Toast.success("Song updated", "Song updated successfully");
                    }
                });
            } else {
                console.log("Adding Song", so);
                songManager.add(so, (result, error) => {
                    if (error) {
                        console.error("Error adding song", error);
                        Toast.error("Error adding song", error);
                    } else {
                        console.log("Song added", result);
                        Toast.success("Song added", "Song added successfully");
                    }
                });
            }

            handleCloseModal();
        }
    }

    function onClickSaveAsNew(e: Event) {
        e.preventDefault();

        const so = extractFormData();

        if (so) {
            console.log("Adding Song", so);

            songManager.add(so, (result, error) => {
                if (error) {
                    console.error("Error adding song", error);
                    Toast.error("Error adding song", error);
                } else {
                    console.log("Song added", result);
                    Toast.success("Song added", "Song added successfully");
                }
            });

            handleCloseModal();
        }
    }

    function onClickCancel(e: Event) {
        e.preventDefault();

        if (dirty) {
            showPrompt({
                title: "Song Add/Edit",
                message: "Are you sure you want to cancel and discard the changes?",
                onOk: handleCloseModal,
                onCancel: () => {},
            });
        } else {
            handleCloseModal();
        }
    }

    function onAddSlide(e: Event) {
        e.preventDefault();

        // TODO: Fast click on this button will hang the app

        setSlides1([...slides1, ""]);
        setSlides2([...slides2, ""]);
        setSelectedSlide(slides1.length);

        setDirty(true);
    }

    function onDupSlide(e: Event) {
        e.preventDefault();

        // TODO: Fast click on this button will hang the app

        const dup1 = slides1[selectedSlide];
        const dup2 = slides2[selectedSlide];

        slides1.splice(selectedSlide, 0, dup1);
        slides2.splice(selectedSlide, 0, dup2);

        setSlides1([...slides1]);
        setSlides2([...slides2]);

        setSelectedSlide(selectedSlide + 1);

        setDirty(true);
    }

    function onMoveUpSlide(e: Event) {
        e.preventDefault();

        // TODO: Fast click on this button will hang the app

        const slide1 = slides1[selectedSlide];
        const slide2 = slides2[selectedSlide];

        slides1.splice(selectedSlide, 1);
        slides2.splice(selectedSlide, 1);

        slides1.splice(selectedSlide - 1, 0, slide1);
        slides2.splice(selectedSlide - 1, 0, slide2);

        setSlides1([...slides1]);
        setSlides2([...slides2]);

        setSelectedSlide(Math.min(selectedSlide, selectedSlide - 1));

        setDirty(true);
    }

    function onMoveDownSlide(e: Event) {
        e.preventDefault();

        // TODO: Fast click on this button will hang the app

        const slide1 = slides1[selectedSlide];
        const slide2 = slides2[selectedSlide];

        slides1.splice(selectedSlide, 1);
        slides2.splice(selectedSlide, 1);

        slides1.splice(selectedSlide + 1, 0, slide1);
        slides2.splice(selectedSlide + 1, 0, slide2);

        setSlides1([...slides1]);
        setSlides2([...slides2]);

        setSelectedSlide(Math.max(selectedSlide, selectedSlide + 1));

        setDirty(true);
    }

    function onDeleteSlide(e: Event) {
        e.preventDefault();

        // TODO: Fast click on this button will hang the app

        slides1.splice(selectedSlide, 1);
        slides2.splice(selectedSlide, 1);

        setSlides1([...slides1]);
        setSlides2([...slides2]);

        setSelectedSlide(Math.min(selectedSlide, slides1.length - 1));

        if (slides1.length === 0) {
            onAddSlide(e);
        }

        setDirty(true);
    }

    function onEditSlides(e: Event) {
        e.preventDefault();

        showLyricEditPanel.set(true);
    }

    function onClickAddCategory(e: Event) {
        e.preventDefault();

        setAddCatDlgOpen(true);
    }

    function onClickAddFont(e: Event) {
        e.preventDefault();

        setAddFontDlgOpen(true);
    }

    const [newFontName, setNewFontName] = useState("");
    const [newCatName, setNewCatName] = useState("");

    function onAddNewCategory(e: Event) {
        e.preventDefault();

        const catName = newCatName.trim();

        if (catName) {
            const cats = [...categories, catName];

            cats.sort();

            setCategories(cats);
            setSelectedCategory(cats.indexOf(catName));

            setAddCatDlgOpen(false);
            setNewCatName("");
        }
    }

    function onAddNewFont(e: Event) {
        e.preventDefault();

        const fontName = newFontName.trim();

        if (fontName) {
            const _fonts = [...fonts, fontName];

            _fonts.sort();

            setFonts(_fonts);
            setSelectedFont1(_fonts.indexOf(fontName));

            setAddFontDlgOpen(false);
            setNewFontName("");
        }
    }

    return (
        <>
            {/* Bulk Edit Slides */}
            <LyricEditDialog
                slides={[slides1, slides2]}
                fonts={[fonts[selectedFont1], fonts[selectedFont2]]}
                onSubmit={([slides1, slides2]) => {
                    console.log("Slides Generated", slides1, slides2);

                    setSlides1([...slides1]);
                    setSlides2([...slides2]);

                    setSelectedSlide(0);

                    setDirty(true);
                }}
            />

            {/* Add Category */}
            <Modal
                title="Add Category"
                isOpen={addCatDlgOpen}
                onClose={() => setAddCatDlgOpen(false)}
                width="320px"
                zIndex={1002}
            >
                <div class="ui form">
                    <div class="field">
                        <label>Category</label>
                        <input
                            type="text"
                            placeholder="Category"
                            value={newCatName}
                            onChange={(e) => setNewCatName(e.currentTarget.value)}
                        />
                    </div>
                    <div class="ui basic buttons">
                        <button class="ui green icon button" tabIndex={0} onClick={onAddNewCategory}>
                            OK
                        </button>
                        <button class="ui red icon button" tabIndex={0} onClick={() => setAddCatDlgOpen(false)}>
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>

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
                title="Song ADD / EDIT"
                isOpen={open}
                onClose={handleCloseModal}
                width="80%"
                zIndex={1001}
            >
                <form class="ui form">
                    {/* Title, Title 2, Number */}
                    <div class="three fields">
                        <div class="field">
                            <label>Title</label>
                            <input
                                type="text"
                                placeholder="Song Title"
                                value={title}
                                onChange={(e) => {
                                    setTitle(e.currentTarget.value);
                                    setDirty(true);
                                }}
                            />
                        </div>
                        <div class="field">
                            <label>Title 2</label>
                            <input
                                type="text"
                                placeholder="Song Title 2"
                                value={title2}
                                onChange={(e) => {
                                    setTitle2(e.currentTarget.value);
                                    setDirty(true);
                                }}
                            />
                        </div>
                        <div class="field">
                            <label>#</label>
                            <input
                                type="number"
                                placeholder="1"
                                value={songNumber}
                                onChange={(e) => {
                                    const val = parseInt(e.currentTarget.value);

                                    setSongNumber(isNaN(val) ? null : val);

                                    setDirty(true);
                                }}
                            />
                        </div>
                    </div>

                    {/* Category, Font1, Font2 */}
                    <div class="three fields">
                        <div class="field">
                            <label>Category</label>
                            <div class="ui action input">
                                <select
                                    class="ui selection dropdown"
                                    value={selectedCategory}
                                    onChange={(e) => {
                                        setSelectedCategory(e.currentTarget.value);
                                    }}
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((cat, i) => (
                                        <option value={i} key={i}>{cat}</option>
                                    ))}
                                </select>
                                <button
                                    class="ui icon button"
                                    tabIndex={0}
                                    onClick={onClickAddCategory}
                                >
                                    <i class="plus icon"></i>
                                </button>
                            </div>
                        </div>
                        <div class="field">
                            <label>Font (Primary)</label>
                            <div class="ui action input">
                                <select
                                    class="ui selection dropdown"
                                    value={selectedFont1}
                                    onChange={(e) => {
                                        setSelectedFont1(e.currentTarget.value);
                                    }}
                                >
                                    <option value="">Select Font</option>
                                    {fonts.map((font, i) => (
                                        <option value={i} key={i}>{font}</option>
                                    ))}
                                </select>
                                <button
                                    class="ui icon button"
                                    tabIndex={0}
                                    onClick={onClickAddFont}
                                >
                                    <i class="plus icon"></i>
                                </button>
                            </div>
                        </div>
                        <div class="field">
                            <label>Font (Secondary)</label>
                            <div class="ui action input">
                                <select
                                    class="ui selection dropdown"
                                    value={selectedFont2}
                                    onChange={(e) => {
                                        setSelectedFont2(e.currentTarget.value);
                                    }}
                                >
                                    <option value="">Select Font</option>
                                    {fonts.map((font, i) => (
                                        <option value={i} key={i}>{font}</option>
                                    ))}
                                </select>
                                <button
                                    class="ui icon button"
                                    tabIndex={0}
                                    onClick={onClickAddFont}
                                >
                                    <i class="plus icon"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Key, Copyright, YouTube */}
                    <div class="three fields">
                        <div class="field">
                            <label>Key</label>
                            <input
                                type="text"
                                placeholder="Example: C"
                                value={songKey}
                                onChange={(e) => {
                                    setSongKey(e.currentTarget.value);
                                    setDirty(true);
                                }}
                            />
                        </div>
                        <div class="field">
                            <label>Author</label>
                            <input
                                type="text"
                                placeholder="Example: Matt Redman"
                                value={author}
                                onChange={(e) => {
                                    setAuthor(e.currentTarget.value);
                                    setDirty(true);
                                }}
                            />
                        </div>
                        <div class="field">
                            <label>Youtube</label>
                            <input
                                type="text"
                                placeholder="Example: https://www.youtube.com/watch?v=XfELJU1mRMg"
                                value={youtube}
                                onChange={(e) => {
                                    setYoutube(e.currentTarget.value);
                                    setDirty(true);
                                }}
                            />
                        </div>
                    </div>

                    {/* Slides & Controls */}
                    <div class="fields">
                        <div class="sixteen wide field">
                            <div class="ui top attached segment" style={{
                                padding: 0,
                                height: "240px",
                            }}>
                                <LyricSlides
                                    slidesInitial={[
                                        slides1,
                                        slides2,
                                    ]}
                                    fonts={[
                                        fonts[selectedFont1],
                                        fonts[selectedFont2],
                                    ]}
                                    selected={selectedSlide}
                                    onSelect={(index) => {
                                        setSelectedSlide(index);
                                    }}
                                    onChange={(slides1, slides2) => {
                                        // setSlides1(slides1);
                                        // setSlides2(slides2);

                                        setDirty(true);
                                    }}
                                />
                            </div>
                            <div class="ui bottom attached basic six buttons">
                                <button class="ui compact icon button" tabIndex={0} onClick={onMoveUpSlide}>
                                    <i class="ui angle left icon"></i>
                                </button>
                                <button class="ui compact icon button" tabIndex={0} onClick={onMoveDownSlide}>
                                    <i class="ui angle right icon"></i>
                                </button>
                                <button class="ui compact icon button" tabIndex={0} onClick={onAddSlide}>
                                    <i class="ui plus icon"></i>
                                </button>
                                <button class="ui compact icon button" tabIndex={0} onClick={onDupSlide}>
                                    <i class="ui copy icon"></i>
                                </button>
                                <button class="ui compact icon button" tabIndex={0} onClick={onDeleteSlide}>
                                    <i class="ui trash icon"></i>
                                </button>
                                <button class="ui compact icon button" tabIndex={0} onClick={onEditSlides}>
                                    <i class="ui edit icon"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Slide Sequence */}
                    <div class="fields">
                        <div class="sixteen wide field">
                            <label>Sequence</label>
                            <input
                                placeholder="1,2,3,2,4,2"
                                type={"text"}
                                value={slideSequence}
                                onChange={(e) => {
                                    setSlideSequence(e.currentTarget.value);
                                    setDirty(true);
                                }}
                            />
                        </div>
                    </div>

                    {/* Notes, Tags */}
                    <div class="two fields">
                        <div class="field">
                            <label>Notes</label>
                            <textarea
                                placeholder="Sweet Song"
                                rows={1}
                                value={notes}
                                onChange={(e) => {
                                    setNotes(e.currentTarget.value);
                                    setDirty(true);
                                }}
                            />
                        </div>
                        <div class="field">
                            <label>Tags</label>
                            <textarea
                                placeholder="Worship,Slow"
                                rows={1}
                                value={tags}
                                onChange={(e) => {
                                    setTags(e.currentTarget.value);
                                    setDirty(true);
                                }}
                            />
                        </div>
                    </div>

                    {/* Dialog Controls */}
                    <div class="ui buttons">
                        <button
                            class="ui green icon button"
                            tabIndex={0}
                            onClick={onClickPresent}
                        >
                            Present
                        </button>
                        <button
                            class="ui blue icon button"
                            tabIndex={0}
                            onClick={onClickSave}
                        >
                            Save
                        </button>
                        <button
                            class="ui blue icon button"
                            tabIndex={0}
                            onClick={onClickSaveAsNew}
                        >
                            Save As New
                        </button>
                        <button
                            class="ui red icon button"
                            tabIndex={0}
                            onClick={onClickCancel}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    );
}