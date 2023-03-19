import React from 'react';
import { within, userEvent } from '@storybook/testing-library';

import { RemoteData } from './RemoteData';

export default {
  title: 'Example/RemoteData',
  component: RemoteData,
  parameters: {
    layout: 'fullscreen',
  },
};

const Template = (args) => <RemoteData {...args} />;

export const Default = Template.bind({});