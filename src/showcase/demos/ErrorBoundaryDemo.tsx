/**
 * Error Boundary Demo - Tryer and Catcher components
 */

import { Catcher, Tryer } from "pulsar"
import { useState } from "pulsar"

const BuggyComponent = ({ shouldThrow }: { shouldThrow: () => boolean }) => {
    if (shouldThrow()) {
        throw new Error('💥 Intentional error for demo purposes!')
    }
    return <div className="success-display">✅ Component rendered successfully!</div>
}

export const ErrorBoundaryDemo = () => {
    const [shouldThrow, setShouldThrow] = useState(false)
    const [retryCount, setRetryCount] = useState(0)

    return (
        <div>
            <h2>🛡️ Error Boundaries</h2>
            <p className="description">
                Catch and handle errors gracefully with Tryer/Catcher components.
                Prevent errors from crashing your entire app.
            </p>

            <div className="demo-card">
                <h3>Basic Error Boundary</h3>
                <p>Catch errors and show a fallback UI with retry functionality.</p>

                <button onClick={() => setShouldThrow(!shouldThrow())}>
                    {shouldThrow() ? '✅ Fix Component' : '💣 Throw Error'}
                </button>

                <div>
                    <Tryer
                        options={{
                            onError: (errorInfo) => {
                                console.error('Error caught:', errorInfo.error)
                            },
                            fallback: (errorInfo) => {
                                const el = document.createElement('div')
                                el.className = 'error-display'
                                el.innerHTML = `
                                    <strong>⚠️ Error Occurred!</strong>
                                    <p>The component threw an error. It has been isolated.</p>
                                `
                                return el
                            }
                        }}
                    >
                        <BuggyComponent shouldThrow={shouldThrow} />
                    </Tryer>
                </div>
            </div>

            <div className="demo-card">
                <h3>Custom Error Handler with Retry</h3>
                <p>Use Catcher for advanced error handling with custom UI.</p>

                <button onClick={() => setRetryCount(retryCount() + 1)}>
                    🔄 Force Retry (Count: {retryCount()})
                </button>

                <div>
                    <Tryer
                        options={{
                            onError: (errorInfo) => console.error('Tryer caught:', errorInfo.error)
                        }}
                    >
                        <Catcher
                            showRetry={true}
                            render={(errorInfo) => {
                                const el = document.createElement('div')
                                el.className = 'error-display'
                                const btn = document.createElement('button')
                                btn.textContent = '🔄 Retry Loading'
                                btn.onclick = () => setRetryCount(retryCount() + 1)
                                el.innerHTML = `
                                    <h4>🚨 Custom Error UI</h4>
                                    <p><strong>Error:</strong> ${errorInfo.error.message}</p>
                                    <p><strong>Retry count:</strong> ${retryCount()}</p>
                                `
                                el.appendChild(btn)
                                return el
                            }}
                        />
                        <BuggyComponent shouldThrow={() => retryCount() % 3 !== 0} />
                    </Tryer>
                </div>
            </div>

            <div className="demo-card">
                <h3>Code Example</h3>
                <pre>{`// Basic error boundary
<Tryer
    onError={(error) => console.error(error)}
    fallback={<div>Something went wrong!</div>}
>
    <BuggyComponent />
</Tryer>

// Custom error UI
<Tryer onError={handleError}>
    <Catcher
        showRetry={true}
        render={(errorInfo) => (
            <div>
                <p>Error: {errorInfo.error.message}</p>
                <button onClick={errorInfo.retry}>
                    Retry
                </button>
            </div>
        )}
    />
    <MyComponent />
</Tryer>`}</pre>
            </div>
        </div>
    )
}
