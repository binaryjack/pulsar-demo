/**
 * State Management Demo
 * Demonstrates Redux-style store with undo/redo and persistence
 */

import {
    createStore,
    IStoreAction,
    undoable,
    UndoRedoActions
} from "pulsar";

// Define state shape
interface TodoState {
    todos: Array<{ id: number; text: string; completed: boolean }>
    filter: 'all' | 'active' | 'completed'
}

// Define action types
type TodoAction =
    | { type: 'ADD_TODO'; payload: string }
    | { type: 'TOGGLE_TODO'; payload: number }
    | { type: 'DELETE_TODO'; payload: number }
    | { type: 'SET_FILTER'; payload: TodoState['filter'] }
    | { type: 'UNDO' }
    | { type: 'REDO' }
    | { type: 'JUMP'; payload: number }

// Create reducer
const todoReducer = (state: TodoState, action: TodoAction): TodoState => {
    switch (action.type) {
        case 'ADD_TODO':
            return {
                ...state,
                todos: [
                    ...state.todos,
                    { id: Date.now(), text: action.payload, completed: false }
                ]
            }
        case 'TOGGLE_TODO':
            return {
                ...state,
                todos: state.todos.map(todo =>
                    todo.id === action.payload
                        ? { ...todo, completed: !todo.completed }
                        : todo
                )
            }
        case 'DELETE_TODO':
            return {
                ...state,
                todos: state.todos.filter(todo => todo.id !== action.payload)
            }
        case 'SET_FILTER':
            return { ...state, filter: action.payload }
        default:
            return state
    }
}

// Create store with undo/redo using undoable wrapper
const store = createStore(
    {
        past: [],
        present: { todos: [], filter: 'all' as const },
        future: []
    },
    undoable(todoReducer, {
        maxHistory: 50,
        filter: (action: IStoreAction) => action.type !== 'SET_FILTER'
    })
)

// Memoized selectors
const visibleTodos = store.select(state => {
    const { todos, filter } = state.present
    switch (filter) {
        case 'active':
            return todos.filter(t => !t.completed)
        case 'completed':
            return todos.filter(t => t.completed)
        default:
            return todos
    }
})

const stats = store.select(state => ({
    total: state.present.todos.length,
    completed: state.present.todos.filter(t => t.completed).length,
    active: state.present.todos.filter(t => !t.completed).length
}))

