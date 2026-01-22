/**
 * Counter Component
 * Demonstrates hooks API and context usage
 */

import { useEffect, useMemo, useState } from "pulsar"
import { useAppContext } from "./AppContext"

interface ICounterProps {
    initialCount?: number
}

export const Counter = ({ initialCount = 0 }: ICounterProps) => {
    // Access context
    const appContext = useAppContext()
    
    // React-like hooks API
    const [count, setCount] = useState(initialCount)
    const [multiplier, setMultiplier] = useState(2)
    
    // Computed value
    const doubled = useMemo(() => count() * multiplier(), [count, multiplier])
    
    // Side effect
    useEffect(() => {
        console.log(`[Counter] Count updated: ${count()}`)
    }, [count])

    const increment = () => {
        setCount(prev => prev + 1)
    }

    const decrement = () => {
        setCount(prev => Math.max(0, prev - 1))
    }

    const reset = () => {
        setCount(initialCount)
    }

    const updateMultiplier = (event: Event) => {
        const target = event.target as HTMLInputElement
        setMultiplier(parseInt(target.value) || 1)
    }

    return (
        <div className="counter">
            <header>
                <h2>{appContext.appName} - Counter Example</h2>
                <p>Version: {appContext.version}</p>
            </header>
            
            <main>
                <div className="counter-display">
                    <div className="count-value">Count: {count()}</div>
                    <div className="doubled-value">Doubled: {doubled()}</div>
                </div>
                
                <div className="controls">
                    <button onClick={decrement}>-</button>
                    <button onClick={increment}>+</button>
                    <button onClick={reset}>Reset</button>
                </div>
                
                <div className="multiplier-control">
                    <label htmlFor="multiplier">Multiplier:</label>
                    <input 
                        id="multiplier"
                        type="number" 
                        value={multiplier()} 
                        onInput={updateMultiplier}
                        min="1"
                        max="10"
                    />
                </div>
            </main>
        </div>
    )
}
