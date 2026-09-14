/** @type {import('@ladle/react').UserConfig} */
export default {
  stories: 'catalog/**/*.stories.{ts,tsx}',
  defaultStory: 'knob--dial',
  expandStoryTree: true,
  viteConfig: `${process.cwd()}/ladle.vite.config.ts`,
  addons: {
    theme: {
      enabled: false,
      defaultState: 'light',
    },
    width: {
      enabled: true,
      options: {
        compact: 560,
        standard: 800,
        wide: 1000,
      },
      defaultState: 0,
    },
  },
}
