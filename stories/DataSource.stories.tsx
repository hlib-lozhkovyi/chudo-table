import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Demo } from '../src/demo'

export default {
  title: "Examples/DataSource",
  component: Demo,
  argTypes: {

  },
} as ComponentMeta<typeof Demo>;


interface User {
  id: string;
  avatar: string;
  email: string;
}

const Template: ComponentStory<typeof Demo> = (args) => <Demo {...args} />

export const Default = Template.bind({});
Default.args = {

};