import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Demo } from '../src/demo-remote'

export default {
  title: "Examples/RemoteDataSrouce",
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