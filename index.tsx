/**
 * Application entry point with routing
 */

import { bootstrapApp } from "pulsar"
import { Route, Router } from "pulsar"
import { AppContext } from './src/AppContext'
import { Counter } from './src/Counter'
import { TodoApp } from './src/TodoApp'
import { BatchDemo } from './src/showcase/demos/BatchDemo'
import { ControlFlowDemo } from './src/showcase/demos/ControlFlowDemo'
import { DIDemo } from './src/showcase/demos/DIDemo'
import { ErrorBoundaryDemo } from './src/showcase/demos/ErrorBoundaryDemo'
import { HooksDemo } from './src/showcase/demos/HooksDemo'
import { LifecycleDemo } from './src/showcase/demos/LifecycleDemo'
import { PortalDemo } from './src/showcase/demos/PortalDemo'
import { ReactivityDemo } from './src/showcase/demos/ReactivityDemo'
import { ResourceDemo } from './src/showcase/demos/ResourceDemo'
import { RouterDemo } from './src/showcase/demos/RouterDemo'

// Home component with navigation
const Home = (): HTMLElement => {
    const container = document.createElement('div')
    container.className = 'home'
    container.style.padding = '20px'
    
    const title = document.createElement('h1')
    title.textContent = 'Welcome to Pulsar'
    title.style.marginBottom = '10px'
    
    const subtitle = document.createElement('p')
    subtitle.textContent = 'Choose a demo to explore the framework features:'
    subtitle.style.color = '#666'
    subtitle.style.marginBottom = '30px'
    
    // Basic Examples
    const basicTitle = document.createElement('h2')
    basicTitle.textContent = 'Basic Examples'
    basicTitle.style.marginBottom = '15px'
    
    const basicNav = document.createElement('nav')
    basicNav.style.display = 'flex'
    basicNav.style.gap = '10px'
    basicNav.style.marginBottom = '30px'
    basicNav.style.flexWrap = 'wrap'
    
    const basicLinks = [
        { href: '#/', text: 'Home', color: '#6c757d' },
        { href: '#/counter', text: 'Counter', color: '#007bff' },
        { href: '#/todo', text: 'Todo App', color: '#28a745' }
    ]
    
    basicLinks.forEach(link => {
        const a = document.createElement('a')
        a.href = link.href
        a.textContent = link.text
        a.style.cssText = `padding: 10px 20px; background: ${link.color}; color: white; text-decoration: none; border-radius: 4px;`
        basicNav.appendChild(a)
    })
    
    // Framework Features
    const featuresTitle = document.createElement('h2')
    featuresTitle.textContent = 'Framework Features'
    featuresTitle.style.marginBottom = '15px'
    
    const featuresNav = document.createElement('nav')
    featuresNav.style.display = 'flex'
    featuresNav.style.gap = '10px'
    featuresNav.style.flexWrap = 'wrap'
    
    const featureLinks = [
        { href: '#/reactivity', text: 'Reactivity', color: '#667eea' },
        { href: '#/hooks', text: 'Hooks', color: '#764ba2' },
        { href: '#/control-flow', text: 'Control Flow', color: '#f093fb' },
        { href: '#/error-boundary', text: 'Error Boundaries', color: '#fa709a' },
        { href: '#/resource', text: 'Resources', color: '#fee140' },
        { href: '#/portal', text: 'Portals', color: '#30cfd0' },
        { href: '#/batch', text: 'Batch Updates', color: '#a8edea' },
        { href: '#/lifecycle', text: 'Lifecycle', color: '#ff6b6b' },
        { href: '#/di', text: 'DI', color: '#4ecdc4' },
        { href: '#/router-demo', text: 'Router', color: '#95e1d3' }
    ]
    
    featureLinks.forEach(link => {
        const a = document.createElement('a')
        a.href = link.href
        a.textContent = link.text
        const textColor = ['#fee140', '#a8edea', '#95e1d3'].includes(link.color) ? '#333' : 'white'
        a.style.cssText = `padding: 10px 20px; background: ${link.color}; color: ${textColor}; text-decoration: none; border-radius: 4px;`
        featuresNav.appendChild(a)
    })
    
    container.appendChild(title)
    container.appendChild(subtitle)
    container.appendChild(basicTitle)
    container.appendChild(basicNav)
    container.appendChild(featuresTitle)
    container.appendChild(featuresNav)
    
    return container
}

// Build application root
const appRoot = bootstrapApp()
    .root('#app')
    .onMount((element) => {
        console.log('[App] Mounted successfully', element)
    })
    .onError((error) => {
        console.error('[App] Error:', error)
    })
    .build()

// Define routes declaratively using Route helper
const homeRoute = Route({ path: '/', component: Home, default: true, label: 'Home' })
const counterRoute = Route({ path: '/counter', component: () => <Counter initialCount={0} />, label: 'Counter' })
const todoRoute = Route({ path: '/todo', component: () => <TodoApp initialTodos={[]} />, label: 'Todo' })

// Showcase demo routes
const reactivityRoute = Route({ path: '/reactivity', component: () => <ReactivityDemo />, label: 'Reactivity' })
const hooksRoute = Route({ path: '/hooks', component: () => <HooksDemo />, label: 'Hooks' })
const controlFlowRoute = Route({ path: '/control-flow', component: () => <ControlFlowDemo />, label: 'Control Flow' })
const errorBoundaryRoute = Route({ path: '/error-boundary', component: () => <ErrorBoundaryDemo />, label: 'Error Boundaries' })
const resourceRoute = Route({ path: '/resource', component: () => <ResourceDemo />, label: 'Resources' })
const portalRoute = Route({ path: '/portal', component: () => <PortalDemo />, label: 'Portals' })
const batchRoute = Route({ path: '/batch', component: () => <BatchDemo />, label: 'Batch Updates' })
const lifecycleRoute = Route({ path: '/lifecycle', component: () => <LifecycleDemo />, label: 'Lifecycle' })
const diRoute = Route({ path: '/di', component: () => <DIDemo />, label: 'Dependency Injection' })
const routerDemoRoute = Route({ path: '/router-demo', component: () => <RouterDemo />, label: 'Router Demo' })

// Declarative app with routing
const app = (
    <AppContext.Provider 
        value={{
            appName: 'pulsar',
            version: '1.0.0',
            theme: 'light'
        }}
    >
        <Router children={[
            homeRoute, 
            counterRoute, 
            todoRoute,
            reactivityRoute,
            hooksRoute,
            controlFlowRoute,
            errorBoundaryRoute,
            resourceRoute,
            portalRoute,
            batchRoute,
            lifecycleRoute,
            diRoute,
            routerDemoRoute
        ]} />
    </AppContext.Provider>
)

// Mount the app
const rootElement = document.getElementById('app')
if (rootElement) {
    rootElement.innerHTML = ''
    rootElement.appendChild(app)
}
