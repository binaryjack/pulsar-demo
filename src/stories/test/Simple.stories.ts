import type { Meta, StoryObj } from '@storybook/html'

const meta: Meta = {
  title: 'Test/Simple',
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj

export const BasicTest: Story = {
  render: () => {
    const container = document.createElement('div')
    container.textContent = 'Hello from Storybook!'
    container.style.cssText = 'padding: 20px; font-size: 24px; color: #667eea;'
    return container
  },
}
