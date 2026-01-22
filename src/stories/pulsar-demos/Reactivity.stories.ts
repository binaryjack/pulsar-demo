import { Button, ComponentConfigBuilder, ComponentStylingBuilder } from '@atomos/prime'
import type { Meta, StoryObj } from '@storybook/html'
import { createEffect, createMemo, createSignal } from 'pulsar/reactivity'

/**
 * Pulsar Reactivity Demo
 * Demonstrates signals, effects, and memos
 */
const meta: Meta = {
  title: 'Pulsar Demos/Reactivity',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## Pulsar Reactivity System

Pulsar uses a fine-grained reactivity system with:
- **Signals**: Reactive primitive values
- **Effects**: Side effects that run when dependencies change
- **Memos**: Computed values that cache results

### Key Features:
- Automatic dependency tracking
- Minimal re-renders (only what changed)
- No virtual DOM overhead
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj

export const BasicSignal: Story = {
  render: () => {
    const [count, setCount] = createSignal(0)
    let effectRuns = 0
    
    // Effect runs whenever count changes
    createEffect(() => {
      console.log('Effect triggered! Count is:', count())
      effectRuns++
    })

    const container = document.createElement('div')
    container.style.cssText = 'padding: 20px; max-width: 600px;'

    // Title
    const title = document.createElement('h2')
    title.textContent = 'Signal Demo'
    container.appendChild(title)

    // Description
    const desc = document.createElement('p')
    desc.style.cssText = 'background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;'
    desc.textContent = '⚡ Click the button to update the signal. Watch how ONLY the count updates, not the entire component!'
    container.appendChild(desc)

    // Count display
    const countContainer = document.createElement('div')
    countContainer.style.cssText = 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 12px; margin: 20px 0; text-align: center;'
    
    const countValue = document.createElement('div')
    countValue.style.cssText = 'font-size: 4rem; font-weight: bold;'
    
    // Fine-grained update - only this element updates!
    createEffect(() => {
      countValue.textContent = count().toString()
    })
    
    const countLabel = document.createElement('p')
    countLabel.style.cssText = 'margin: 10px 0 0 0; font-size: 1.2rem;'
    countLabel.textContent = 'Signal Value (updates automatically)'
    
    countContainer.appendChild(countValue)
    countContainer.appendChild(countLabel)
    container.appendChild(countContainer)

    // Effect counter
    const effectCounter = document.createElement('div')
    effectCounter.style.cssText = 'margin: 15px 0;'
    const effectSpan = document.createElement('span')
    createEffect(() => {
      effectSpan.innerHTML = `Effect runs: <strong>${effectRuns}</strong> (should match clicks)`
    })
    effectCounter.appendChild(effectSpan)
    container.appendChild(effectCounter)

    // Buttons
    const buttonContainer = document.createElement('div')
    buttonContainer.style.cssText = 'display: flex; gap: 10px; margin: 20px 0;'
    
    const incrementBtn = Button({
      config: new ComponentConfigBuilder('primary').build(),
      styling: new ComponentStylingBuilder().build(),
      children: 'Increment',
      onclick: () => setCount(count() + 1),
    })
    
    const decrementBtn = Button({
      config: new ComponentConfigBuilder('secondary').build(),
      styling: new ComponentStylingBuilder().build(),
      children: 'Decrement',
      onclick: () => setCount(count() - 1),
    })
    
    const resetBtn = Button({
      config: new ComponentConfigBuilder('error').build(),
      styling: new ComponentStylingBuilder().build(),
      children: 'Reset',
      onclick: () => setCount(0),
    })

    buttonContainer.appendChild(incrementBtn)
    buttonContainer.appendChild(decrementBtn)
    buttonContainer.appendChild(resetBtn)
    container.appendChild(buttonContainer)

    return container
  },
}

export const MemoizedComputation: Story = {
  render: () => {
    const [number, setNumber] = createSignal(5)
    let memoComputations = 0
    let effectRuns = 0

    // Expensive computation (simulated)
    const factorial = createMemo(() => {
      memoComputations++
      console.log('Computing factorial...')
      let result = 1
      for (let i = 2; i <= number(); i++) {
        result *= i
      }
      return result
    })

    const container = document.createElement('div')
    container.style.cssText = 'padding: 20px; max-width: 600px;'

    const title = document.createElement('h2')
    title.textContent = 'Memo Demo - Cached Computations'
    container.appendChild(title)

    const desc = document.createElement('p')
    desc.style.cssText = 'background: #fff3cd; padding: 15px; border-radius: 8px; margin: 15px 0;'
    desc.textContent = '🧮 Memos cache expensive computations. Try accessing factorial multiple times - it only computes once per value!'
    container.appendChild(desc)

    // Input
    const inputContainer = document.createElement('div')
    inputContainer.style.cssText = 'margin: 20px 0;'
    const input = document.createElement('input')
    input.type = 'number'
    input.value = '5'
    input.min = '0'
    input.max = '20'
    input.style.cssText = 'padding: 10px; font-size: 1rem; border: 2px solid #ddd; border-radius: 8px;'
    input.oninput = (e) => {
      const val = parseInt((e.target as HTMLInputElement).value) || 0
      setNumber(Math.min(20, Math.max(0, val)))
    }
    inputContainer.appendChild(input)
    container.appendChild(inputContainer)

    // Results
    const resultContainer = document.createElement('div')
    resultContainer.style.cssText = 'background: #e8f5e9; padding: 20px; border-radius: 12px; margin: 20px 0;'
    
    const numberDisplay = document.createElement('div')
    const factorialDisplay = document.createElement('div')
    const computationsDisplay = document.createElement('div')
    
    createEffect(() => {
      effectRuns++
      numberDisplay.innerHTML = `<strong>Number:</strong> ${number()}`
      factorialDisplay.innerHTML = `<strong>Factorial:</strong> ${factorial()}`
      computationsDisplay.innerHTML = `<strong>Memo computations:</strong> ${memoComputations} (should be ${effectRuns})`
    })

    resultContainer.appendChild(numberDisplay)
    resultContainer.appendChild(factorialDisplay)
    resultContainer.appendChild(computationsDisplay)
    container.appendChild(resultContainer)

    // Access factorial multiple times to show caching
    const multiAccessBtn = Button({
      config: new ComponentConfigBuilder('success').build(),
      styling: new ComponentStylingBuilder().build(),
      children: 'Access Factorial 5 Times',
      onclick: () => {
        console.log('Accessing factorial 5 times...')
        for (let i = 0; i < 5; i++) {
          console.log(`Access ${i + 1}:`, factorial())
        }
        alert(`Accessed factorial 5 times but only computed once! Check console.`)
      },
    })
    container.appendChild(multiAccessBtn)

    return container
  },
}

export const DependencyTracking: Story = {
  render: () => {
    const [firstName, setFirstName] = createSignal('John')
    const [lastName, setLastName] = createSignal('Doe')
    const [age, setAge] = createSignal(25)
    let fullNameComputations = 0
    let profileComputations = 0

    // Memo depends only on firstName and lastName
    const fullName = createMemo(() => {
      fullNameComputations++
      return `${firstName()} ${lastName()}`
    })

    // Memo depends on all three
    const profile = createMemo(() => {
      profileComputations++
      return `${fullName()}, Age: ${age()}`
    })

    const container = document.createElement('div')
    container.style.cssText = 'padding: 20px; max-width: 600px;'

    const title = document.createElement('h2')
    title.textContent = 'Automatic Dependency Tracking'
    container.appendChild(title)

    const desc = document.createElement('p')
    desc.style.cssText = 'background: #fce4ec; padding: 15px; border-radius: 8px; margin: 15px 0;'
    desc.textContent = '🎯 Pulsar automatically tracks which signals each memo depends on. Change age - fullName memo won\'t recompute!'
    container.appendChild(desc)

    // Inputs
    const inputsContainer = document.createElement('div')
    inputsContainer.style.cssText = 'display: flex; flex-direction: column; gap: 15px; margin: 20px 0;'

    const createInput = (label: string, signal: any, setter: any) => {
      const div = document.createElement('div')
      const labelEl = document.createElement('label')
      labelEl.style.cssText = 'display: block; margin-bottom: 5px; font-weight: bold;'
      labelEl.textContent = label
      const input = document.createElement('input')
      input.type = typeof signal() === 'number' ? 'number' : 'text'
      input.value = signal().toString()
      input.style.cssText = 'padding: 8px; width: 100%; border: 2px solid #ddd; border-radius: 4px;'
      input.oninput = (e) => setter((e.target as HTMLInputElement).value)
      div.appendChild(labelEl)
      div.appendChild(input)
      return div
    }

    inputsContainer.appendChild(createInput('First Name:', firstName, setFirstName))
    inputsContainer.appendChild(createInput('Last Name:', lastName, setLastName))
    inputsContainer.appendChild(createInput('Age:', age, (v: string) => setAge(parseInt(v) || 0)))
    container.appendChild(inputsContainer)

    // Results
    const results = document.createElement('div')
    results.style.cssText = 'background: #f3e5f5; padding: 20px; border-radius: 12px; margin: 20px 0;'

    const fullNameEl = document.createElement('div')
    const profileEl = document.createElement('div')
    const statsEl = document.createElement('div')
    statsEl.style.cssText = 'margin-top: 15px; padding-top: 15px; border-top: 2px solid #ce93d8;'

    createEffect(() => {
      fullNameEl.innerHTML = `<strong>Full Name:</strong> ${fullName()}`
      profileEl.innerHTML = `<strong>Profile:</strong> ${profile()}`
      statsEl.innerHTML = `
        <div>📊 <strong>Full Name computations:</strong> ${fullNameComputations} (only when first/last name changes)</div>
        <div>📊 <strong>Profile computations:</strong> ${profileComputations} (when any field changes)</div>
      `
    })

    results.appendChild(fullNameEl)
    results.appendChild(profileEl)
    results.appendChild(statsEl)
    container.appendChild(results)

    return container
  },
}
