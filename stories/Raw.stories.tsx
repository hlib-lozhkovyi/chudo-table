import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { TableHeader } from '../src/index'
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
    <>
      <TableHeader caption={'Table'} />
      <Table.Wrapper>
        <Table.Root>
          <Table.Head>
            <Table.HeadRow>
              <Table.Column>ID</Table.Column>
              <Table.Column>Name</Table.Column>
            </Table.HeadRow>
          </Table.Head>
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
    </>
  )
}

export const Default = Template.bind({});
Default.args = {

};