import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import {
  NeynarProfileCard,
  NeynarProfileCardProps,
} from "../organisms/NeynarProfileCard";
import { ProfileCard, ProfileCardProps } from "../molecules/ProfileCard";

const meta: Meta<typeof NeynarProfileCard> = {
  title: "NeynarProfileCard",
  component: NeynarProfileCard,
};

export default meta;

const Template: StoryFn<ProfileCardProps> = (args) => <ProfileCard {...args} />;
const TemplateWithUser: StoryFn<NeynarProfileCardProps> = ({
  fid,
  viewerFid,
  customStyles,
}) => <NeynarProfileCard fid={fid} viewerFid={viewerFid} customStyles={customStyles} />;

export const Primary = Template.bind({});
Primary.args = {
  username: "rish",
  displayName: "rish",
  avatarImgUrl: "https://i.imgur.com/naZWL9n.gif",
  bio: "building /neynar 🪐 | neynar.com | /rish",
  followers: 127364,
  following: 676,
  hasPowerBadge: true,
  isOwnProfile: true,
  isFollowing: true,
  onCast: () => {},
};
Primary.argTypes = {
  fid: { table: { disable: true } },
  viewerFid: { table: { disable: true } },
  onCast: { table: { disable: true } },
};

export const WithUser = TemplateWithUser.bind({});
WithUser.args = {
  fid: 1,
  viewerFid: 1,
};

export const WithCustomStyling = TemplateWithUser.bind({});
WithCustomStyling.args = {
  fid: 1,
  viewerFid: 1,
  customStyles: { background: "black", color: "white" },
};

export const WithEmptyPFPUser = TemplateWithUser.bind({});
WithEmptyPFPUser.args = {
  fid: 512026,
  viewerFid: 1,
};