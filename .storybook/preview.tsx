import React from "react";
import type { Preview, Decorator } from "@storybook/react";
import { withThemeByClassName } from "@storybook/addon-themes";
import { NeynarContextProvider } from "../src/contexts/NeynarContextProvider";
import { Theme } from "../src/enums";

import "../dist/style.css";

const themeDecorator = withThemeByClassName({
  defaultTheme: Theme.Light,
  themes: {
    light: "theme-light",
    dark: "theme-dark",
  },
});

const withNeynarProvider: Decorator = (Story, context) => {
  const theme = context.globals.theme || Theme.Light;

  return (
    <NeynarContextProvider
      settings={{
        clientId: process.env.CLIENT_ID || "",
        defaultTheme: theme,
        eventsCallbacks: {
          onAuthSuccess(params) {
            console.log("onAuthSuccess", params);
          },
          onSignout(user) {
            console.log("onSignout", user);
          },
        },
      }}
    >
      <Story />
    </NeynarContextProvider>
  );
};

const preview: Preview = {
  decorators: [themeDecorator, withNeynarProvider],
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
