import type { StoryContext, StoryFn } from "@storybook/nextjs";
import type { Preview } from "@storybook/react-vite";
import { AppProviders } from "../components/providers";

const withProviders = (Story: StoryFn, context: StoryContext) => (
  <AppProviders>{Story({}, context)}</AppProviders>
);

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      test: "todo",
    },

    docs: {
      codePanel: true,
    },
  },
  decorators: [withProviders],
};

export default preview;
