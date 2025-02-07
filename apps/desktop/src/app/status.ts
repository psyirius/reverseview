import {statusMessage} from "@stores/global";

export function setStatus(status: string) {
    statusMessage.set(status);
}

export function clearStatus() {
    statusMessage.set(null);
}
