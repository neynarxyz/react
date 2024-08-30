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
  type,
  identifier,
  viewerFid,
  allowReactions,
  renderEmbeds,
  renderFrames,
  onFrameBtnPress
}) => (
  <NeynarCastCard
    type={type}
    identifier={identifier}
    viewerFid={viewerFid}
    allowReactions={allowReactions}
    renderEmbeds={renderEmbeds}
    renderFrames={renderFrames}
    onFrameBtnPress={onFrameBtnPress}
  />
);

const TemplateWithCustomStyling: StoryFn<NeynarCastCardProps> = ({
  type,
  identifier,
  viewerFid,
  allowReactions,
  renderEmbeds,
  renderFrames,
  containerStyles
}) => (
  <NeynarCastCard
    type={type}
    identifier={identifier}
    viewerFid={viewerFid}
    allowReactions={allowReactions}
    renderEmbeds={renderEmbeds}
    renderFrames={renderFrames}
    containerStyles={containerStyles}
  />
);

export const Primary = Template.bind({});
Primary.args = {
  username: "rish",
  displayName: "rish",
  avatarImgUrl: "https://i.imgur.com/naZWL9n.gif",
  text: "might have gotten too many pastries",
  type: 'hash',
  identifier: "0xcc752c5511366aa87e5628706a94ffb5fea8f12a",
  viewerFid: 2,
  reactions: { likes_count: 413, recasts_count: 63, likes: [] },
  replies: 63,
  channel: { id: "paris", name: "Paris", url: "https://farcaster.group/paris" },
  embeds: [{ url: "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/ce5140cb-12ec-4b37-96f1-7b390e35e400/original" }],
  frames: [],
  hasPowerBadge: true,
  isOwnProfile: true,
  onCast: () => {},
  allowReactions: false,
  renderEmbeds: true,
  renderFrames: false
};
Primary.argTypes = {
  fid: { table: { disable: true } },
  viewerFid: { table: { disable: true } },
  onCast: { table: { disable: true } },
};

export const WithCast = TemplateWithCast.bind({});
WithCast.args = {
  type: 'url',
  identifier: "https://warpcast.com/dylsteck.eth/0xda6b1699",
  allowReactions: false,
  renderEmbeds: true,
  renderFrames: false
};

export const CastWithQuoteCast = TemplateWithCast.bind({});
CastWithQuoteCast.args = {
  type: 'url',
  identifier: "https://warpcast.com/nonlinear.eth/0x4e09e86c",
  allowReactions: false,
  renderEmbeds: true,
  renderFrames: false
};

export const CastWithImage = TemplateWithCast.bind({});
CastWithImage.args = {
  type: 'url',
  identifier: "https://warpcast.com/rish/0xcc752c55",
  allowReactions: false,
  renderEmbeds: true,
  renderFrames: false
};

export const CastWithImageAndLink = TemplateWithCast.bind({});
CastWithImageAndLink.args = {
  type: 'url',
  identifier: "https://warpcast.com/giuseppe/0x1805c345",
  allowReactions: false,
  renderEmbeds: true,
  renderFrames: false
};

export const CastWithTwoImages = TemplateWithCast.bind({});
CastWithTwoImages.args = {
  type: 'url',
  identifier: "https://warpcast.com/nicholas/0xd06c1e56",
  allowReactions: false,
  renderEmbeds: true,
  renderFrames: false
};

export const CastWithVideo = TemplateWithCast.bind({});
CastWithVideo.args = {
  type: 'url',
  identifier: "https://warpcast.com/coinbasewallet/0xb9dee5f9",
  allowReactions: false,
  renderEmbeds: true,
  renderFrames: false
};

const emptyFunction = () => {
  return;
};

export const CastWithFrame = TemplateWithCast.bind({});
CastWithFrame.args = {
  type: 'url',
  identifier: "https://warpcast.com/slokh/0x57e03c32",
  allowReactions: false,
  renderEmbeds: true,
  renderFrames: true,
  onFrameBtnPress: emptyFunction
};

export const WithCustomStyling = TemplateWithCustomStyling.bind({});
WithCustomStyling.args = {
  type: 'url',
  identifier: "https://warpcast.com/dylsteck.eth/0xda6b1699",
  allowReactions: false,
  renderEmbeds: true,
  renderFrames: false,
  containerStyles: { background: "black", color: "white" },
};