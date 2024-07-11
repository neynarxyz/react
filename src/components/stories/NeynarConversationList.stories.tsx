import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { NeynarConversationList, NeynarConversationListProps } from '../organisms/NeynarConversationList';

const meta: Meta<typeof NeynarConversationList> = {
  title: "NeynarConversationList",
  component: NeynarConversationList,
};

export default meta;

const Template: StoryFn<NeynarConversationListProps> = (args) => <NeynarConversationList {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  type: 'url',
  identifier: 'https://warpcast.com/dwr.eth/0x1b0792bc',
  reply_depth: 2,
  include_chronological_parent_casts: false,
  limit: 20,
  viewer_fid: 2,
};