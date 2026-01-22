import type { Meta, StoryObj } from '@storybook/html'
import { createSignal } from 'pulsar/reactivity'

const meta: Meta = {
  title: 'Test/WithPulsar',
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj

export const SignalTest: Story = {
  render: () => {
    const [count, setCount] = createSignal(0)
    
    const container = document.createElement('div')
    container.style.cssText = 'padding: 20px;'
    
    const countEl = document.createElement('div')
    countEl.textContent = `Count: ${count()}`
    
    const button = document.createElement('button')
    button.textContent = 'Increment'
    button.onclick = () => setCount(count() + 1)
    
    container.appendChild(countEl)
    container.appendChild(button)
    
    return container
  },
}
