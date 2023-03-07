import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Test } from '../src/test'

export default {
  title: "Examples/DataSource",
  component: Test,
  argTypes: {

  },
} as ComponentMeta<typeof Test>;


interface User {
  id: string;
  avatar: string;
  email: string;
}

const Template: ComponentStory<typeof Test> = (args) => <Test {...args} />

export const Default = Template.bind({});
Default.args = {

};