import { NullValue } from 'rollup'
import micromatch from 'micromatch'

export default function externalize(external: string[]) {
    return (source: string, importer: string | undefined, isResolved: boolean): (boolean | NullValue) => {
        // console.log('resolver', {
        //     source, importer, isResolved,
        // })

        if (micromatch.isMatch(source, external)) {
            return true
        }

        return null
    }
}