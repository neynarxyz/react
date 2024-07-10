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