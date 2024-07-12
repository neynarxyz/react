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
  feed_type: 'following',
  filter_type: 'embed_url',
  fid: 2,
  parent_url: "",
  channel_id: "",
  embed_url: "",
  with_recasts: true,
  limit: 25,
  viewerFid: 2,
};

export const ChannelById = Template.bind({});
ChannelById.args = {
  feed_type: 'filter',
  filter_type: 'channel_id',
  fid: 2,
  parent_url: "",
  channel_id: "dev",
  embed_url: "",
  with_recasts: true,
  limit: 25,
  viewerFid: 2,
};

export const ChannelByParentUrl = Template.bind({});
ChannelByParentUrl.args = {
  feed_type: 'filter',
  filter_type: 'parent_url',
  fid: 2,
  parent_url: "chain://eip155:1/erc721:0xa45662638e9f3bbb7a6fecb4b17853b7ba0f3a60",
  channel_id: "",
  embed_url: "",
  with_recasts: true,
  limit: 25,
  viewerFid: 2,
};

export const EmbedUrl = Template.bind({});
EmbedUrl.args = {
  feed_type: 'filter',
  filter_type: 'embed_url',
  fid: 2,
  parent_url: "",
  channel_id: "",
  embed_url: "paragraph.xyz",
  with_recasts: true,
  limit: 25,
  viewerFid: 2,
};

export const ProfileByFID = Template.bind({});
ProfileByFID.args = {
  feed_type: 'filter',
  filter_type: 'fids',
  fid: 2,
  fids: "616",
  parent_url: "",
  channel_id: "",
  embed_url: "",
  with_recasts: true,
  limit: 25,
  viewerFid: 2,
};