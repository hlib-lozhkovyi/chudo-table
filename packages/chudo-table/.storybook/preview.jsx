export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  layout: 'centered',
};

export const decorators = [
  (Story) => (
    <div style={{ width: '900px', margin: '0 auto', padding: `2rem` }}>
      <Story />
    </div>
  ),
];