// Export for demo
export function StateManagementDemo() {
    let inputRef: HTMLInputElement | undefined

    const handleAddTodo = () => {
        if (inputRef && inputRef.value.trim()) {
            store.dispatch({ type: 'ADD_TODO', payload: inputRef.value.trim() })
            inputRef.value = ''
        }
    }

    const handleKeyPress = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleAddTodo()
        }
    }

    return (
        <div class="state-management-demo">
            <div class="demo-header">
                <h2>🗃️ State Management</h2>
                <p>Redux-style store with undo/redo and memoized selectors</p>
            </div>

            <div class="demo-content">
                {/* Add Todo */}
                <div class="add-todo">
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="What needs to be done?"
                        onKeyPress={handleKeyPress}
                    />
                    <button onClick={handleAddTodo}>Add</button>
                </div>

                {/* Filter Buttons */}
                <div class="filters">
                    <button
                        class={store.getState().present.filter === 'all' ? 'active' : ''}
                        onClick={() => store.dispatch({ type: 'SET_FILTER', payload: 'all' })}
                    >
                        All ({stats().total})
                    </button>
                    <button
                        class={store.getState().present.filter === 'active' ? 'active' : ''}
                        onClick={() => store.dispatch({ type: 'SET_FILTER', payload: 'active' })}
                    >
                        Active ({stats().active})
                    </button>
                    <button
                        class={store.getState().present.filter === 'completed' ? 'active' : ''}
                        onClick={() => store.dispatch({ type: 'SET_FILTER', payload: 'completed' })}
                    >
                        Completed ({stats().completed})
                    </button>
                </div>

                {/* Todo List */}
                <ul class="todo-list">
                    {visibleTodos().map(todo => (
                        <li key={todo.id} class={todo.completed ? 'completed' : ''}>
                            <input
                                type="checkbox"
                                checked={todo.completed}
                                onChange={() => store.dispatch({ type: 'TOGGLE_TODO', payload: todo.id })}
                            />
                            <span>{todo.text}</span>
                            <button
                                class="delete"
                                onClick={() => store.dispatch({ type: 'DELETE_TODO', payload: todo.id })}
                            >
                                ×
                            </button>
                        </li>
                    ))}
                </ul>

                {/* Undo/Redo Controls */}
                <div class="history-controls">
                    <h3>⏱️ Time Travel Debugging</h3>
                    <div class="buttons">
                        <button
                            disabled={!store.getState().present.past?.length}
                            onClick={() => store.dispatch(UndoRedoActions.undo())}
                        >
                            ⬅️ Undo
                        </button>
                        <button
                            disabled={!store.getState().present.future?.length}
                            onClick={() => store.dispatch(UndoRedoActions.redo())}
                        >
                            Redo ➡️
                        </button>
                    </div>
                    <div class="history-info">
                        <p>
                            History: {store.getState().present.past?.length || 0} past actions,{' '}
                            {store.getState().present.future?.length || 0} future actions
                        </p>
                    </div>
                </div>

                {/* State Inspector */}
                <div class="state-inspector">
                    <h3>🔍 Current State</h3>
                    <pre>{JSON.stringify(store.getState().present, null, 2)}</pre>
                </div>
            </div>

            <style>{`
                .state-management-demo {
                    padding: 2rem;
                    max-width: 800px;
                    margin: 0 auto;
                }

                .demo-header {
                    text-align: center;
                    margin-bottom: 2rem;
                }

                .demo-header h2 {
                    margin: 0 0 0.5rem 0;
                    font-size: 2rem;
                }

                .demo-header p {
                    margin: 0;
                    color: #666;
                }

                .add-todo {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                }

                .add-todo input {
                    flex: 1;
                    padding: 0.75rem;
                    font-size: 1rem;
                    border: 2px solid #ddd;
                    border-radius: 4px;
                }

                .add-todo button {
                    padding: 0.75rem 2rem;
                    background: #0066cc;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 1rem;
                }

                .add-todo button:hover {
                    background: #0052a3;
                }

                .filters {
                    display: flex;
                    gap: 0.5rem;
                    margin-bottom: 1.5rem;
                }

                .filters button {
                    padding: 0.5rem 1rem;
                    background: #f0f0f0;
                    border: 2px solid #ddd;
                    border-radius: 4px;
                    cursor: pointer;
                }

                .filters button.active {
                    background: #0066cc;
                    color: white;
                    border-color: #0066cc;
                }

                .todo-list {
                    list-style: none;
                    padding: 0;
                    margin: 0 0 2rem 0;
                }

                .todo-list li {
                    display: flex;
                    align-items: center;
                    padding: 1rem;
                    background: #f9f9f9;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    margin-bottom: 0.5rem;
                }

                .todo-list li.completed span {
                    text-decoration: line-through;
                    color: #999;
                }

                .todo-list li input[type="checkbox"] {
                    margin-right: 1rem;
                    cursor: pointer;
                }

                .todo-list li span {
                    flex: 1;
                }

                .todo-list li button.delete {
                    background: #ff4444;
                    color: white;
                    border: none;
                    border-radius: 50%;
                    width: 24px;
                    height: 24px;
                    cursor: pointer;
                    font-size: 1.2rem;
                    line-height: 1;
                }

                .history-controls {
                    background: #f0f8ff;
                    padding: 1.5rem;
                    border-radius: 8px;
                    margin-bottom: 2rem;
                }

                .history-controls h3 {
                    margin: 0 0 1rem 0;
                }

                .history-controls .buttons {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 1rem;
                }

                .history-controls button {
                    padding: 0.5rem 1rem;
                    background: #0066cc;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }

                .history-controls button:disabled {
                    background: #ccc;
                    cursor: not-allowed;
                }

                .history-info {
                    font-size: 0.9rem;
                    color: #666;
                }

                .state-inspector {
                    background: #1e1e1e;
                    color: #d4d4d4;
                    padding: 1.5rem;
                    border-radius: 8px;
                }

                .state-inspector h3 {
                    margin: 0 0 1rem 0;
                    color: white;
                }

                .state-inspector pre {
                    margin: 0;
                    overflow-x: auto;
                    font-size: 0.9rem;
                }
            `}</style>
        </div>
    )
}
