import { Badge, Button, Card, ComponentConfigBuilder, ComponentStylingBuilder, Input, Typography } from '@atomos/prime'
import type { Meta, StoryObj } from '@storybook/html'
import { createStore, IStoreAction, undoable, UndoRedoActions } from 'pulsar/state'

const meta: Meta = {
  title: 'Pulsar Features/State Management',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## Redux-Style State Management

Pulsar provides a complete Redux-style state management system built on signals:
- **createStore**: Redux-like store with reducers
- **Middleware**: Undo/redo, persistence, logging
- **Time-travel debugging**: Full undo/redo history
- **Redux DevTools**: Full integration support
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj

// Todo store with undo/redo
interface TodoState {
  todos: Array<{ id: number; text: string; completed: boolean }>
  filter: 'all' | 'active' | 'completed'
}

const ADD_TODO = 'ADD_TODO'
const TOGGLE_TODO = 'TOGGLE_TODO'
const DELETE_TODO = 'DELETE_TODO'
const SET_FILTER = 'SET_FILTER'

export const TodoAppWithTimeTravel: Story = {
  render: () => {
    // Create store with undo/redo middleware - middleware wraps state automatically
    const todoReducer = (state: TodoState, action: any): TodoState => {
      switch (action.type) {
        case ADD_TODO:
          return {
            ...state,
            todos: [...state.todos, { id: Date.now(), text: action.payload, completed: false }]
          }
        case TOGGLE_TODO:
          return {
            ...state,
            todos: state.todos.map(todo =>
              todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo
            )
          }
        case DELETE_TODO:
          return {
            ...state,
            todos: state.todos.filter(todo => todo.id !== action.payload)
          }
        case SET_FILTER:
          return { ...state, filter: action.payload }
        default:
          return state
      }
    }

    const store = createStore(
      {
        past: [],
        present: { todos: [], filter: 'all' as const },
        future: []
      },
      undoable(todoReducer, {
        maxHistory: 50,
        filter: (action: IStoreAction) => action.type !== SET_FILTER
      })
    )

    const container = document.createElement('div')
    container.style.cssText = 'padding: 20px; max-width: 800px;'

    // Title
    const title = Typography({
      config: new ComponentConfigBuilder('h2').build(),
      children: 'Todo App with Time Travel'
    })
    container.appendChild(title)

    // Description
    const desc = document.createElement('p')
    desc.style.cssText = 'background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;'
    desc.innerHTML = '⏱️ <strong>Time Travel Debugging:</strong> Add, complete, or delete todos, then use Undo/Redo to travel through state history!'
    container.appendChild(desc)

    // Stats card
    const statsCard = Card({
      config: new ComponentConfigBuilder('default').build(),
      styling: new ComponentStylingBuilder().build(),
      children: ''
    })
    statsCard.style.cssText = 'margin: 20px 0; padding: 20px;'
    
    const statsContent = document.createElement('div')
    statsContent.style.cssText = 'display: flex; gap: 15px; flex-wrap: wrap;'
    
    store.subscribe(() => {
      const state = store.getState().present
      const total = state.todos.length
      const completed = state.todos.filter(t => t.completed).length
      const active = total - completed
      
      statsContent.innerHTML = `
        <div style="flex: 1; min-width: 100px;">
          ${Badge({ 
            config: new ComponentConfigBuilder('primary').build(),
            children: `Total: ${total}` 
          }).outerHTML}
        </div>
        <div style="flex: 1; min-width: 100px;">
          ${Badge({ 
            config: new ComponentConfigBuilder('success').build(),
            children: `Done: ${completed}` 
          }).outerHTML}
        </div>
        <div style="flex: 1; min-width: 100px;">
          ${Badge({ 
            config: new ComponentConfigBuilder('warning').build(),
            children: `Active: ${active}` 
          }).outerHTML}
        </div>
      `
    })
    
    statsCard.appendChild(statsContent)
    container.appendChild(statsCard)

    // Undo/Redo controls
    const historyControls = document.createElement('div')
    historyControls.style.cssText = 'display: flex; gap: 10px; margin: 20px 0; align-items: center;'
    
    const undoBtn = Button({
      config: new ComponentConfigBuilder('secondary').build(),
      styling: new ComponentStylingBuilder().build(),
      children: '↶ Undo',
      onclick: () => {
        const state = store.getState()
        if (state.past && state.past.length > 0) {
          store.dispatch(UndoRedoActions.undo())
        }
      }
    }) as HTMLButtonElement
    
    const redoBtn = Button({
      config: new ComponentConfigBuilder('secondary').build(),
      styling: new ComponentStylingBuilder().build(),
      children: '↷ Redo',
      onclick: () => {
        const state = store.getState()
        if (state.future && state.future.length > 0) {
          store.dispatch(UndoRedoActions.redo())
        }
      }
    }) as HTMLButtonElement
    
    const historyLabel = document.createElement('span')
    historyLabel.style.cssText = 'font-size: 14px; color: #666;'
    
    store.subscribe(() => {
      const state = store.getState()
      undoBtn.disabled = !state.past || state.past.length === 0
      redoBtn.disabled = !state.future || state.future.length === 0
      historyLabel.textContent = `⏱️ Time Travel Enabled`
    })
    
    historyControls.appendChild(undoBtn)
    historyControls.appendChild(redoBtn)
    historyControls.appendChild(historyLabel)
    container.appendChild(historyControls)

    // Add todo form
    const formContainer = document.createElement('div')
    formContainer.style.cssText = 'display: flex; gap: 10px; margin: 20px 0;'
    
    const todoInput = Input({
      config: new ComponentConfigBuilder('default').build(),
      styling: new ComponentStylingBuilder().build(),
      placeholder: 'What needs to be done?',
      value: ''
    }) as HTMLInputElement
    todoInput.style.flex = '1'
    
    const addBtn = Button({
      config: new ComponentConfigBuilder('primary').build(),
      styling: new ComponentStylingBuilder().build(),
      children: '+ Add Todo',
      onclick: () => {
        const text = todoInput.value.trim()
        if (text) {
          store.dispatch({ type: ADD_TODO, payload: text })
          todoInput.value = ''
        }
      }
    })
    
    todoInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') addBtn.click()
    })
    
    formContainer.appendChild(todoInput)
    formContainer.appendChild(addBtn)
    container.appendChild(formContainer)

    // Filter buttons
    const filterContainer = document.createElement('div')
    filterContainer.style.cssText = 'display: flex; gap: 10px; margin: 20px 0;'
    
    const filters: Array<{ label: string; value: 'all' | 'active' | 'completed' }> = [
      { label: 'All', value: 'all' },
      { label: 'Active', value: 'active' },
      { label: 'Completed', value: 'completed' }
    ]
    
    filters.forEach(({ label, value }) => {
      const btn = Button({
        config: new ComponentConfigBuilder(
          store.getState().present.filter === value ? 'primary' : 'secondary'
        ).build(),
        styling: new ComponentStylingBuilder().build(),
        children: label,
        onclick: () => store.dispatch({ type: SET_FILTER, payload: value })
      })
      
      store.subscribe(() => {
        const isActive = store.getState().present.filter === value
        btn.className = btn.className.replace(/bg-\w+-\d+/g, '')
        btn.classList.add(isActive ? 'bg-primary-600' : 'bg-secondary-600')
      })
      
      filterContainer.appendChild(btn)
    })
    
    container.appendChild(filterContainer)

    // Todo list
    const todoList = document.createElement('div')
    todoList.style.cssText = 'margin: 20px 0;'
    
    const updateTodoList = () => {
      const state = store.getState().present
      const filtered = state.todos.filter(todo => {
        if (state.filter === 'active') return !todo.completed
        if (state.filter === 'completed') return todo.completed
        return true
      })
      
      todoList.innerHTML = ''
      
      if (filtered.length === 0) {
        const empty = document.createElement('div')
        empty.style.cssText = 'text-align: center; padding: 40px; color: #999;'
        empty.textContent = state.filter === 'all' ? 'No todos yet!' : `No ${state.filter} todos`
        todoList.appendChild(empty)
        return
      }
      
      filtered.forEach(todo => {
        const todoCard = Card({
          config: new ComponentConfigBuilder('default').build(),
          styling: new ComponentStylingBuilder().build(),
          children: ''
        })
        todoCard.style.cssText = `
          margin: 10px 0; 
          padding: 15px; 
          display: flex; 
          align-items: center; 
          gap: 15px;
          ${todo.completed ? 'opacity: 0.6;' : ''}
        `
        
        const checkbox = document.createElement('input')
        checkbox.type = 'checkbox'
        checkbox.checked = todo.completed
        checkbox.style.cssText = 'width: 20px; height: 20px; cursor: pointer;'
        checkbox.onchange = () => store.dispatch({ type: TOGGLE_TODO, payload: todo.id })
        
        const text = document.createElement('span')
        text.style.cssText = `
          flex: 1; 
          font-size: 16px;
          ${todo.completed ? 'text-decoration: line-through;' : ''}
        `
        text.textContent = todo.text
        
        const deleteBtn = Button({
          config: new ComponentConfigBuilder('error').build(),
          styling: new ComponentStylingBuilder().build(),
          children: '✕',
          onclick: () => store.dispatch({ type: DELETE_TODO, payload: todo.id })
        })
        deleteBtn.style.cssText = 'padding: 5px 15px; min-width: auto;'
        
        todoCard.appendChild(checkbox)
        todoCard.appendChild(text)
        todoCard.appendChild(deleteBtn)
        todoList.appendChild(todoCard)
      })
    }
    
    store.subscribe(updateTodoList)
    updateTodoList()
    
    container.appendChild(todoList)

    return container
  },
}

