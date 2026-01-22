/**
 * Hooks Demo - useState, useEffect, useMemo, useRef
 */

import { useEffect, useMemo, useRef, useState } from "pulsar"

export const HooksDemo = () => {
    const [name, setName] = useState('pulsar')
    const [age, setAge] = useState(0)
    const [clicks, setClicks] = useState(0)
    const inputRef = useRef<HTMLInputElement | null>(null)

    // useMemo - computed value
    const greeting = useMemo(() => {
        return `Hello, ${name()}! You are ${age()} years old.`
    }, [name, age])

    // Function handler
    const handleIncrement = () => {
        setClicks(clicks() + 1)
    }

    // useEffect - side effects
    useEffect(() => {
        console.log(`Name changed to: ${name()}`)
        document.title = `pulsar - ${name()}`
        
        return () => {
            console.log('Cleanup effect')
        }
    }, [name])

    useEffect(() => {
        console.log(`Total clicks: ${clicks()}`)
    }, [clicks])

    const focusInput = () => {
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }

    return (
        <div>
            <h2>🪝 Hooks System</h2>
            <p className="description">
                React-like hooks for state management, side effects, memoization, and refs.
            </p>

            <div className="demo-card">
                <h3>useState - Reactive State</h3>
                <p>Create reactive state with getter/setter tuple.</p>
                
                <div>
                    <label>
                        Name:
                        <input
                            type="text"
                            value={name()}
                            onInput={(e) => setName(e.currentTarget.value)}
                            ref={inputRef}
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Age:
                        <input
                            type="number"
                            value={age()}
                            onInput={(e) => setAge(Number(e.currentTarget.value))}
                        />
                    </label>
                    <div style="margin-top: 10px;">
                        <button onClick={() => setAge(age() + 1)}>🎂 +1 Year</button>
                        <button onClick={() => setAge(age() + 10)}>⚡ +10 Years</button>
                        <button onClick={() => setAge(18)}>🎓 Adult (18)</button>
                        <button onClick={() => setAge(0)}>👶 Reset</button>
                    </div>
                </div>

                <div className="success-display" style="margin-top: 15px;">
                    {greeting()}
                </div>
            </div>

            <div className="demo-card">
                <h3>useEffect - Side Effects</h3>
                <p>Run side effects when dependencies change. Open console to see logs.</p>
                
                <div>
                    <div style={`font-size: 4rem; text-align: center; margin: 20px 0; transform: scale(${1 + clicks() * 0.02}); transition: transform 0.3s ease; color: ${clicks() > 20 ? '#dc3545' : clicks() > 10 ? '#ffc107' : '#667eea'};`}>
                        👆 {clicks()}
                    </div>
                    <p style="text-align: center; font-size: 1.2rem;">
                        {clicks() === 0 ? 'Click the button!' : clicks() < 10 ? 'Keep clicking!' : clicks() < 20 ? '🔥 You\'re on fire!' : '🚀 AMAZING!'}
                    </p>
                    <button onClick={handleIncrement} style="width: 100%; padding: 20px; font-size: 1.2rem;">
                        🎯 Click Me! (Total: {clicks()})
                    </button>
                    <button onClick={() => setClicks(0)} className="secondary" style="width: 100%; margin-top: 10px;">
                        🔄 Reset Counter
                    </button>
                </div>
                
                <div className="card" style="margin-top: 15px;">
                    <p>Effects are running:</p>
                    <ul style="margin-left: 20px; line-height: 1.8;">
                        <li>Logging name changes to console</li>
                        <li>Updating document title</li>
                        <li>Tracking click count</li>
                        <li>Cleanup function on unmount</li>
                    </ul>
                </div>
            </div>

            <div className="demo-card">
                <h3>useCallback - Memoized Functions</h3>
                <p>Cache function references to prevent unnecessary re-renders.</p>
                
                <div className="counter-display">{clicks()}</div>
                
                <button onClick={handleIncrement}>
                    Click Me! ({clicks()} clicks)
                </button>
            </div>

            <div className="demo-card">
                <h3>useRef - DOM References</h3>
                <p>Access DOM elements directly.</p>
                
                <button onClick={focusInput}>
                    🎯 Focus Name Input
                </button>
            </div>

            <div className="demo-card">
                <h3>Code Example</h3>
                <pre>{`// State management
const [name, setName] = useState('pulsar')
const [age, setAge] = useState(0)

// Computed values
const greeting = useMemo(() => {
    return \`Hello, \${name()}! Age: \${age()}\`
}, [name, age])

// Side effects
useEffect(() => {
    console.log('Name changed:', name())
    return () => console.log('Cleanup')
}, [name])

// Memoized callbacks
const handleClick = useCallback(() => {
    setClicks(c => c + 1)
}, [clicks])

// DOM refs
const inputRef = useRef<HTMLInputElement>()
inputRef.current?.focus()`}</pre>
            </div>
        </div>
    )
}
