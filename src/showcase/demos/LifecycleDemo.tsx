/**
 * Lifecycle Demo - onMount, onCleanup
 */

import { Show } from "pulsar"
import { useState } from "pulsar"
import { onCleanup, onMount } from "pulsar"

const LifecycleComponent = ({ name }: { name: string }) => {
    const [timer, setTimer] = useState(0)
    let intervalId: number

    onMount(() => {
        console.log(`✅ ${name} mounted`)
        
        intervalId = window.setInterval(() => {
            setTimer(timer() + 1)
        }, 1000)
    })

    onCleanup(() => {
        console.log(`🧹 ${name} cleanup - stopping interval`)
        clearInterval(intervalId)
    })

    return (
        <div className="card">
            <h4>⏱️ {name}</h4>
            <div style="font-size: 1.5rem; color: #667eea;">
                {timer()}s
            </div>
            <small>Running timer (check console)</small>
        </div>
    )
}

export const LifecycleDemo = () => {
    const [showComponent, setShowComponent] = useState(true)
    const [componentCount, setComponentCount] = useState(1)

    return (
        <div>
            <h2>♻️ Lifecycle Hooks</h2>
            <p className="description">
                Manage component lifecycle with onMount and onCleanup hooks.
                Open console to see lifecycle logs.
            </p>

            <div className="demo-card">
                <h3>Mount & Cleanup</h3>
                <p>Components run setup on mount and cleanup on unmount.</p>

                <div>
                    <button onClick={() => setShowComponent(!showComponent())}>
                        {showComponent() ? '🔴 Unmount' : '🟢 Mount'} Component
                    </button>
                    <button onClick={() => setComponentCount(componentCount() + 1)}>
                        ➕ Add Component ({componentCount()})
                    </button>
                </div>

                <div className="grid">
                    <Show when={showComponent()}>
                        {() => {
                            const container = document.createElement('div')
                            Array.from({ length: componentCount() }).forEach((_, i) => {
                                container.appendChild(LifecycleComponent({ name: `Timer ${i + 1}` }))
                            })
                            return container
                        }}
                    </Show>
                </div>

                <Show when={!showComponent()}>
                    <div className="error-display">
                        Components unmounted. Check console for cleanup logs.
                    </div>
                </Show>
            </div>

            <div className="demo-card">
                <h3>Code Example</h3>
                <pre>{`const MyComponent = () => {
    let intervalId: number

    // Runs once when component mounts
    onMount(() => {
        console.log('Component mounted')
        
        intervalId = setInterval(() => {
            console.log('Tick')
        }, 1000)
    })

    // Runs when component unmounts
    onCleanup(() => {
        console.log('Cleanup')
        clearInterval(intervalId)
    })

    return <div>Component content</div>
}`}</pre>
            </div>
        </div>
    )
}
