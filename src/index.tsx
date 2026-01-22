/**
 * Application entry point
 * Demonstrates the builder pattern with routing
 */

import { bootstrapApp } from "pulsar"
import { Route, Router } from "pulsar"
import { AppContextProvider } from './AppContext'
import { Counter } from './Counter'
import { TodoApp } from './TodoApp'

// Example Home component
const Home = (): HTMLElement => {
    const container = document.createElement('div')
    container.className = 'home'
    container.innerHTML = `
        <h1>Welcome to pulsar</h1>
        <p>Choose a demo:</p>
        <nav style="display: flex; gap: 20px; margin-top: 20px;">
            <a href="#/" style="padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 4px;">Home</a>
            <a href="#/counter" style="padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 4px;">Counter</a>
            <a href="#/todo" style="padding: 10px 20px; background: #28a745; color: white; text-decoration: none; border-radius: 4px;">Todo App</a>
        </nav>
    `
    return container
}

// Build application root with fluent API
const appRoot = bootstrapApp()
    .root('#app')
    .onMount((element) => {
        console.log('[App] Mounted successfully', element)
    })
    .onError((error) => {
        console.error('[App] Error:', error)
    })
    // Future features (placeholders)
    // .ioc(serviceManagerInstance)
    // .settings(settingsInstance)
    // .stateManager(store)
    .build()

// Mount application with declarative routing
const app = (
    <AppContextProvider 
        root={appRoot}
        context={{
            appName: 'pulsar',
            version: '1.0.0',
            theme: 'light'
        }}
        children={
            <Router>
                <Route path="/" component={Home} default={true} label="Home" />
                <Route path="/counter" component={() => <Counter initialCount={0} />} label="Counter" />
                <Route path="/todo" component={() => <TodoApp initialTodos={[]} />} label="Todo" />
            </Router>
        }
    />
)