export const CounterWithPersistence: Story = {
  render: () => {
    // Simple counter with localStorage persistence
    const store = createStore<{ count: number }>(
      { count: Number(localStorage.getItem('counter') || 0) },
      (state, action) => {
        if (action.type === 'INCREMENT') return { count: state.count + 1 }
        if (action.type === 'DECREMENT') return { count: state.count - 1 }
        if (action.type === 'RESET') return { count: 0 }
        return state
      }
    )

    // Save to localStorage on every change
    store.subscribe(() => {
      localStorage.setItem('counter', store.getState().count.toString())
    })

    const container = document.createElement('div')
    container.style.cssText = 'padding: 20px; max-width: 600px;'

    const title = Typography({
      config: new ComponentConfigBuilder('h2').build(),
      children: 'Persistent Counter'
    })
    container.appendChild(title)

    const desc = document.createElement('p')
    desc.style.cssText = 'background: #fff3cd; padding: 15px; border-radius: 8px; margin: 15px 0;'
    desc.textContent = '💾 This counter persists to localStorage. Refresh the page and your count will be restored!'
    container.appendChild(desc)

    const countCard = Card({
      config: new ComponentConfigBuilder('default').build(),
      styling: new ComponentStylingBuilder().build(),
      children: ''
    })
    countCard.style.cssText = 'text-align: center; padding: 40px; margin: 20px 0;'

    const countDisplay = document.createElement('div')
    countDisplay.style.cssText = 'font-size: 4rem; font-weight: bold; color: #667eea;'
    
    store.subscribe(() => {
      countDisplay.textContent = store.getState().count.toString()
    })
    countDisplay.textContent = store.getState().count.toString()

    countCard.appendChild(countDisplay)
    container.appendChild(countCard)

    const btnContainer = document.createElement('div')
    btnContainer.style.cssText = 'display: flex; gap: 10px; justify-content: center;'

    const incrementBtn = Button({
      config: new ComponentConfigBuilder('primary').build(),
      styling: new ComponentStylingBuilder().build(),
      children: '+ Increment',
      onclick: () => store.dispatch({ type: 'INCREMENT' })
    })

    const decrementBtn = Button({
      config: new ComponentConfigBuilder('secondary').build(),
      styling: new ComponentStylingBuilder().build(),
      children: '− Decrement',
      onclick: () => store.dispatch({ type: 'DECREMENT' })
    })

    const resetBtn = Button({
      config: new ComponentConfigBuilder('error').build(),
      styling: new ComponentStylingBuilder().build(),
      children: '↺ Reset',
      onclick: () => store.dispatch({ type: 'RESET' })
    })

    btnContainer.appendChild(incrementBtn)
    btnContainer.appendChild(decrementBtn)
    btnContainer.appendChild(resetBtn)
    container.appendChild(btnContainer)

    return container
  },
}
