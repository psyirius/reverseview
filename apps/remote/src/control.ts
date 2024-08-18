import './global.scss'
import Control from './Control.svelte'

const app = new Control({
  target: document.getElementById('app')!,
})

export default app
