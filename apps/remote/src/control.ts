import './global.scss'
import { mount } from 'svelte'
import Control from './Control.svelte'
import { initWebSocket } from './etc/control';

const app = mount(Control, {
  target: document.getElementById('app')!,
})

document.addEventListener('DOMContentLoaded', initWebSocket);

export default app
