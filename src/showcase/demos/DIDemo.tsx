/**
 * Dependency Injection Demo
 */

import { ServiceManager } from "pulsar"
import { useState } from "pulsar"

// Service interfaces
interface ILoggerService {
    log(message: string): void
    error(message: string): void
}

interface ICounterService {
    count: number
    increment(): void
    decrement(): void
}

// Service IDs (symbols)
const SLoggerService = Symbol('LoggerService')
const SCounterService = Symbol('CounterService')

// Service implementations
class LoggerService implements ILoggerService {
    log(message: string) {
        console.log(`📝 [Logger]: ${message}`)
    }
    
    error(message: string) {
        console.error(`❌ [Logger]: ${message}`)
    }
}

class CounterService implements ICounterService {
    count = 0
    private logger: ILoggerService

    constructor(logger: ILoggerService) {
        this.logger = logger
        this.logger.log('CounterService created')
    }

    increment() {
        this.count++
        this.logger.log(`Count incremented to ${this.count}`)
    }

    decrement() {
        this.count--
        this.logger.log(`Count decremented to ${this.count}`)
    }
}

export const DIDemo = () => {
    const [counterValue, setCounterValue] = useState(0)
    const serviceManager = (() => {
        const sm = new ServiceManager()
        
        // Register logger service (singleton)
        sm.register<ILoggerService>(
            SLoggerService,
            () => new LoggerService(),
            { lifetime: 'singleton' }
        )
        
        // Register counter service with dependency
        sm.register<ICounterService>(
            SCounterService,
            (sm) => new CounterService(sm.resolve(SLoggerService)),
            { lifetime: 'singleton', dependencies: [SLoggerService] }
        )
        
        return sm
    })()

    const handleIncrement = () => {
        const counter = serviceManager.resolve<ICounterService>(SCounterService)
        counter.increment()
        setCounterValue(counter.count)
    }

    const handleDecrement = () => {
        const counter = serviceManager.resolve<ICounterService>(SCounterService)
        counter.decrement()
        setCounterValue(counter.count)
    }

    return (
        <div>
            <h2>💉 Dependency Injection</h2>
            <p className="description">
                IoC container for managing dependencies with different lifetimes.
                Supports singletons, transient, and scoped services.
            </p>

            <div className="demo-card">
                <h3>Service Container</h3>
                <p>Services are registered and resolved through the ServiceManager.</p>

                <div style={`font-size: 5rem; text-align: center; padding: 40px; background: linear-gradient(135deg, ${counterValue() > 0 ? '#28a745' : counterValue() < 0 ? '#dc3545' : '#667eea'} 0%, ${counterValue() > 0 ? '#20c997' : counterValue() < 0 ? '#c82333' : '#764ba2'} 100%); color: white; border-radius: 12px; margin: 20px 0; box-shadow: 0 8px 16px rgba(0,0,0,0.2); transition: all 0.3s ease; font-weight: bold; text-shadow: 3px 3px 6px rgba(0,0,0,0.4);`}>
                    {counterValue()}
                </div>

                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                    <button onClick={handleIncrement} style="flex: 1; padding: 15px; font-size: 1.1rem;">
                        ➕ Increment
                    </button>
                    <button onClick={handleDecrement} style="flex: 1; padding: 15px; font-size: 1.1rem;">
                        ➖ Decrement
                    </button>
                    <button onClick={() => {
                        for(let i = 0; i < 5; i++) handleIncrement()
                    }} style="flex: 1; padding: 15px; font-size: 1.1rem;">
                        ⚡ +5
                    </button>
                    <button onClick={() => setCounterValue(0)} className="secondary" style="flex: 1; padding: 15px; font-size: 1.1rem;">
                        🔄 Reset
                    </button>
                </div>
                <p style="text-align: center; margin-top: 15px; color: #666;">
                    👉 Open console to see Logger service in action!
                </p>
            </div>

            <div className="demo-card">
                <h3>Features</h3>
                <div className="grid">
                    <div className="card">
                        <h4>✅ Singleton</h4>
                        <p>Single instance shared across the app</p>
                    </div>
                    <div className="card">
                        <h4>✅ Transient</h4>
                        <p>New instance every time</p>
                    </div>
                    <div className="card">
                        <h4>✅ Scoped</h4>
                        <p>Instance per scope</p>
                    </div>
                    <div className="card">
                        <h4>✅ Dependencies</h4>
                        <p>Automatic dependency resolution</p>
                    </div>
                </div>
            </div>

            <div className="demo-card">
                <h3>Code Example</h3>
                <pre>{`// Create service manager
const sm = new ServiceManager()

// Register services
sm.register<ILoggerService>(
    SLoggerService,
    () => new LoggerService(),
    { lifetime: 'singleton' }
)

sm.register<ICounterService>(
    SCounterService,
    (sm) => new CounterService(
        sm.resolve(SLoggerService) // Dependency
    ),
    { 
        lifetime: 'singleton',
        dependencies: [SLoggerService]
    }
)

// Resolve services
const counter = sm.resolve<ICounterService>(SCounterService)
counter.increment()`}</pre>
            </div>
        </div>
    )
}
