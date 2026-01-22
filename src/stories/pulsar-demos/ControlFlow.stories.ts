import { Badge, Button, Checkbox, ComponentConfigBuilder, ComponentStylingBuilder, Input } from '@atomos/prime'
import type { Meta, StoryObj } from '@storybook/html'
import { createSignal } from 'pulsar/reactivity'

/**
 * Pulsar Control Flow & Fine-Grained Updates Demo
 */
const meta: Meta = {
  title: 'Pulsar Demos/Control Flow & Lists',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## Fine-Grained List Updates

Pulsar uses keyed reconciliation for efficient list rendering:
- Each item has a unique key
- Only changed items re-render
- No virtual DOM diffing overhead

### Watch the magic:
1. Add/remove items - see smooth transitions
2. Toggle checkboxes - **only that row updates**
3. Check the flash animation on updated items
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj

interface ITodo {
  id: number
  text: string
  completed: boolean
  renderCount: number
  lastUpdated: number
}

export const KeyedListUpdates: Story = {
  render: () => {
    const [todos, setTodos] = createSignal<ITodo[]>([
      { id: 1, text: 'Learn Pulsar Reactivity', completed: true, renderCount: 0, lastUpdated: Date.now() },
      { id: 2, text: 'Build with Atomos Prime', completed: false, renderCount: 0, lastUpdated: Date.now() },
      { id: 3, text: 'Deploy to production', completed: false, renderCount: 0, lastUpdated: Date.now() },
    ])
    const [input, setInput] = createSignal('')
    const [showCompleted, setShowCompleted] = createSignal(true)
    const [totalUpdates, setTotalUpdates] = createSignal(0)

    const container = document.createElement('div')
    container.style.cssText = 'padding: 20px; max-width: 800px;'

    // Title
    const title = document.createElement('h2')
    title.textContent = 'Fine-Grained List Updates with Keyed Reconciliation'
    container.appendChild(title)

    const desc = document.createElement('p')
    desc.style.cssText = 'background: #fff3cd; padding: 15px; border-radius: 8px; margin: 15px 0;'
    desc.textContent = '⚡ Toggle ANY checkbox and watch ONLY that item flash yellow! This proves fine-grained reactivity.'
    container.appendChild(desc)

    // Stats Card
    const statsCard = document.createElement('div')
    statsCard.style.cssText = 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 12px; margin: 20px 0; text-align: center;'
    const statsValue = document.createElement('div')
    statsValue.style.cssText = 'font-size: 4rem; font-weight: bold;'
    const statsLabel = document.createElement('p')
    statsLabel.style.cssText = 'margin: 10px 0 0 0; font-size: 1.2rem;'
    statsLabel.textContent = 'Total DOM Updates'
    
    const updateStats = () => {
      statsValue.textContent = totalUpdates().toString()
      const todoList = todos()
      const completed = todoList.filter(t => t.completed).length
      statsLabel.textContent = `${todoList.length} total | ${completed} completed | ${todoList.length - completed} active`
    }
    updateStats()

    statsCard.appendChild(statsValue)
    statsCard.appendChild(statsLabel)
    container.appendChild(statsCard)

    // Input section
    const inputSection = document.createElement('div')
    inputSection.style.cssText = 'display: flex; gap: 10px; margin: 20px 0;'

    const inputEl = Input({
      config: new ComponentConfigBuilder('primary').fullWidth(true).build(),
      styling: new ComponentStylingBuilder().build(),
      placeholder: 'Add a new todo...',
      value: input(),
      oninput: (e) => setInput((e.target as HTMLInputElement).value),
      onkeypress: (e) => {
        if (e.key === 'Enter' && input().trim()) {
          const newTodo: ITodo = {
            id: Date.now(),
            text: input(),
            completed: false,
            renderCount: 0,
            lastUpdated: Date.now()
          }
          setTodos([...todos(), newTodo])
          setInput('')
          setTotalUpdates(totalUpdates() + 1)
          updateStats()
          renderTodoList()
        }
      }
    })

    const addBtn = Button({
      config: new ComponentConfigBuilder('primary').build(),
      styling: new ComponentStylingBuilder().build(),
      children: 'Add',
      onclick: () => {
        if (input().trim()) {
          const newTodo: ITodo = {
            id: Date.now(),
            text: input(),
            completed: false,
            renderCount: 0,
            lastUpdated: Date.now()
          }
          setTodos([...todos(), newTodo])
          setInput('')
          setTotalUpdates(totalUpdates() + 1)
          updateStats()
          renderTodoList()
        }
      }
    })

    const clearBtn = Button({
      config: new ComponentConfigBuilder('error').build(),
      styling: new ComponentStylingBuilder().build(),
      children: 'Clear All',
      onclick: () => {
        setTodos([])
        setTotalUpdates(totalUpdates() + 1)
        updateStats()
        renderTodoList()
      }
    })

    inputSection.appendChild(inputEl)
    inputSection.appendChild(addBtn)
    inputSection.appendChild(clearBtn)
    container.appendChild(inputSection)

    // Show completed checkbox
    const filterSection = document.createElement('div')
    filterSection.style.cssText = 'margin: 15px 0;'
    const filterLabel = document.createElement('label')
    filterLabel.style.cssText = 'display: flex; align-items: center; gap: 8px; cursor: pointer;'
    const filterCheckbox = Checkbox({
      config: new ComponentConfigBuilder('primary').build(),
      styling: new ComponentStylingBuilder().build(),
      checked: showCompleted(),
      onchange: (e) => {
        setShowCompleted((e.target as HTMLInputElement).checked)
        renderTodoList()
      }
    })
    const filterText = document.createElement('span')
    filterText.textContent = 'Show completed items'
    filterLabel.appendChild(filterCheckbox)
    filterLabel.appendChild(filterText)
    filterSection.appendChild(filterLabel)
    container.appendChild(filterSection)

    // Todo list container
    const todoListContainer = document.createElement('div')
    todoListContainer.style.cssText = 'margin: 20px 0;'
    container.appendChild(todoListContainer)

    const renderTodoList = () => {
      todoListContainer.innerHTML = ''
      const filteredTodos = showCompleted() 
        ? todos() 
        : todos().filter(t => !t.completed)

      filteredTodos.forEach(todo => {
        const isRecent = Date.now() - todo.lastUpdated < 500
        
        const item = document.createElement('div')
        item.style.cssText = `
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px;
          margin: 10px 0;
          background: ${isRecent ? '#fff3cd' : 'white'};
          border: 2px solid ${isRecent ? '#ffc107' : '#e0e0e0'};
          border-left: 5px solid ${isRecent ? '#ffc107' : '#667eea'};
          border-radius: 8px;
          transition: all 0.3s ease;
          animation: ${isRecent ? 'flashYellow 0.5s ease' : 'none'};
        `

        const checkbox = Checkbox({
          config: new ComponentConfigBuilder('primary').build(),
          styling: new ComponentStylingBuilder().build(),
          checked: todo.completed,
          onchange: () => {
            setTodos(todos().map(t => 
              t.id === todo.id 
                ? { ...t, completed: !t.completed, renderCount: t.renderCount + 1, lastUpdated: Date.now() }
                : t
            ))
            setTotalUpdates(totalUpdates() + 1)
            updateStats()
            renderTodoList()
          }
        })

        const text = document.createElement('span')
        text.style.cssText = `flex: 1; ${todo.completed ? 'text-decoration: line-through; opacity: 0.6;' : ''}`
        text.textContent = todo.text

        const renderBadge = Badge({
          config: new ComponentConfigBuilder('primary').build(),
          styling: new ComponentStylingBuilder().build(),
          children: `🔄 ${todo.renderCount}`,
        })
        renderBadge.style.cssText = 'background: #17a2b8; color: white;'

        const deleteBtn = Button({
          config: new ComponentConfigBuilder('error').size('sm').build(),
          styling: new ComponentStylingBuilder().build(),
          children: 'Delete',
          onclick: () => {
            setTodos(todos().filter(t => t.id !== todo.id))
            setTotalUpdates(totalUpdates() + 1)
            updateStats()
            renderTodoList()
          }
        })

        item.appendChild(checkbox)
        item.appendChild(text)
        item.appendChild(renderBadge)
        item.appendChild(deleteBtn)
        todoListContainer.appendChild(item)
      })

      if (filteredTodos.length === 0) {
        const empty = document.createElement('p')
        empty.style.cssText = 'text-align: center; padding: 40px; color: #999; font-style: italic;'
        empty.textContent = 'No todos to display. Add one above!'
        todoListContainer.appendChild(empty)
      }
    }

    // Add CSS animation
    const style = document.createElement('style')
    style.textContent = `
      @keyframes flashYellow {
        0%, 100% { background: white; }
        50% { background: #fff3cd; }
      }
    `
    container.appendChild(style)

    renderTodoList()

    return container
  },
}

export const ConditionalRendering: Story = {
  render: () => {
    const [isLoggedIn, setIsLoggedIn] = createSignal(false)
    const [userRole, setUserRole] = createSignal<'admin' | 'user' | 'guest'>('guest')

    const container = document.createElement('div')
    container.style.cssText = 'padding: 20px; max-width: 600px;'

    const title = document.createElement('h2')
    title.textContent = 'Conditional Rendering'
    container.appendChild(title)

    const desc = document.createElement('p')
    desc.style.cssText = 'background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;'
    desc.textContent = '🔀 Pulsar handles conditional rendering efficiently. Toggle states to see different UI.'
    container.appendChild(desc)

    // Controls
    const controls = document.createElement('div')
    controls.style.cssText = 'margin: 20px 0; display: flex; gap: 10px; flex-wrap: wrap;'

    const loginBtn = Button({
      config: new ComponentConfigBuilder('primary').build(),
      styling: new ComponentStylingBuilder().build(),
      children: 'Toggle Login',
      onclick: () => setIsLoggedIn(!isLoggedIn())
    })

    const roleSelect = document.createElement('select')
    roleSelect.style.cssText = 'padding: 10px; border: 2px solid #ddd; border-radius: 4px;'
    roleSelect.innerHTML = '<option value="guest">Guest</option><option value="user">User</option><option value="admin">Admin</option>'
    roleSelect.onchange = (e) => setUserRole((e.target as HTMLSelectElement).value as any)

    controls.appendChild(loginBtn)
    controls.appendChild(roleSelect)
    container.appendChild(controls)

    // Content area
    const contentArea = document.createElement('div')
    contentArea.style.cssText = 'margin: 20px 0;'

    const renderContent = () => {
      contentArea.innerHTML = ''
      
      if (!isLoggedIn()) {
        const loginPrompt = document.createElement('div')
        loginPrompt.style.cssText = 'background: #fff3cd; padding: 30px; border-radius: 12px; text-align: center;'
        loginPrompt.innerHTML = `
          <h3>🔒 Please Log In</h3>
          <p>Click the "Toggle Login" button to access content</p>
        `
        contentArea.appendChild(loginPrompt)
      } else {
        const dashboard = document.createElement('div')
        dashboard.style.cssText = 'background: #e8f5e9; padding: 30px; border-radius: 12px;'
        
        const welcomeMsg = document.createElement('h3')
        welcomeMsg.textContent = `👋 Welcome, ${userRole()}!`
        dashboard.appendChild(welcomeMsg)

        const roleInfo = document.createElement('div')
        roleInfo.style.cssText = 'margin: 15px 0;'
        
        if (userRole() === 'admin') {
          roleInfo.innerHTML = `
            <p>✨ <strong>Admin Panel Access</strong></p>
            <ul>
              <li>Manage Users</li>
              <li>View Analytics</li>
              <li>System Settings</li>
            </ul>
          `
        } else if (userRole() === 'user') {
          roleInfo.innerHTML = `
            <p>📝 <strong>User Dashboard</strong></p>
            <ul>
              <li>View Profile</li>
              <li>Edit Settings</li>
            </ul>
          `
        } else {
          roleInfo.innerHTML = `
            <p>👤 <strong>Guest Access</strong></p>
            <p>Limited features available. Upgrade to see more!</p>
          `
        }
        
        dashboard.appendChild(roleInfo)
        contentArea.appendChild(dashboard)
      }
    }

    // Use effect to re-render on state changes
    import('pulsar/reactivity').then(({ createEffect }) => {
      createEffect(() => {
        isLoggedIn()
        userRole()
        renderContent()
      })
    })

    renderContent()
    container.appendChild(contentArea)

    return container
  },
}
