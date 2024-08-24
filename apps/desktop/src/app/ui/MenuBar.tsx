// import { useState, useEffect } from '@lib/zrx/hooks';

export default function MenuBar() {
    const menuItems = [
        { id: 'icon_present',   tooltip: 'Presentation',        icon: '/icons/images/32/present.png'    },
        { id: 'icon_blank',     tooltip: 'Blank Presentation',  icon: '/icons/images/32/blank.png'      },
        { id: 'icon_theme',     tooltip: 'Show Theme',          icon: '/icons/images/32/theme.png'      },
        { id: 'icon_logo',      tooltip: 'Show Logo',           icon: '/icons/images/32/logo.png'       },
        { id: 'icon_close',     tooltip: 'Close Presentation',  icon: '/icons/images/32/close.png'      },
        { id: 'icon_prev',      tooltip: 'Previous Slide',      icon: '/icons/images/32/left.png'       },
        { id: 'icon_next',      tooltip: 'Next Slide',          icon: '/icons/images/32/right.png'      },
    ]

    return (
        <div id="menubar" style="width: 100%">
            <div class="ui mini menu">
                {menuItems.map(e => (
                    <a
                        id={e.id}
                        class="item"
                        data-tooltip={e.tooltip}
                        data-position="right center"
                    >
                        <img src={e.icon} alt=""/>
                    </a>
                ))}

                <div id="verses_menu" class="menu">
                    <div id="book_name" class="item">
                        {/* Bible book Name */}
                    </div>

                    <div class="item">
                        <a
                            id="bibleAddScheduleButton"
                            class="item"
                            data-tooltip="Add to Schedule"
                            data-position="left center"
                        >
                            <i class="add icon"></i>
                        </a>
                    </div>
                </div>

                <div id="lyrics_menu" class="menu">
                    <div class="item">
                        <div
                            id="ytubeid"
                            class="item"
                            data-tooltip="YouTube"
                            data-position="left center"
                        >
                            <i class="video icon"></i>
                        </div>
                        <div
                            id="songAddScheduleButton"
                            class="item"
                            data-tooltip="Add to Schedule"
                            data-position="left center"
                        >
                            <i class="add icon"></i>
                        </div>
                    </div>
                </div>

                <div id="notificationMenu" class="item"></div>
            </div>
        </div>
    );
}