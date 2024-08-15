import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { NeynarFrameCard, NeynarFrameCardProps } from "../organisms/NeynarFrameCard";
import FrameCard, { FrameCardProps } from "../molecules/FrameCard";

const meta: Meta<typeof NeynarFrameCard> = {
  title: "NeynarFrameCard",
  component: NeynarFrameCard,
};

export default meta;

const Template: StoryFn<FrameCardProps> = (args) => (
  <div style={{ maxWidth: "40vw" }}>
    <FrameCard {...args} />
  </div>
);

const TemplateWithInteractions: StoryFn<NeynarFrameCardProps> = (args) => (
  <div style={{ maxWidth: "40vw" }}>
    <NeynarFrameCard {...args} />
  </div>
);

export const Primary = Template.bind({});
Primary.args = {
  frames: [
    {
      version: "vNext",
      title: "Introducing Smart Wallets on Paragraph",
      image: "https://paragraph-nextjs-1v3rz6ktt.paragraph.xyz/api/highlight?text=Introducing%20Smart%20Wallets%20on%20Paragraph&author=Paragraph&url=%40blog&avatarUrl=https%3A%2F%2Fstorage.googleapis.com%2Fpapyrus_images%2Fd925b3511c5e20563b83a09cbe30bbf5&featuredImageUrl=https%3A%2F%2Fstorage.googleapis.com%2Fpapyrus_images%2F9a1a388602fbbf0be39a32259b167c84.jpg&size=2048",
      buttons: [
        {
          index: 1,
          title: "Open",
          action_type: "post_redirect",
          post_url: "https://paragraph-nextjs-1v3rz6ktt.paragraph.xyz/api/farcaster/v2/open/blog/BMV6abfvCSUl51ErCVzd/post/3T2PQZlsdQtigUp4fhlb",
        },
        {
          index: 2,
          title: "Read Inline",
          action_type: "post",
          post_url: "https://paragraph-nextjs-1v3rz6ktt.paragraph.xyz/api/farcaster/v2/read/blog/BMV6abfvCSUl51ErCVzd/post/3T2PQZlsdQtigUp4fhlb/0",
        },
        {
          index: 3,
          title: "Subscribe 🔔",
          action_type: "post",
          post_url: "https://paragraph-nextjs-1v3rz6ktt.paragraph.xyz/api/farcaster/v2/subscribe/BMV6abfvCSUl51ErCVzd/3T2PQZlsdQtigUp4fhlb",
        },
        {
          index: 4,
          title: "Mint",
          action_type: "post",
          target: "https://paragraph-nextjs-1v3rz6ktt.paragraph.xyz/api/farcaster/v2/mint-buttons/blog/BMV6abfvCSUl51ErCVzd/post/3T2PQZlsdQtigUp4fhlb",
        },
      ],
      input: {},
      state: {},
      frames_url: "https://paragraph.xyz/@blog/introducing-smart-wallets",
    },
  ],
};

Primary.argTypes = {
  hash: { table: { disable: true } },
  frames: { table: { disable: true } },
};

export const EventsFrame = TemplateWithInteractions.bind({});
EventsFrame.args = {
  url: "https://events.xyz/events/a010d617"
};

export const HighlightFrame = TemplateWithInteractions.bind({});
HighlightFrame.args = {
  url: "https://highlight.xyz/mint/667dfcfe5229c603647108f0"
};

export const ParagraphFrame = TemplateWithInteractions.bind({});
ParagraphFrame.args = {
  url: "https://paragraph.xyz/@blog/introducing-smart-wallets"
};

export const ZoraFrame = TemplateWithInteractions.bind({});
ZoraFrame.args = {
  url: "https://zora.co/collect/base:0xcf6e80defd9be067f5adda2924b55c2186d3e930/5"
};


ParagraphFrame.argTypes = {
  hash: { table: { disable: true } },
  frames: { table: { disable: true } },
};