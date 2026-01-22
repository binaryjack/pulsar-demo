/**
 * TodoApp component (extracted from todo-app.tsx for cleaner separation)
 */

import { useEffect, useMemo, useState } from "pulsar"
import { useAppContext } from './AppContext'

interface ITodo {
    id: number
    text: string
    completed: boolean
}

interface ITodoAppProps {
    initialTodos?: ITodo[]
}

export const TodoApp = ({ initialTodos = [] as ITodo[] }: ITodoAppProps) => {
    // Access context
    const appContext = useAppContext()
    
    // State
    const [todos, setTodos] = useState<ITodo[]>(initialTodos)
    const [input, setInput] = useState('')
    const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
    
    // Computed values
    const filteredTodos = useMemo(() => {
        const allTodos = todos()
        if (filter() === 'active') return allTodos.filter((t: ITodo) => !t.completed)
        if (filter() === 'completed') return allTodos.filter((t: ITodo) => t.completed)
        return allTodos
    }, [todos, filter])
    
    const activeCount = useMemo(() => {
        return todos().filter((t: ITodo) => !t.completed).length
    }, [todos])
    
    // Actions
    const addTodo = () => {
        const text = input().trim()
        if (text) {
            setTodos([...todos(), {
                id: Date.now(),
                text,
                completed: false
            }])
            setInput('')
        }
    }
    
    const toggleTodo = (id: number) => {
        setTodos(todos().map((todo: ITodo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ))
    }
    
    const deleteTodo = (id: number) => {
        setTodos(todos().filter((todo: ITodo) => todo.id !== id))
    }
    
    const clearCompleted = () => {
        setTodos(todos().filter((todo: ITodo) => !todo.completed))
    }
    
    // Side effects
    useEffect(() => {
        console.log(`Active todos: ${activeCount()}`)
    }, [activeCount])
    
    useEffect(() => {
        // Save to localStorage
        localStorage.setItem('todos', JSON.stringify(todos()))
        
        return () => {
            console.log('Saving todos before unmount')
        }
    }, [todos])
    
    return (
        <div className="todo-app">
            <header>
                <h1>{appContext.appName}</h1>
                <p className="version">v{appContext.version}</p>
                <div className="input-container">
                    <input
                        type="text"
                        value={input()}
                        onInput={(e) => setInput(e.currentTarget?.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') addTodo()
                        }}
                        placeholder="What needs to be done?"
                    />
                    <button onClick={addTodo}>Add</button>
                </div>
            </header>
            
            <div className="filters">
                <button
                    className={filter() === 'all' ? 'active' : ''}
                    onClick={() => setFilter('all')}
                >
                    All
                </button>
                <button
                    className={filter() === 'active' ? 'active' : ''}
                    onClick={() => setFilter('active')}
                >
                    Active ({activeCount()})
                </button>
                <button
                    className={filter() === 'completed' ? 'active' : ''}
                    onClick={() => setFilter('completed')}
                >
                    Completed
                </button>
            </div>
            
            <ul className="todo-list">
                {filteredTodos().map((todo: ITodo) => (
                    <li key={todo.id} className={todo.completed ? 'completed' : ''}>
                        <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => toggleTodo(todo.id)}
                            aria-label={`Mark ${todo.text} as ${todo.completed ? 'incomplete' : 'complete'}`}
                        />
                        <span>{todo.text}</span>
                        <button onClick={() => deleteTodo(todo.id)}>×</button>
                    </li>
                ))}
            </ul>
            
            <footer>
                <span>{activeCount()} items left</span>
                <button onClick={clearCompleted}>
                    Clear completed
                </button>
            </footer>
        </div>
    )
}
