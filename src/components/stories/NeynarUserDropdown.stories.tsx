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
      <NeynarUserDropdown
        {...args}
        value={value}
        onChange={(value) => {
          console.log(value);
          setValue(value);
        }}
      />
    </div>
  );
};

export const WithOnChange = TemplateWithOnChange.bind({});

export const Default = Template.bind({});
Default.args = {
  viewerFid: 3,
  value: "",
  placeholder: "Enter FIDs or usernames",
  disabled: false,
  customStyles: {dropdown: {background:'red'}},
};

Default.argTypes = {
  viewerFid: { control: 'number' },
  value: { control: 'text' },
  placeholder: { control: 'text' },
  disabled: { control: 'boolean' },
  customStyles: { control: 'object' },
};
