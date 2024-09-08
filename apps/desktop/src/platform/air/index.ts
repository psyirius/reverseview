import { Namespace, NamespaceExport } from '@/platform/types'

import * as fs from './fs'
import * as clipboard from './clipboard'

export default {
    [Namespace.FS]: () => fs,
    [Namespace.Clipboard]: () => clipboard,
} satisfies NamespaceExport