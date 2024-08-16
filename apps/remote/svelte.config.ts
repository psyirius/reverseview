import { preprocessMeltUI, sequence } from '@melt-ui/pp'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

export default {
  preprocess: sequence([
      vitePreprocess(),
      preprocessMeltUI(), // must be at the end
  ])
};
