/**
 * Main Showcase Application Component
 * Navigation and demo orchestration with URL routing
 */

import { useEffect, useState } from "pulsar"
// import { BatchDemo } from './demos/BatchDemo'
// import { ControlFlowDemo } from './demos/ControlFlowDemo'
import { DIDemo } from './demos/DIDemo'
import { ErrorBoundaryDemo } from './demos/ErrorBoundaryDemo'
import { HooksDemo } from './demos/HooksDemo'
import { LifecycleDemo } from './demos/LifecycleDemo'
// import { PortalDemo } from './demos/PortalDemo'
import { ReactivityDemo } from './demos/ReactivityDemo'
import { ResourceDemo } from './demos/ResourceDemo'
import { RouterDemo } from './demos/RouterDemo'
import { StateManagementDemo } from './demos/StateManagementDemo'

interface IShowcaseAppProps {
    root: any
}

const demos = [
    { id: 'reactivity', name: '⚡ Reactivity', component: ReactivityDemo },
    { id: 'hooks', name: '🪝 Hooks', component: HooksDemo },
    // { id: 'control-flow', name: '🔀 Control Flow', component: ControlFlowDemo },
    { id: 'error-boundary', name: '🛡️ Error Boundaries', component: ErrorBoundaryDemo },
    { id: 'resource', name: '📡 Resources', component: ResourceDemo },
    // { id: 'portal', name: '🌀 Portals', component: PortalDemo },
    // { id: 'batch', name: '📦 Batch Updates', component: BatchDemo },
    { id: 'lifecycle', name: '♻️ Lifecycle', component: LifecycleDemo },
    { id: 'di', name: '💉 Dependency Injection', component: DIDemo },
    { id: 'router', name: '🗺️ Router', component: RouterDemo },
    { id: 'state', name: '🗃️ State Management', component: StateManagementDemo },
]

export const ShowcaseApp = ({ root }: IShowcaseAppProps): HTMLElement => {
    // Get initial route from URL hash
    const getRouteFromHash = () => {
        const hash = window.location.hash.slice(1) // Remove #
        const validDemo = demos.find(d => d.id === hash)
        return validDemo ? hash : 'reactivity'
    }

    const [activeDemo, setActiveDemo] = useState(getRouteFromHash())

    // Navigate to a demo and update URL
    const navigateTo = (demoId: string) => {
        setActiveDemo(demoId)
        window.history.pushState({}, '', `#${demoId}`)
    }

    // Listen for browser back/forward navigation
    useEffect(() => {
        const handlePopState = () => {
            const newRoute = getRouteFromHash()
            setActiveDemo(newRoute)
        }

        window.addEventListener('popstate', handlePopState)
        
        return () => {
            window.removeEventListener('popstate', handlePopState)
        }
    }, [])

    return (
        <div className="container">
            <header>
                <h1>⚛️ pulsar Framework</h1>
                <p>Complete Feature Showcase - Fine-Grained Reactive UI</p>
            </header>

            <div className="nav">
                {demos.map(demo => (
                    <button
                        key={demo.id}
                        className={activeDemo() === demo.id ? 'active' : ''}
                        onClick={() => setActiveDemo(demo.id)}
                    >
                        {demo.name}
                    </button>
                ))}
            </div>

            {demos.map(demo => {
                const DemoComponent = demo.component
                return (
                    <div
                        key={demo.id}
                        className={`demo-section ${activeDemo() === demo.id ? 'active' : ''}`}
                    >
                        <DemoComponent />
                    </div>
                )
            })}
        </div>
    )
}
