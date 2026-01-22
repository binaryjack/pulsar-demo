import { Button, ComponentConfigBuilder, ComponentStylingBuilder, Input } from '@atomos/prime'
import type { Meta, StoryObj } from '@storybook/html'
import { createEffect } from 'pulsar'
import { useEffect, useState } from 'pulsar/hooks'

/**
 * Pulsar Hooks Demo
 * Demonstrates useState, useEffect, useMemo, and useRef
 */
const meta: Meta = {
  title: 'Pulsar Demos/Hooks',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## Pulsar Hooks API

Familiar React-like hooks for managing component state and effects:
- **useState**: Local component state
- **useEffect**: Side effects and lifecycle
- **useMemo**: Memoized computations
- **useRef**: DOM references and mutable values

### Composable & Reusable
Build custom hooks to share logic across components.
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj

export const UseStateDemo: Story = {
  render: () => {
    const [count, setCount] = useState(0)
    const [name, setName] = useState('Pulsar')
    const [items, setItems] = useState<string[]>([])
    const [inputValue, setInputValue] = useState('')

    const container = document.createElement('div')
    container.style.cssText = 'padding: 20px; max-width: 600px;'

    const title = document.createElement('h2')
    title.textContent = 'useState Hook'
    container.appendChild(title)

    const desc = document.createElement('p')
    desc.style.cssText = 'background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;'
    desc.textContent = '🪝 useState manages local component state with automatic reactivity.'
    container.appendChild(desc)

    // Counter section
    const counterSection = document.createElement('div')
    counterSection.style.cssText = 'background: white; padding: 20px; border-radius: 8px; margin: 15px 0; border: 2px solid #e0e0e0;'
    
    const counterTitle = document.createElement('h3')
    counterTitle.textContent = 'Counter State'
    counterSection.appendChild(counterTitle)

    const counterDisplay = document.createElement('div')
    counterDisplay.style.cssText = 'font-size: 2rem; margin: 15px 0; color: #667eea; font-weight: bold;'
    counterDisplay.textContent = `Count: ${count()}`
    counterSection.appendChild(counterDisplay)

    const counterBtns = document.createElement('div')
    counterBtns.style.cssText = 'display: flex; gap: 10px;'
    
    const incBtn = Button({
      config: new ComponentConfigBuilder('primary').build(),
      styling: new ComponentStylingBuilder().build(),
      children: '+1',
      onclick: () => {
        setCount(count() + 1)
        counterDisplay.textContent = `Count: ${count()}`
      }
    })
    
    const decBtn = Button({
      config: new ComponentConfigBuilder('secondary').build(),
      styling: new ComponentStylingBuilder().build(),
      children: '-1',
      onclick: () => {
        setCount(count() - 1)
        counterDisplay.textContent = `Count: ${count()}`
      }
    })

    counterBtns.appendChild(incBtn)
    counterBtns.appendChild(decBtn)
    counterSection.appendChild(counterBtns)
    container.appendChild(counterSection)

    // Name input section
    const nameSection = document.createElement('div')
    nameSection.style.cssText = 'background: white; padding: 20px; border-radius: 8px; margin: 15px 0; border: 2px solid #e0e0e0;'
    
    const nameTitle = document.createElement('h3')
    nameTitle.textContent = 'String State'
    nameSection.appendChild(nameTitle)

    const nameInput = Input({
      config: new ComponentConfigBuilder('primary').fullWidth(true).build(),
      styling: new ComponentStylingBuilder().build(),
      placeholder: 'Enter your name',
      value: name(),
      oninput: (e) => {
        setName((e.target as HTMLInputElement).value)
        greeting.textContent = `Hello, ${name()}! 👋`
      }
    })

    const greeting = document.createElement('p')
    greeting.style.cssText = 'font-size: 1.5rem; margin: 15px 0; color: #764ba2;'
    greeting.textContent = `Hello, ${name()}! 👋`

    nameSection.appendChild(nameInput)
    nameSection.appendChild(greeting)
    container.appendChild(nameSection)

    // Array state section
    const arraySection = document.createElement('div')
    arraySection.style.cssText = 'background: white; padding: 20px; border-radius: 8px; margin: 15px 0; border: 2px solid #e0e0e0;'
    
    const arrayTitle = document.createElement('h3')
    arrayTitle.textContent = 'Array State'
    arraySection.appendChild(arrayTitle)

    const arrayInputContainer = document.createElement('div')
    arrayInputContainer.style.cssText = 'display: flex; gap: 10px; margin: 15px 0;'

    const arrayInput = Input({
      config: new ComponentConfigBuilder('primary').fullWidth(true).build(),
      styling: new ComponentStylingBuilder().build(),
      placeholder: 'Add an item',
      value: inputValue(),
      oninput: (e) => setInputValue((e.target as HTMLInputElement).value),
      onkeypress: (e) => {
        if (e.key === 'Enter' && inputValue().trim()) {
          setItems([...items(), inputValue()])
          setInputValue('')
          renderItemsList()
        }
      }
    })

    const addBtn = Button({
      config: new ComponentConfigBuilder('success').build(),
      styling: new ComponentStylingBuilder().build(),
      children: 'Add',
      onclick: () => {
        if (inputValue().trim()) {
          setItems([...items(), inputValue()])
          setInputValue('')
          renderItemsList()
        }
      }
    })

    arrayInputContainer.appendChild(arrayInput)
    arrayInputContainer.appendChild(addBtn)
    arraySection.appendChild(arrayInputContainer)

    const itemsList = document.createElement('div')
    itemsList.style.cssText = 'margin: 15px 0;'

    const renderItemsList = () => {
      itemsList.innerHTML = ''
      items().forEach((item, index) => {
        const itemEl = document.createElement('div')
        itemEl.style.cssText = 'display: flex; align-items: center; justify-content: space-between; padding: 10px; margin: 5px 0; background: #f5f5f5; border-radius: 4px;'
        
        const itemText = document.createElement('span')
        itemText.textContent = item
        
        const removeBtn = Button({
          config: new ComponentConfigBuilder('error').size('sm').build(),
          styling: new ComponentStylingBuilder().build(),
          children: 'Remove',
          onclick: () => {
            setItems(items().filter((_, i) => i !== index))
            renderItemsList()
          }
        })
        
        itemEl.appendChild(itemText)
        itemEl.appendChild(removeBtn)
        itemsList.appendChild(itemEl)
      })
      
      if (items().length === 0) {
        itemsList.innerHTML = '<p style="color: #999; font-style: italic;">No items yet</p>'
      }
    }

    renderItemsList()
    arraySection.appendChild(itemsList)
    container.appendChild(arraySection)

    return container
  },
}

export const UseEffectDemo: Story = {
  render: () => {
    const [seconds, setSeconds] = useState(0)
    const [isRunning, setIsRunning] = useState(false)
    const [logs, setLogs] = useState<string[]>([])

    const addLog = (message: string) => {
      const timestamp = new Date().toLocaleTimeString()
      setLogs([...logs(), `[${timestamp}] ${message}`])
    }

    // Effect for timer
    useEffect(() => {
      if (isRunning()) {
        addLog('⏱️ Timer started')
        const interval = setInterval(() => {
          setSeconds(seconds() + 1)
        }, 1000)

        // Cleanup function
        return () => {
          clearInterval(interval)
          addLog('⏸️ Timer stopped')
        }
      }
    }, [isRunning])

    const container = document.createElement('div')
    container.style.cssText = 'padding: 20px; max-width: 600px;'

    const title = document.createElement('h2')
    title.textContent = 'useEffect Hook'
    container.appendChild(title)

    const desc = document.createElement('p')
    desc.style.cssText = 'background: #fff3cd; padding: 15px; border-radius: 8px; margin: 15px 0;'
    desc.textContent = '⚡ useEffect runs side effects and supports cleanup functions. Watch the logs!'
    container.appendChild(desc)

    // Timer display
    const timerDisplay = document.createElement('div')
    timerDisplay.style.cssText = 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; border-radius: 12px; margin: 20px 0; text-align: center;'
    const timerValue = document.createElement('div')
    timerValue.style.cssText = 'font-size: 4rem; font-weight: bold;'
    timerValue.textContent = seconds().toString()
    const timerLabel = document.createElement('p')
    timerLabel.style.cssText = 'margin: 10px 0 0 0; font-size: 1.2rem;'
    timerLabel.textContent = 'Seconds Elapsed'
    timerDisplay.appendChild(timerValue)
    timerDisplay.appendChild(timerLabel)
    container.appendChild(timerDisplay)

    // Update display
    useEffect(() => {
      timerValue.textContent = seconds().toString()
    }, [seconds])

    // Controls
    const controls = document.createElement('div')
    controls.style.cssText = 'display: flex; gap: 10px; margin: 20px 0;'

    const toggleBtn = Button({
      config: new ComponentConfigBuilder(isRunning() ? 'error' : 'success').build(),
      styling: new ComponentStylingBuilder().build(),
      children: isRunning() ? '⏸️ Stop' : '▶️ Start',
      onclick: () => {
        setIsRunning(!isRunning())
        setTimeout(() => {
          toggleBtn.textContent = isRunning() ? '⏸️ Stop' : '▶️ Start'
        }, 0)
      }
    })

    const resetBtn = Button({
      config: new ComponentConfigBuilder('secondary').build(),
      styling: new ComponentStylingBuilder().build(),
      children: '🔄 Reset',
      onclick: () => {
        setSeconds(0)
        setIsRunning(false)
        addLog('🔄 Timer reset')
        renderLogs()
      }
    })

    controls.appendChild(toggleBtn)
    controls.appendChild(resetBtn)
    container.appendChild(controls)

    // Logs section
    const logsSection = document.createElement('div')
    logsSection.style.cssText = 'background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; max-height: 300px; overflow-y: auto;'
    const logsTitle = document.createElement('h3')
    logsTitle.textContent = 'Effect Logs'
    logsSection.appendChild(logsTitle)

    const logsList = document.createElement('div')
    logsList.style.cssText = 'font-family: monospace; font-size: 0.9rem;'

    const renderLogs = () => {
      logsList.innerHTML = logs().reverse().map(log => 
        `<div style="padding: 5px; border-bottom: 1px solid #ddd;">${log}</div>`
      ).join('') || '<p style="color: #999;">No logs yet</p>'
    }

    useEffect(() => {
      renderLogs()
    }, [logs])

    renderLogs()
    logsSection.appendChild(logsList)
    container.appendChild(logsSection)

    return container
  },
}

export const UseMemoDemo: Story = {
  render: () => {
    // Use Pulsar's core reactivity for proper tracking
    const [items, setItems] = createSignal<number[]>([1, 2, 3, 4, 5])
    const [filter, setFilter] = createSignal<'all' | 'even' | 'odd'>('all')
    let computeCount = 0

    // Memoized expensive computation
    const filteredItems = createMemo(() => {
      computeCount++
      console.log('Computing filtered items...', computeCount)
      
      switch (filter()) {
        case 'even':
          return items().filter(n => n % 2 === 0)
        case 'odd':
          return items().filter(n => n % 2 !== 0)
        default:
          return items()
      }
    })

    const sum = createMemo(() => {
      return filteredItems().reduce((acc, n) => acc + n, 0)
    })

    const container = document.createElement('div')
    container.style.cssText = 'padding: 20px; max-width: 600px;'

    const title = document.createElement('h2')
    title.textContent = 'useMemo Hook'
    container.appendChild(title)

    const desc = document.createElement('p')
    desc.style.cssText = 'background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;'
    desc.textContent = '🧮 useMemo caches expensive computations. Only recalculates when dependencies change.'
    container.appendChild(desc)

    // Stats
    const stats = document.createElement('div')
    stats.style.cssText = 'background: #f3e5f5; padding: 20px; border-radius: 12px; margin: 20px 0;'
    
    const computeCountSpan = document.createElement('span')
    const filteredCountSpan = document.createElement('span')
    const sumValueSpan = document.createElement('span')
    
    stats.innerHTML = `
      <div><strong>Computation count:</strong> <span id="compute-count"></span></div>
      <div><strong>Items:</strong> ${items().length}</div>
      <div><strong>Filtered:</strong> <span id="filtered-count"></span></div>
      <div><strong>Sum:</strong> <span id="sum-value"></span></div>
    `
    container.appendChild(stats)
    
    // Get references after adding to DOM
    const computeEl = stats.querySelector('#compute-count') as HTMLElement
    const filteredEl = stats.querySelector('#filtered-count') as HTMLElement
    const sumEl = stats.querySelector('#sum-value') as HTMLElement

    // Filter controls
    const filters = document.createElement('div')
    filters.style.cssText = 'display: flex; gap: 10px; margin: 20px 0;'

    const filterButtons = [
      { label: 'All', value: 'all' },
      { label: 'Even', value: 'even' },
      { label: 'Odd', value: 'odd' },
    ]

    const buttons: HTMLElement[] = []
    filterButtons.forEach(({ label, value }) => {
      const btn = Button({
        config: new ComponentConfigBuilder('secondary').build(),
        styling: new ComponentStylingBuilder().build(),
        children: label,
        onclick: () => {
          setFilter(value as any)
        }
      })
      buttons.push(btn)
      filters.appendChild(btn)
    })

    container.appendChild(filters)

    // Items display
    const itemsDisplay = document.createElement('div')
    itemsDisplay.style.cssText = 'display: flex; gap: 10px; flex-wrap: wrap; margin: 20px 0;'
    container.appendChild(itemsDisplay)

    // Reactively update everything when filter changes
    createEffect(() => {
      const currentFilter = filter()
      const filtered = filteredItems()
      const currentSum = sum()
      
      // Update button styles
      buttons.forEach((btn, idx) => {
        const isActive = filterButtons[idx].value === currentFilter
        btn.className = ''
        // Re-apply appropriate styling
        if (isActive) {
          btn.style.cssText = 'background: #667eea; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 600;'
        } else {
          btn.style.cssText = 'background: #e2e8f0; color: #4a5568; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;'
        }
      })
      
      // Update stats
      if (computeEl) computeEl.textContent = computeCount.toString()
      if (filteredEl) filteredEl.textContent = filtered.length.toString()
      if (sumEl) sumEl.textContent = currentSum.toString()
      
      // Re-render items
      itemsDisplay.innerHTML = ''
      filtered.forEach(item => {
        const badge = document.createElement('div')
        badge.textContent = item.toString()
        badge.style.cssText = 'background: #667eea; color: white; padding: 15px 25px; border-radius: 8px; font-size: 1.2rem; font-weight: 600; min-width: 50px; text-align: center;'
        itemsDisplay.appendChild(badge)
      })
    })

    return container
  },
}
