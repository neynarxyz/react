// src/components/molecules/Cast/Cast.stories.tsx
import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import Cast, { CastProps } from "../molecules/Cast";

export default {
  title: "Molecules/Cast",
  component: Cast,
} as Meta;

const Template: StoryFn<CastProps> = (args) => <Cast {...args} />;

export const Default = Template.bind({});
Default.args = {
  object: "cast",
  hash: "0xb1c32921f3374c2725eb3bad7e7aa9160d834140",
  thread_hash: "0xb1c32921f3374c2725eb3bad7e7aa9160d834140",
  parent_hash: null,
  parent_url: null,
  root_parent_url: null,
  parent_author: {
    fid: null,
  },
  author: {
    object: "user",
    fid: 19960,
    custody_address: "0xd1b702203b1b3b641a699997746bd4a12d157909",
    username: "shreyas-chorge",
    display_name: "Shreyas",
    pfp_url: "https://i.imgur.com/LPzRlQl.jpg",
    profile: {
      bio: {
        text: "Everyday regular normal guy | 👨‍💻 @neynar",
      },
    },
    follower_count: 187,
    following_count: 116,
    verifications: [
      "0xd1b702203b1b3b641a699997746bd4a12d157909",
      "0x7ea5dada4021c2c625e73d2a78882e91b93c174c",
    ],
    verified_addresses: {
      eth_addresses: [
        "0xd1b702203b1b3b641a699997746bd4a12d157909",
        "0x7ea5dada4021c2c625e73d2a78882e91b93c174c",
      ],
      sol_addresses: [],
    },
    active_status: "inactive",
    power_badge: true,
    viewer_context: {
      following: true,
      followed_by: true,
    },
  },
  text: "Single image embed",
  timestamp: "2024-06-12T13:41:03.000Z",
  embeds: [
    {
      url: "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/ea20b235-617a-4c06-6bf4-2d9a65ba1a00/original",
    },
    {
      url: "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/ea20b235-617a-4c06-6bf4-2d9a65ba1a00/original",
    },
  ],
  reactions: {
    likes_count: 1,
    recasts_count: 1,
    likes: [
      {
        fid: 19960,
        fname: "shreyas-chorge",
      },
    ],
    recasts: [
      {
        fid: 19960,
        fname: "shreyas-chorge",
      },
    ],
  },
  replies: {
    count: 1,
  },
  mentioned_profiles: [],
  viewer_context: {
    liked: false,
    recasted: false,
  },
};
