import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import {
  NeynarCastCard,
  NeynarCastCardProps,
} from "../organisms/NeynarCastCard";
import { CastCard, CastCardProps } from "../molecules/CastCard";

const meta: Meta<typeof NeynarCastCard> = {
  title: "NeynarCastCard",
  component: NeynarCastCard,
};

export default meta;

const Template: StoryFn<CastCardProps> = (args) => <CastCard {...args} />;
const TemplateWithCast: StoryFn<NeynarCastCardProps> = ({
  identifier,
  viewerFid,
  hash,
  url
}) => <NeynarCastCard identifier={identifier} viewerFid={viewerFid} hash={hash} url={url} />;

export const Primary = Template.bind({});
Primary.args = {
  username: "rish",
  displayName: "rish",
  avatarImgUrl: "https://i.imgur.com/naZWL9n.gif",
  text: "might have gotten too many pastries",
  identifier: 'hash',
  hash: "0xcc752c5511366aa87e5628706a94ffb5fea8f12a",
  viewerFid: 2,
  replies: 63,
  likes: 413,
  channel: { id: "paris", name: "Paris", url: "https://farcaster.group/paris" },
  embeds: [{ url: "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/ce5140cb-12ec-4b37-96f1-7b390e35e400/original" }],
  hasPowerBadge: true,
  isOwnProfile: true,
  onCast: () => {},
};
Primary.argTypes = {
  fid: { table: { disable: true } },
  viewerFid: { table: { disable: true } },
  onCast: { table: { disable: true } },
};

export const WithCast = TemplateWithCast.bind({});
WithCast.args = {
  identifier: 'url',
  hash: "",
  viewerFid: 2,
  url: "https://warpcast.com/nicholas/0xd06c1e56"
};