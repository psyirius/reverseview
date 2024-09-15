import {useEffect} from "@lib/zrx/hooks";
import {useStoreState} from "@/utils/hooks";
import {blankSlide, showLogoSlide} from "@app/common";
import {call_nextSlide, call_prevSlide, closePresentWindowMain} from "@/p_window";
import {menuYtLink, navNotifyMessage, selectedBookRef, selectedTab} from "@stores/global";
import {$RvW} from "@/rvw";

const handlers = {
    present: () => {
        const d = $RvW.leftTabView.get('selection').get('index');
        if (d === 1) {
            $RvW.songNavObj.sn_presentSong();
        } else {
            $RvW.present();
        }
    },
    blank: () => {
        blankSlide();
    },
    theme: () => {
        if ($RvW.presentationWindow != null) {
            $RvW.presentationWindow.window.showThemeProcess();
        }
    },
    logo: () => {
        showLogoSlide();
    },
    close: () => {
        closePresentWindowMain();
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

        navNotifyMessage.set("Added verse to schedule");
    },
    addSongToSchedule: () => {
        $RvW.learner.finishLearning();
        $RvW.songNavObj.sn_add2schedule();

        navNotifyMessage.set("Added song to schedule");
    },
    gotoLink: (url: string) => {
        const al = new air.URLRequest(url);
        air.navigateToURL(al);
    }
};

const menuItems = [
    { tooltip: 'Presentation',       icon: '/icons/images/32/present.png', onClick: handlers.present },
    { tooltip: 'Blank Presentation', icon: '/icons/images/32/blank.png',   onClick: handlers.blank },
    { tooltip: 'Show Theme',         icon: '/icons/images/32/theme.png',   onClick: handlers.theme },
    { tooltip: 'Show Logo',          icon: '/icons/images/32/logo.png',    onClick: handlers.logo },
    { tooltip: 'Close Presentation', icon: '/icons/images/32/close.png',   onClick: handlers.close },
    { tooltip: 'Previous Slide',     icon: '/icons/images/32/left.png',    onClick: handlers.prev },
    { tooltip: 'Next Slide',         icon: '/icons/images/32/right.png',   onClick: handlers.next },
]

const notificationMessages = [];

export default function MenuBar() {
    const activeTabIndex = useStoreState(selectedTab);
    const activeBookRef = useStoreState(selectedBookRef);
    const ytLink = useStoreState(menuYtLink);
    const notification = useStoreState(navNotifyMessage);

    useEffect(() => {
        if (!!notification) {
            notificationMessages.forEach(e => clearTimeout(e));
            notificationMessages.length = 0;

            const t = setTimeout(() => {
                navNotifyMessage.set(null);
            }, 3000);

            notificationMessages.push(t);
        }
    }, [notification]);

    return (
        <div style="width: 100%">
            <div className="ui mini menu">
                {/* Menu Items */}
                {menuItems.map(e => (
                    <a
                        className="item"
                        data-tooltip={e.tooltip}
                        data-position="right center"
                        onClick={e.onClick}
                    >
                        <img src={e.icon} alt=""/>
                    </a>
                ))}

                {/* Verse Menu */}
                {(activeTabIndex == 0) && <>
                    <div className="item">
                        {activeBookRef}
                    </div>

                    <div
                        className="item"
                        data-tooltip="Add to Schedule"
                        data-position="left center"
                        onClick={handlers.addVerseToSchedule}
                    >
                        <i className="add icon"></i>
                    </div>
                </>}

                {/* Lyric Menu */}
                {(activeTabIndex == 1) && <>
                    <div
                        className={"item" + ((ytLink == null) ? "" : " disabled")}
                        disabled={(ytLink == null)}
                        data-tooltip="YouTube"
                        data-position="left center"
                        onClick={() => handlers.gotoLink(ytLink)}
                    >
                        <i className="video icon"></i>
                    </div>

                    <div
                        className="item"
                        data-tooltip="Add to Schedule"
                        data-position="left center"
                        onClick={handlers.addSongToSchedule}
                    >
                        <i className="add icon"></i>
                    </div>
                </>}

                {/* Notification Message */}
                {notification && <div className="item">
                    <a class="ui label basic" onClick={() => navNotifyMessage.set(null)}>
                        {notification}
                    </a>
                </div>}
            </div>
        </div>
    );
}