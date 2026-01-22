/**
 * Reactivity Demo - Signals, Effects, Memos
 */

import { useState } from "pulsar"
import { createEffect, createMemo } from "pulsar"

export const ReactivityDemo = () => {
    const [count, setCount] = useState(0)
    const [multiplier, setMultiplier] = useState(2)
    
    // Computed value using memo
    const doubled = createMemo(() => count() * 2)
    const quadrupled = createMemo(() => doubled() * 2)
    const multiplied = createMemo(() => count() * multiplier())

    // Effect to log changes
    createEffect(() => {
        console.log(`Count changed to: ${count()}`)
    })

    return (
        <div>
            <h2>⚡ Reactivity System</h2>
            <p className="description">
                pulsar's fine-grained reactivity system with signals, effects, and memos.
                Changes propagate automatically through the dependency graph.
            </p>

            <div className="demo-card">
                <h3>Signals & State</h3>
                <p>Signals are reactive primitives that notify subscribers when they change.</p>
                
                <div className="counter-display" style={`font-size: ${Math.min(80 + count() * 5, 200)}px; transition: all 0.3s ease; color: ${count() > 0 ? '#28a745' : count() < 0 ? '#dc3545' : '#667eea'};`}>
                    {count()}
                </div>

                <button onClick={() => setCount(count() + 1)}>
                    ➕ Increment
                </button>
                <button onClick={() => setCount(count() - 1)}>
                    ➖ Decrement
                </button>
                <button onClick={() => setCount(count() + 10)}>
                    ⚡ +10
                </button>
                <button className="secondary" onClick={() => setCount(0)}>
                    🔄 Reset
                </button>
            </div>

            <div className="demo-card">
                <h3>Computed Values (Memos)</h3>
                <p>Memos automatically recompute when their dependencies change.</p>
                
                <div className="grid">
                    <div className="card">
                        <h4>Doubled</h4>
                        <div style="font-size: 2rem; font-weight: bold; color: #667eea;">
                            {doubled()}
                        </div>
                        <small>count × 2</small>
                    </div>
                    
                    <div className="card">
                        <h4>Quadrupled</h4>
                        <div style="font-size: 2rem; font-weight: bold; color: #764ba2;">
                            {quadrupled()}
                        </div>
                        <small>count × 2 × 2</small>
                    </div>
                </div>
            </div>

            <div className="demo-card">
                <h3>Dynamic Multiplier</h3>
                <p>Multiple reactive dependencies working together.</p>
                
                <div>
                    <label>
                        Multiplier: 
                        <input
                            type="number"
                            value={multiplier()}
                            onInput={(e) => setMultiplier(Number(e.currentTarget.value))}
                        />
                    </label>
                </div>

                <div style="margin-top: 15px;">
                    <strong>{count()}</strong> × <strong>{multiplier()}</strong> = 
                    <span style="font-size: 1.5rem; color: #667eea; font-weight: bold; margin-left: 10px;">
                        {multiplied()}
                    </span>
                </div>
            </div>

            <div className="demo-card">
                <h3>Code Example</h3>
                <pre>{`// Create reactive signals
const [count, setCount] = useState(0)
const [multiplier, setMultiplier] = useState(2)

// Computed values
const doubled = createMemo(() => count() * 2)
const multiplied = createMemo(() => count() * multiplier())

// Effects run when dependencies change
createEffect(() => {
    console.log(\`Count: \${count()}\`)
})`}</pre>
            </div>
        </div>
    )
}
