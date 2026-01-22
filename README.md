# Demo Package

Demonstration applications for pulsar framework.

## Running the Demo

```bash
# Start development server
pnpm dev

# Open browser
# - Main app with router: http://localhost:3000/main.html
# - Counter only: http://localhost:3000
# - Todo only: http://localhost:3000/todo.html
```

## Main Application (index.tsx)

The main application demonstrates the complete builder pattern with routing:

```tsx
const appRoot = bootstrapApp()
    .root('#app')
    .onMount((el) => console.log('Mounted'))
    .onError((err) => console.error(err))
    // Future features (commented out)
    // .ioc(serviceManagerInstance)
    // .settings(settingsInstance)
    // .stateManager(store)
    .build()

<AppContextProvider root={appRoot} context={...}>
    <Router>
        <Route path="/" url="/" component={<Home />} default>
            <Route path="/todo" url="/todo" component={<TodoApp />} />
            <Route path="/counter" url="/counter" component={<Counter />} />
        </Route>
    </Router>
</AppContextProvider>
```

## Builder Pattern Features

### Current
- ✅ `root(selector)` - Set mount point
- ✅ `onMount(callback)` - Mount lifecycle
- ✅ `onError(callback)` - Error handling
- ✅ `onUnmount(callback)` - Unmount lifecycle
- ✅ `build()` - Create application root

### Future (Placeholders)
- 🔄 `ioc(container)` - IoC container support
- 🔄 `settings(config)` - Application settings
- 🔄 `stateManager(store)` - Global state management

## Router (Placeholder)

Router and Route components are placeholders for future routing implementation. Currently, they:
- Render all components simultaneously
- Log warnings about incomplete implementation
- Set data attributes for future use

## Structure

```
src/
├── index.tsx           # Main entry with router
├── counter-app.tsx     # Counter standalone entry
├── todo-main.tsx       # Todo standalone entry
├── Counter.tsx         # Counter component
├── TodoApp.tsx         # Todo component
└── AppContext.tsx      # Application context provider
```

## AppContext Wrapper

The AppContext provides typed global context using the new createContext API:

```tsx
const appRoot = bootstrapApp().root('#app').build()

<AppContextProvider root={appRoot} context={{
    appName: 'My App',
    version: '1.0.0'
}}>
    <MyComponent />
</AppContextProvider>
```

## Features

### Children Support

Components naturally support children through the native JSX/TSX feature:

```tsx
// Parent component
export const Container = ({ children }: { children: HTMLElement }) => {
    return <div className="container">{children}</div>
}

// Child component  
export const Child = () => {
    return <span>I'm a child!</span>
}

// Usage (when transformer supports component composition)
<Container>
    <Child />
</Container>
```

### Context Access

The AppContext wrapper stores context data that can be accessed by any component:

```tsx
export const AppContext = ({ children, context }) => {
    const container = document.createElement('div')
    container.className = 'app-context'
    
    // Store context for child components
    if (context) {
        container.__context = context
    }
    
    container.appendChild(children)
    return container
}
```

## Running the Demos

```bash
# Development mode
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Examples

### Counter App

Simple counter with reactive state and computed values:
- Open http://localhost:3000
- Increment/decrement counter
- Adjust multiplier

### Todo App

Full-featured todo application:
- Open http://localhost:3000/todo.html
- Add/remove todos
- Mark as complete
- Filter by status
- Persistent storage

Both examples demonstrate:
- ✅ Signal-based reactivity
- ✅ JSX transformation to direct DOM
- ✅ AppContext wrapper
- ✅ Lifecycle hooks (useEffect)
- ✅ Computed values (useMemo)
- ✅ No virtual DOM, no React
