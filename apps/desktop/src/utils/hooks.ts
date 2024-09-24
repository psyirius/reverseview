import {get, Readable, Writable} from "@/utils/_store";
import {useState} from "preact/hooks";

export function useStoreState<T>(store: Writable<T> | Readable<T>): T {
    const [state, setState] = useState<T>(get(store));
    store.subscribe(setState);
    return state;
}