export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  layout: 'centered',
};

export const decorators = [
  (Story) => (
    <div style={{ minWidth: '720px' }}>
      <Story />
    </div>
  ),
];
