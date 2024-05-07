import React from "react";
import type { Preview } from "@storybook/react";
import { NeynarContextProvider } from "../src/contexts/NeynarContextProvider";
import { Theme } from "../src/enums";

import "../dist/style.css";

const withNeynarProvider = (Story) => (
  <NeynarContextProvider clientId="defaultClient" defaultTheme={Theme.Light}>
    <Story />
  </NeynarContextProvider>
);

const preview: Preview = {
  decorators: [withNeynarProvider],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
