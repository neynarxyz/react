import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { ProfileCard, ProfileCardProps } from "./components/ProfileCard";

const meta: Meta<typeof ProfileCard> = {
  title: "ProfileCard",
  component: ProfileCard,
};

export default meta;

const Template: StoryFn<ProfileCardProps> = (args) => <ProfileCard {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  username: "rish",
  displayName: "rish",
  avatarImgUrl: "https://i.imgur.com/naZWL9n.gif",
  bio: "building /neynar 🪐 | neynar.com | /rish",
  followers: 127364,
  following: 676,
  location: "Boston, USA",
  hasPowerBadge: true,
};
