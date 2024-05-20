import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { NeynarAuthButton } from "./index";
import { SIWN_variant } from "../../../enums";

export default {
  title: "NeynarAuthButton",
  component: NeynarAuthButton,
} as Meta;

const Template: StoryFn = (args) => <NeynarAuthButton {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  primary: true,
  label: "Sign in with Neynar",
  variant: SIWN_variant.FARCASTER,
};
