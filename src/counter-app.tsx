/**
 * Counter application entry point
 */

import { bootstrapApp } from "pulsar"
import { AppContextProvider } from './AppContext'
import { Counter } from './Counter'

// Build application root
const appRoot = bootstrapApp()
    .root('#app')
    .onMount((element) => {
        console.log('[Counter] Mounted successfully', element)
    })
    .onError((error) => {
        console.error('[Counter] Error:', error)
    })
    .build()

// Create and mount application with context provider
const app = (
    <AppContextProvider 
        root={appRoot}
        context={{
            appName: 'Counter App',
            version: '1.0.0',
            theme: 'light'
        }}
    >
        <Counter initialCount={0} />
    </AppContextProvider>
)

// Append the app to the DOM (AppContextProvider will handle mounting to root)
document.getElementById('app')?.appendChild(app)
