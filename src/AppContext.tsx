/**
 * Application Context
 * Provides global context and wraps the root component
 */

import { IApplicationRoot } from "pulsar"
import { createContext, useContext } from "pulsar"



export interface IAppContext {
    appName: string
    version: string
    theme?: string
}

/**
 * Application context with default values
 */
export const AppContext = createContext({
    appName: 'Uranium',
    version: '0.1.0',
    theme: 'light'
} as IAppContext)

/**
 * Hook to access app context
 */
export const useAppContext = (): IAppContext => {
    const context = useContext(AppContext)
    return context as IAppContext
}

interface IAppContextProviderProps {
    root: IApplicationRoot
    context: IAppContext
    children: HTMLElement
}

/**
 * AppContextProvider component wrapper
 * Mounts the application and provides context
 */
export const AppContextProvider = ({ root, context, children }: IAppContextProviderProps): HTMLElement => {
    const container = document.createElement('div')
    container.className = 'app-context-provider'
    container.setAttribute('data-framework', 'uranium')
    
    // Mount children to root on next tick
    Promise.resolve().then(() => {
        const wrapped = (
            <AppContext.Provider value={context}>
                {children}
            </AppContext.Provider>
        )
        
        root.mount(wrapped)
    })
    
    return container
}
