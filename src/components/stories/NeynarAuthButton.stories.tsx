import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { SIWN_variant } from "../../enums";
import { NeynarAuthButton } from "../organisms/NeynarAuthButton";

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
