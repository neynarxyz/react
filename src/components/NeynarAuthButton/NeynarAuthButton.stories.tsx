import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { NeynarAuthButton } from "./index";

export default {
  title: "NeynarAuthButton",
  component: NeynarAuthButton,
} as Meta;

const Template: StoryFn = (args) => (
  <NeynarAuthButton onClick={() => alert("Hello from Neynar")} {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  primary: true,
  label: "Sign in with Neynar",
};
