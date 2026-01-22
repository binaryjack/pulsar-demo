<img src="https://raw.githubusercontent.com/binaryjack/pulsar-design-system/main/art-kit/SVG/pulsar-logo.svg" alt="Pulsar" width="400"/>

# @pulsar/demo

Demonstration applications showcasing Pulsar framework features and capabilities.

<p align="center">
  <strong><a href="https://www.linkedin.com/in/tadeopiana/">follow me</a></strong>
</p>

## Features

- ✅ **Counter App**: Signal-based reactivity demonstration
- ✅ **Todo App**: State management and list rendering
- ✅ **Showcase**: Component library examples
- ✅ **Builder Pattern**: Application bootstrapping with lifecycle hooks
- ✅ **Context API**: Typed global context demonstration
- ✅ **Router Integration**: Placeholder routing implementation
- ✅ Full TypeScript support
- ✅ Vite + HMR for fast development

## Running the Demo

```bash
# Clone the repository
git clone https://github.com/binaryjack/pulsar-demo.git
cd pulsar-demo

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open in browser
# - Main app with router: http://localhost:3000/main.html
# - Counter only: http://localhost:3000
# - Todo only: http://localhost:3000/todo.html
# - Showcase: http://localhost:3000/showcase.html
```

## Demo Applications

### Counter App

Simple reactive counter demonstrating:
- Signal-based state management
- Event handling
- Fine-grained reactivity

**Entry:** [src/counter-app.tsx](./src/counter-app.tsx)

```tsx
export const Counter = () => {
  const [count, setCount] = useState(0)
  return (
    <button onClick={() => setCount(count() + 1)}>
      Count: {count()}
    </button>
  )
}
```

### Todo App

Full-featured todo application demonstrating:
- Complex state management
- List rendering with keyed reconciliation
- CRUD operations
- Conditional rendering

**Entry:** [src/todo-main.tsx](./src/todo-main.tsx)

### Main Application

Complete app demonstrating the builder pattern:

**Entry:** [src/index.tsx](./src/index.tsx)

```tsx
const appRoot = bootstrapApp()
    .root('#app')
    .onMount((el) => console.log('Mounted'))
    .onError((err) => console.error(err))
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

### Current Implementation ✅
- `root(selector)` - Set mount point
- `onMount(callback)` - Mount lifecycle
- `onError(callback)` - Error handling
- `onUnmount(callback)` - Unmount lifecycle
- `build()` - Create application root

### Planned Features 🔄
- `ioc(container)` - IoC container support
- `settings(config)` - Application settings
- `stateManager(store)` - Global state management

## Router (Placeholder)

Router and Route components are placeholders for future routing implementation. Currently, they:
- Render all components simultaneously
- Log warnings about incomplete implementation
- Set data attributes for future use

## Project Structure

```
src/
├── index.tsx           # Main entry with router
├── counter-app.tsx     # Counter standalone entry
├── todo-main.tsx       # Todo standalone entry
├── showcase-main.tsx   # Showcase entry
├── Counter.tsx         # Counter component
├── TodoApp.tsx         # Todo component
├── AppContext.tsx      # Application context provider
├── showcase/           # Component showcase demos
└── stories/            # Storybook stories (planned)
```

## AppContext Wrapper

The AppContext provides typed global context using the createContext API:

```tsx
const appRoot = bootstrapApp().root('#app').build()

<AppContextProvider root={appRoot} context={{
    appName: 'My App',
    version: '1.0.0'
}}>
    <MyComponent />
</AppContextProvider>
```

## Features Demonstrated

### Children Support

Components naturally support children through native JSX/TSX:

```tsx
// Parent component
export const Container = ({ children }: { children: HTMLElement }) => {
    return <div className="container">{children}</div>
}
```

### Signal-Based Reactivity

Fine-grained reactivity with automatic dependency tracking:

```tsx
const [count, setCount] = useState(0)
const doubled = computed(() => count() * 2)

// Only updates when count changes
createEffect(() => {
    console.log('Count:', count())
})
```

### List Rendering

Efficient list updates with keyed reconciliation:

```tsx
<For each={todos()} key={(todo) => todo.id}>
    {(todo, index) => <TodoItem todo={todo} />}
</For>
```

## Roadmap

### Completed ✅
- Counter demo with signals
- Todo app with CRUD operations
- Builder pattern implementation
- Context API integration
- Multiple entry points (counter, todo, main, showcase)
- TypeScript transformer integration via Vite plugin

### In Progress 🚧
- Component showcase with examples
- Storybook integration
- Advanced state management patterns

### Planned 📋
- Full router implementation with:
  - URL parameter extraction
  - Nested routing
  - Navigation guards
  - Browser history integration
- Form validation examples
- Animation/transition demos
- Accessibility examples
- Performance optimization patterns
- Server-side rendering demo

## Pulsar Ecosystem

| Package | Description | Status |
|---------|-------------|--------|
| [pulsar.dev](https://github.com/binaryjack/pulsar.dev) | Core framework with signal-based reactivity | ✅ Active |
| [@pulsar/ui](https://github.com/binaryjack/pulsar-ui.dev) | UI component library | ✅ Active |
| [@pulsar/design-tokens](https://github.com/binaryjack/pulsar-design-system) | Design tokens & art-kit | ✅ Active |
| [@pulsar/transformer](https://github.com/binaryjack/pulsar-transformer) | JSX to DOM compiler | ✅ Active |
| [@pulsar/vite-plugin](https://github.com/binaryjack/pulsar-vite-plugin) | Vite integration | ✅ Active |
| [@pulsar/demo](https://github.com/binaryjack/pulsar-demo) | Example applications | ✅ Active |

## Contributing

We welcome contributions! To get started:

1. **Clone the repository**
   ```bash
   git clone https://github.com/binaryjack/pulsar-demo.git
   cd pulsar-demo
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Run development server**
   ```bash
   pnpm dev
   ```

4. **Build for production**
   ```bash
   pnpm build
   ```

5. **Preview production build**
   ```bash
   pnpm preview
   ```

### Adding New Demos

1. Create a new entry file in `src/` (e.g., `my-demo.tsx`)
2. Add corresponding HTML file in root (e.g., `my-demo.html`)
3. Update `vite.config.ts` to include the new entry point
4. Add documentation to this README

## Development Tips

- **Hot Module Replacement (HMR)**: Changes are reflected instantly
- **TypeScript**: Full type checking during development
- **Component Isolation**: Test components independently using separate entry points
- **Debugging**: Use browser DevTools with source maps enabled

## License

MIT License - Copyright (c) 2026 Pulsar Framework

See [LICENSE](./LICENSE) file for details.

---

**Connect:** [LinkedIn](https://www.linkedin.com/in/tadeopiana/) • **Explore:** [Pulsar Ecosystem](#pulsar-ecosystem)

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
