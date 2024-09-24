import {useEffect, useRef, useState} from "preact/hooks";

export default function Toaster() {
    const id = 'toast-container';

    const container = useRef(null);

    // const [panel, setPanel] = useState(null);
    //
    // // Init Dialog Panel
    // useEffect(() => {
    //     const panel = new $Y.Panel({
    //         headerContent   : 'Notes',
    //         srcNode         : container.current!,
    //         width           : 'auto',
    //         zIndex          : 1000,
    //         modal           : false,
    //         render          : true,
    //         visible         : false, // make visible explicitly with .show()
    //         buttons         : {
    //             header: ['close'],
    //         }
    //     });
    //
    //     // panel.on('visibleChange', function (e: any) {
    //     //     showBibleNotesEditPanel.set(e.newVal);
    //     // });
    //
    //     setPanel(panel);
    // }, []);

    return (
        <div id={id} ref={container}></div>
    )
}