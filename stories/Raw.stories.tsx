import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import * as Table from "../src/table";

export default {
  title: "Examples/Raw",
  component: Table.Wrapper,
  argTypes: {

  },
} as ComponentMeta<typeof Table.Wrapper>;

const Template: ComponentStory<typeof Table.Wrapper> = (args) => {
  const { columns, data, ...props } = args

  return (
    <Table.Wrapper>
      <Table.Root>
        <Table.Header>
          <Table.HeaderRow>
            <Table.Column>ID</Table.Column>
            <Table.Column>Name</Table.Column>
          </Table.HeaderRow>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>1</Table.Cell>
            <Table.Cell>Test</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>2</Table.Cell>
            <Table.Cell>Test</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>
    </Table.Wrapper>
  )
}

export const Default = Template.bind({});
Default.args = {

};