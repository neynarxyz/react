import React from "react";
import type { Preview } from "@storybook/react";
import { NeynarContextProvider } from "../src/contexts/NeynarContextProvider";
import { Theme } from "../src/enums";

import "../dist/style.css";

const withNeynarProvider = (Story) => (
  <NeynarContextProvider
    settings={{
      clientId: process.env.CLIENT_ID || "",
      defaultTheme: Theme.Light,
      eventsCallbacks: {
        onAuthSuccess(params) {
          console.log(`User ${params.user.username} authenticated`);
        },
        onSignout(user) {
          console.log(`User ${user?.username} signed out`);
        },
      },
    }}
  >
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
