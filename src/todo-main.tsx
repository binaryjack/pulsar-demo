/**
 * Todo application entry point
 */

import { bootstrapApp } from "pulsar"
import { AppContextProvider } from './AppContext'
import { TodoApp } from './TodoApp'

// Build application root
const appRoot = bootstrapApp()
    .root('#app')
    .onMount((element) => {
        console.log('[TodoApp] Mounted successfully', element)
    })
    .onError((error) => {
        console.error('[TodoApp] Error:', error)
    })
    .build()

// Mount application with context provider
const app = (
    <AppContextProvider 
        root={appRoot}
        context={{
            appName: 'Todo App',
            version: '2.0.0',
            theme: 'dark'
        }}
    >
        <TodoApp initialTodos={[]} />
    </AppContextProvider>
)
