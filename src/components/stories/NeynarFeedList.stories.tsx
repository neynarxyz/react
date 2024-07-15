import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { NeynarFeedList, NeynarFeedListProps } from '../organisms/NeynarFeedList';

const meta: Meta<typeof NeynarFeedList> = {
  title: "NeynarFeedList",
  component: NeynarFeedList,
};

export default meta;

const Template: StoryFn<NeynarFeedListProps> = (args) => <NeynarFeedList {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  feedType: 'following',
  filterType: 'embed_url',
  fid: 2,
  parentUrl: "",
  channelId: "",
  embedUrl: "",
  withRecasts: true,
  limit: 25,
  viewerFid: 2,
};

export const ChannelById = Template.bind({});
ChannelById.args = {
  feedType: 'filter',
  filterType: 'channel_id',
  fid: 2,
  parentUrl: "",
  channelId: "dev",
  embedUrl: "",
  withRecasts: true,
  limit: 25,
  viewerFid: 2,
};

export const ChannelByParentUrl = Template.bind({});
ChannelByParentUrl.args = {
  feedType: 'filter',
  filterType: 'parent_url',
  fid: 2,
  parentUrl: "chain://eip155:1/erc721:0xa45662638e9f3bbb7a6fecb4b17853b7ba0f3a60",
  channelId: "",
  embedUrl: "",
  withRecasts: true,
  limit: 25,
  viewerFid: 2,
};

export const EmbedUrl = Template.bind({});
EmbedUrl.args = {
  feedType: 'filter',
  filterType: 'embed_url',
  fid: 2,
  parentUrl: "",
  channelId: "",
  embedUrl: "paragraph.xyz",
  withRecasts: true,
  limit: 25,
  viewerFid: 2,
};

export const ProfileByFID = Template.bind({});
ProfileByFID.args = {
  feedType: 'filter',
  filterType: 'fids',
  fid: 2,
  fids: "616",
  parentUrl: "",
  channelId: "",
  embedUrl: "",
  withRecasts: true,
  limit: 25,
  viewerFid: 2,
};