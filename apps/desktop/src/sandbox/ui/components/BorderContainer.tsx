import {useEffect, useRef, useState} from "preact/hooks";
import * as _BorderContainer from "dijit/layout/BorderContainer";

interface Props {
    design: 'headline';
    children?: any;
}

export default function BorderContainer({ children, design, ...rest }: Props) {
    const ref = useRef(null);

    const [widget, setWidget] = useState(null);

    useEffect(() => {
        if (ref.current) {
            const widget = new _BorderContainer({
                design,
            }, ref.current);

            widget.startup();

            setWidget(widget);
        }

        return () => {
            widget?.destroy();
        };
    }, [design]);

    return (
        <div ref={ref}>
            {children}
        </div>
    );
}