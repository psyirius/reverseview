import {
    Readable,
    Writable,
    get,
    derived,
    readable,
    writable,
} from '@/utils/_store'

export const $: Writable<number> = writable(0);