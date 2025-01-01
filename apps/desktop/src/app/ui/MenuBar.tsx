import {useStoreState} from "@/utils/hooks";
import {blankSlide, showLogoSlide} from "@app/common";
import {call_nextSlide, call_prevSlide, call_showTheme, call_closePresentation} from "@/p_window";
import {menuYtLink, selectedBookRef, selectedTab, showRemotePanel} from "@stores/global";
import {$RvW} from "@/rvw";

import BibleRefSelect from "@app/ui/BibleRefSelect";
import {Toast} from "@app/toast";

const handlers = {
    present: () => {
        if ($RvW.leftTabView.getSelectedTab() === 1) {
            $RvW.songNavObj.sn_presentSong();
        } else {
            $RvW.present();
        }
    },
    blank: () => {
        blankSlide();
    },
    theme: () => {
        call_showTheme();
    },
    logo: () => {
        showLogoSlide();
    },
    close: () => {
        call_closePresentation();
    },
    prev: () => {
        call_prevSlide();
    },
    next: () => {
        call_nextSlide();
    },
    addVerseToSchedule: () => {
        const b = $RvW.getBookValue();
        const c = $RvW.getChapterValue();
        const v = $RvW.getVerseValue();
        $RvW.scheduleObj.processAddVerse(b, c, v);

        Toast.success("Verse", "Added verse to schedule");
    },
    addSongToSchedule: () => {
        $RvW.learner.finishLearning();
        $RvW.songNavObj.sn_add2schedule();

        Toast.success("Song", "Added song to schedule");
    },
    gotoLink: (url: string) => {
        const al = new air.URLRequest(url);
        air.navigateToURL(al);
    }
};

const menuItems = [
    { tooltip: 'Present',               iconClass: 'play circle',           onClick: handlers.present },
    { tooltip: 'Blank Presentation',    iconClass: 'square',                onClick: handlers.blank },
    // { tooltip: 'Show Theme',            iconClass: 'fire',                  onClick: handlers.theme },
    { tooltip: 'Show Logo',             iconClass: 'image',                 onClick: handlers.logo },
    { tooltip: 'Close Presentation',    iconClass: 'times circle',          onClick: handlers.close },
    { tooltip: 'Previous Slide',        iconClass: 'arrow circle left',     onClick: handlers.prev },
    { tooltip: 'Next Slide',            iconClass: 'arrow circle right',    onClick: handlers.next },
]

export default function MenuBar() {
    const activeTabIndex = useStoreState(selectedTab);
    const activeBookRef = useStoreState(selectedBookRef);
    const ytLink = useStoreState(menuYtLink);

    return (
        <div style={{
            width: '100%'
        }}>
            <div class="ui clearing small attached segment" style={{
                borderTop: 'none',
                // borderBottom: 'none',
            }}>
                <div class="ui left floated secondary icon compact mini fitted menu">
                    <div class="item">
                        <span
                            class="font-medium text-xl text-gray-800 dark:text-gray-200"
                            style={{
                                fontFamily: 'BespokeStencil-Variable',
                            }}
                        >
                          ReVerseVIEW
                        </span>
                    </div>

                    <div class="item w-2"></div>

                    {/* Menu Items */}
                    <div class="item">
                        <div class="ui buttons">
                        {menuItems.map(e => (
                                <button
                                    class="ui icon button"
                                    data-tooltip={e.tooltip}
                                    data-position="bottom center"
                                    data-inverted=""
                                    onClick={e.onClick}
                                >
                                    <i class={e.iconClass + " icon"}></i>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Verse Menu */}
                    {(activeTabIndex == 0) && <>
                        <div class="item">
                            <div class="ui basic large label">{activeBookRef}</div>
                        </div>

                        <div class="item">
                            <div class="ui buttons">
                                <button
                                    class="ui icon button"
                                    data-tooltip="Add to Schedule"
                                    data-position="bottom center"
                                    data-inverted=""
                                    onClick={handlers.addVerseToSchedule}
                                >
                                    <i class="add icon"></i>
                                </button>
                            </div>
                        </div>

                        <div class="item">
                            <BibleRefSelect/>
                        </div>
                    </>}

                    {/* Lyric Menu */}
                    {(activeTabIndex == 1) && <>
                        <div class="item">
                            <div class="ui buttons">
                                <button
                                    class={"ui icon button " + ((ytLink == null) ? "" : "disabled")}
                                    disabled={(ytLink == null)}
                                    data-tooltip="YouTube"
                                    data-position="bottom center"
                                    data-inverted=""
                                    onClick={() => handlers.gotoLink(ytLink)}
                                >
                                    <i class="video icon"></i>
                                </button>

                                <button
                                    class="ui icon button"
                                    data-tooltip="Add to Schedule"
                                    data-position="bottom center"
                                    data-inverted=""
                                    onClick={handlers.addSongToSchedule}
                                >
                                    <i class="add icon"></i>
                                </button>
                            </div>
                        </div>
                    </>}
                </div>

                <div class="ui right floated secondary icon compact mini fitted menu">
                    <div class="item">
                        <div class="ui buttons">
                            <button
                                class="ui icon button"
                                data-tooltip="Remote"
                                data-position="bottom center"
                                data-inverted=""
                                onClick={() => showRemotePanel.set(true)}
                            >
                                <i class="wifi icon"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}