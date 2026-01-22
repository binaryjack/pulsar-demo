/**
 * Control Flow Demo - Array.map() with keyed reconciliation
 * The transformer automatically adds keying to array.map() calls
 */

import { useState } from "pulsar"

interface ITodo {
    id: number
    text: string
    completed: boolean
    renderCount: number
    lastUpdated: number
}

export const ControlFlowDemo = () => {
    const [todos, setTodos] = useState<ITodo[]>([
        { id: 1, text: 'Learn Uranium', completed: true, renderCount: 0, lastUpdated: Date.now() },
        { id: 2, text: 'Build amazing apps', completed: false, renderCount: 0, lastUpdated: Date.now() },
        { id: 3, text: 'Deploy to production', completed: false, renderCount: 0, lastUpdated: Date.now() },
    ])
    const [input, setInput] = useState('')
    const [showCompleted, setShowCompleted] = useState(true)
    const [totalDomUpdates, setTotalDomUpdates] = useState(0)

    const addTodo = () => {
        if (input().trim()) {
            setTodos([...todos(), {
                id: Date.now(),
                text: input(),
                completed: false,
                renderCount: 0,
                lastUpdated: Date.now()
            }])
            setInput('')
            setTotalDomUpdates(totalDomUpdates() + 1)
        }
    }

    const toggleTodo = (id: number) => {
        console.log(`Toggle todo ${id} - Watch for the FLASH animation on ONLY that item!`)
        setTodos(todos().map(todo =>
            todo.id === id 
                ? { ...todo, completed: !todo.completed, renderCount: todo.renderCount + 1, lastUpdated: Date.now() } 
                : todo
        ))
        setTotalDomUpdates(totalDomUpdates() + 1)
    }

    const deleteTodo = (id: number) => {
        setTodos(todos().filter(todo => todo.id !== id))
        setTotalDomUpdates(totalDomUpdates() + 1)
    }

    const clearAll = () => {
        setTodos([])
        setTotalDomUpdates(totalDomUpdates() + 1)
    }

    return (
        <div>
            <h2>Fine-Grained Reactivity with Keyed Lists</h2>
            <p className="description">
                Toggle ANY checkbox and watch ONLY that item flash yellow!
            </p>

            {/* Monitor Card */}
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 8px 16px rgba(0,0,0,0.2);">
                <div style="font-size: 4rem; text-align: center; font-weight: bold; text-shadow: 3px 3px 6px rgba(0,0,0,0.3);">
                    {totalDomUpdates()}
                </div>
                <p style="text-align: center; margin: 0; font-size: 1.2rem;">
                    Total DOM Updates (Should be +1, not +N)
                </p>
            </div>

            {/* Demo Card */}
            <div className="demo-card">
                <h3>Array.map() with Keyed Reconciliation</h3>
                <p style="background: #fff3cd; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                    ⚡ The transformer detects array.map() and adds automatic keying!
                </p>

                {/* Input Controls */}
                <div style="margin-bottom: 15px;">
                    <input
                        type="text"
                        value={input()}
                        placeholder="Add a new todo..."
                        onInput={(e: Event) => setInput((e.currentTarget as HTMLInputElement).value)}
                        onKeyPress={(e: KeyboardEvent) => { if (e.key === 'Enter') addTodo() }}
                        style="margin-right: 10px;"
                    />
                    <button onClick={addTodo}>Add Todo</button>
                    <button onClick={clearAll} className="secondary" style="margin-left: 10px;">Clear All</button>
                </div>

                {/* Show Completed Checkbox */}
                <div style="margin-bottom: 15px;">
                    <label>
                        <input
                            type="checkbox"
                            checked={showCompleted()}
                            onChange={(e: Event) => setShowCompleted((e.currentTarget as HTMLInputElement).checked)}
                        />
                        <span style="margin-left: 8px;">Show completed items</span>
                    </label>
                </div>

                {/* Stats */}
                <div style="margin-bottom: 15px;">
                    <span className="badge" style="background: #667eea;">
                        {todos().length} total
                    </span>
                    <span className="badge" style="background: #28a745; margin-left: 8px;">
                        {todos().filter(t => t.completed).length} completed
                    </span>
                    <span className="badge" style="background: #ffc107; margin-left: 8px;">
                        {todos().filter(t => !t.completed).length} active
                    </span>
                </div>

                {/* Todo List - Uses array.map() with automatic keying from transformer */}
                {(showCompleted() ? todos() : todos().filter(t => !t.completed)).map(todo => {
                    const isRecent = Date.now() - todo.lastUpdated < 500
                    return (
                        <div
                            className="list-item"
                            style={`
                                animation: ${isRecent ? 'flashYellow 0.5s ease' : 'none'};
                                border-left: 5px solid ${isRecent ? '#ffc107' : '#667eea'};
                                background: ${isRecent ? '#fff3cd' : 'white'};
                            `}
                        >
                            <input
                                type="checkbox"
                                checked={todo.completed}
                                onChange={() => toggleTodo(todo.id)}
                            />
                            <span style={`flex: 1; ${todo.completed ? 'text-decoration: line-through; opacity: 0.6;' : ''}`}>
                                {todo.text}
                            </span>
                            <span className="badge" style="background: #17a2b8;">
                                🔄 {todo.renderCount}
                            </span>
                            <button onClick={() => deleteTodo(todo.id)} className="secondary">
                                Delete
                            </button>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
