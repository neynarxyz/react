import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { NeynarSigninButton } from "./index";

export default {
  title: "NeynarSigninButton",
  component: NeynarSigninButton,
} as Meta;

const Template: StoryFn = (args) => (
  <NeynarSigninButton onClick={() => alert("Hello from Neynar")} {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  primary: true,
  label: "Sign in with Neynar",
};
