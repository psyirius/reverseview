import { useStoreState } from "@/utils/hooks";
import { statusMessage } from "@stores/global";

export default function StatusBar() {
    const _statusMessage = useStoreState(statusMessage);

    return (
        <div class="flex flex-row h-8 w-full justify-between items-center px-4">
            <div></div>
            <div>
                {_statusMessage && (<div>{_statusMessage}</div>)}
            </div>
        </div>
    );
}