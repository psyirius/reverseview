import { useState, useEffect, useId } from '@lib/zrx/hooks';
import { Component, render } from '@lib/zrx/preact';

interface Props {

}

export default function RemoteSetupDialog({}: Props) {
    const id = useId();

    const [visible, setVisible] = useState(false);

    return (
        visible && (
            <div id={id}>
                <h1>Remote Setup</h1>
            </div>
        )
    );
}

export function mount(at: string) {
    render(<RemoteSetupDialog />, document.getElementById(at)!);
}