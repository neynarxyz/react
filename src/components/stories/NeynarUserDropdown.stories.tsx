import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import NeynarUserDropdown, { NeynarUserDropdownProps } from '../organisms/NeynarUserDropdown';

const meta: Meta<typeof NeynarUserDropdown> = {
  title: "NeynarUserDropdown",
  component: NeynarUserDropdown,
};

export default meta;

const Template: StoryFn<NeynarUserDropdownProps> = (args) => (
  <div style={{ maxWidth: "400px" }}>
    <NeynarUserDropdown {...args} />
  </div>
);
const TemplateWithOnChange: StoryFn<NeynarUserDropdownProps> = (args) => {
  const [value, setValue] = React.useState<string>('');
  return (
  <div style={{ maxWidth: "400px" }}>
    <NeynarUserDropdown {...args} value={value} onChange={(value) => {
      console.log(value);
      setValue(value);
    }} />
  </div>
  );
}


export const Default = Template.bind({});
Default.args = {
  viewerFid: 3,
};

export const WithOnChange = TemplateWithOnChange.bind({});

export const WithPrefilledValue = Template.bind({});
WithPrefilledValue.args = {
  ...Default.args,
  initialValue: "123, 456, dwr",
};

export const WithCustomPlaceholder = Template.bind({});
WithCustomPlaceholder.args = {
  ...Default.args,
  placeholder: "Enter FIDs or usernames (e.g., 123, dwr)",
};

export const Disabled = Template.bind({});
Disabled.args = {
  ...Default.args,
  disabled: true,
};

export const WithCustomStyling = Template.bind({});
WithCustomStyling.args = {
  ...Default.args,
  style: {
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f0f0f0",
    borderRadius: "8px",
    padding: "10px",
  },
};

// Example of a story with a mock for the fetch function
export const WithMockedData = Template.bind({});
WithMockedData.args = {
  ...Default.args,
};
WithMockedData.parameters = {
  mockData: [
    {
      url: "*/v2/farcaster/user/search*",
      method: "GET",
      status: 200,
      response: {
        users: [
          { fid: 1, username: "user1", display_name: "User One", pfp_url: "https://example.com/user1.jpg" },
          { fid: 2, username: "user2", display_name: "User Two", pfp_url: "https://example.com/user2.jpg" },
        ],
      },
    },
  ],
};

Default.argTypes = {
  viewerFid: { control: 'number' },
};