import './global.scss'
import Control from './Control.svelte'
import { initWebSocket } from './etc/control';

const app = new Control({
  target: document.getElementById('app')!,
})

document.addEventListener('DOMContentLoaded', initWebSocket);

export default app
