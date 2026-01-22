import { Badge, Button, Card, ComponentConfigBuilder, ComponentStylingBuilder, Typography } from '@atomos/prime'
import type { Meta, StoryObj } from '@storybook/html'
import { ServiceLocator, ServiceManager } from 'pulsar/di'

const meta: Meta = {
  title: 'Pulsar Features/Dependency Injection',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## Dependency Injection Container

Pulsar provides a full IoC container for managing services:
- **ServiceManager**: Register and configure services
- **ServiceLocator**: Resolve service instances
- **Lifecycle management**: Singleton, transient, and scoped lifetimes
- **Type-safe**: Full TypeScript support with generics
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj

// Service interfaces
interface ILogger {
  log(message: string): void
  getHistory(): string[]
}

interface IDataService {
  fetchData(): Promise<any>
  saveData(data: any): void
}

interface INotificationService {
  notify(message: string, type: 'info' | 'success' | 'error'): void
  getNotifications(): Array<{ message: string; type: string; timestamp: number }>
}

export const SingletonServices: Story = {
  render: () => {
    // Create service manager
    const serviceManager = new ServiceManager()
    const serviceLocator = new ServiceLocator(serviceManager)

    // Register logger service (singleton)
    class Logger implements ILogger {
      private history: string[] = []
      private instanceId = Math.random().toString(36).slice(2, 8)

      log(message: string) {
        const entry = `[${new Date().toLocaleTimeString()}] ${message}`
        this.history.push(entry)
        console.log(entry)
      }

      getHistory() {
        return this.history
      }

      getInstanceId() {
        return this.instanceId
      }
    }

    serviceManager.register('logger', () => new Logger(), { lifetime: 'singleton' })

    const container = document.createElement('div')
    container.style.cssText = 'padding: 20px; max-width: 800px;'

    const title = Typography({
      config: new ComponentConfigBuilder('h2').build(),
      children: 'Singleton Service Pattern'
    })
    container.appendChild(title)

    const desc = document.createElement('p')
    desc.style.cssText = 'background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;'
    desc.textContent = '🔧 Singleton services are created once and shared across the entire application. Multiple resolves return the same instance!'
    container.appendChild(desc)

    // Component A
    const componentA = Card({
      config: new ComponentConfigBuilder('default').build(),
      styling: new ComponentStylingBuilder().build(),
      children: ''
    })
    componentA.style.cssText = 'padding: 20px; margin: 20px 0;'

    const componentAContent = document.createElement('div')
    componentAContent.innerHTML = `
      <h3 style="margin: 0 0 15px 0;">Component A</h3>
      <p style="color: #666; margin-bottom: 15px;">
        This component uses the Logger service
      </p>
    `

    const logBtnA = Button({
      config: new ComponentConfigBuilder('primary').build(),
      styling: new ComponentStylingBuilder().build(),
      children: '📝 Log from A',
      onclick: () => {
        const logger = serviceLocator.get<Logger>('logger')
        logger.log('Message from Component A')
        updateLogHistory()
      }
    })
    componentAContent.appendChild(logBtnA)
    componentA.appendChild(componentAContent)
    container.appendChild(componentA)

    // Component B
    const componentB = Card({
      config: new ComponentConfigBuilder('default').build(),
      styling: new ComponentStylingBuilder().build(),
      children: ''
    })
    componentB.style.cssText = 'padding: 20px; margin: 20px 0;'

    const componentBContent = document.createElement('div')
    componentBContent.innerHTML = `
      <h3 style="margin: 0 0 15px 0;">Component B</h3>
      <p style="color: #666; margin-bottom: 15px;">
        This component also uses the Logger service (same instance!)
      </p>
    `

    const logBtnB = Button({
      config: new ComponentConfigBuilder('secondary').build(),
      styling: new ComponentStylingBuilder().build(),
      children: '📝 Log from B',
      onclick: () => {
        const logger = serviceLocator.get<Logger>('logger')
        logger.log('Message from Component B')
        updateLogHistory()
      }
    })
    componentBContent.appendChild(logBtnB)
    componentB.appendChild(componentBContent)
    container.appendChild(componentB)

    // Log history display
    const historyCard = Card({
      config: new ComponentConfigBuilder('default').build(),
      styling: new ComponentStylingBuilder().build(),
      children: ''
    })
    historyCard.style.cssText = 'padding: 20px; margin: 20px 0; background: #1e293b; color: white;'

    const historyContent = document.createElement('div')
    historyContent.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
        <h3 style="margin: 0; color: white;">📋 Shared Log History</h3>
        ${Badge({
          config: new ComponentConfigBuilder('success').build(),
          children: 'Singleton'
        }).outerHTML}
      </div>
      <div style="font-family: monospace; font-size: 13px; line-height: 1.8;" id="log-output">
        <p style="color: #94a3b8; margin: 0;">No logs yet. Click buttons above to log messages.</p>
      </div>
    `

    const updateLogHistory = () => {
      const logger = serviceLocator.get<Logger>('logger')
      const history = logger.getHistory()
      const logOutput = historyContent.querySelector('#log-output')
      
      if (logOutput) {
        if (history.length === 0) {
          logOutput.innerHTML = '<p style="color: #94a3b8; margin: 0;">No logs yet.</p>'
        } else {
          logOutput.innerHTML = history.map(entry => 
            `<div style="color: #e2e8f0; margin: 5px 0;">${entry}</div>`
          ).join('')
        }
      }

      // Show instance ID to prove it's the same instance
      const instanceBadge = historyContent.querySelector('.instance-badge')
      if (!instanceBadge && history.length > 0) {
        const badge = document.createElement('div')
        badge.className = 'instance-badge'
        badge.style.cssText = 'margin-top: 15px; padding: 10px; background: #334155; border-radius: 6px; font-size: 12px;'
        badge.innerHTML = `
          <strong style="color: #22c55e;">✓ Same Instance Confirmed</strong><br>
          <span style="color: #94a3b8;">Instance ID: ${logger.getInstanceId()}</span>
        `
        historyContent.appendChild(badge)
      }
    }

    historyCard.appendChild(historyContent)
    container.appendChild(historyCard)

    return container
  },
}

export const TransientServices: Story = {
  render: () => {
    const serviceManager = new ServiceManager()
    const serviceLocator = new ServiceLocator(serviceManager)

    // Register notification service (transient - new instance each time)
    class NotificationService implements INotificationService {
      private notifications: Array<{ message: string; type: string; timestamp: number }> = []
      private instanceId = Math.random().toString(36).slice(2, 8)

      notify(message: string, type: 'info' | 'success' | 'error') {
        this.notifications.push({
          message,
          type,
          timestamp: Date.now()
        })
      }

      getNotifications() {
        return this.notifications
      }

      getInstanceId() {
        return this.instanceId
      }
    }

    serviceManager.register('notifications', () => new NotificationService(), { lifetime: 'transient' })

    const container = document.createElement('div')
    container.style.cssText = 'padding: 20px; max-width: 800px;'

    const title = Typography({
      config: new ComponentConfigBuilder('h2').build(),
      children: 'Transient Service Pattern'
    })
    container.appendChild(title)

    const desc = document.createElement('p')
    desc.style.cssText = 'background: #fff3cd; padding: 15px; border-radius: 8px; margin: 15px 0;'
    desc.textContent = '🔄 Transient services create a new instance every time they are resolved. Each component gets its own instance!'
    container.appendChild(desc)

    const instancesCard = Card({
      config: new ComponentConfigBuilder('default').build(),
      styling: new ComponentStylingBuilder().build(),
      children: ''
    })
    instancesCard.style.cssText = 'padding: 20px; margin: 20px 0;'

    const instancesContent = document.createElement('div')
    instancesContent.innerHTML = `
      <h3 style="margin: 0 0 15px 0;">Service Instances</h3>
      <div id="instances-list" style="display: grid; gap: 10px; margin-top: 15px;">
        <p style="color: #666;">Click button below to create new service instances</p>
      </div>
    `

    const createInstanceBtn = Button({
      config: new ComponentConfigBuilder('primary').build(),
      styling: new ComponentStylingBuilder().build(),
      children: '➕ Resolve New Instance',
      onclick: () => {
        const notification = serviceLocator.get<NotificationService>('notifications')
        const instancesList = instancesContent.querySelector('#instances-list')
        
        if (instancesList) {
          const instanceCard = document.createElement('div')
          instanceCard.style.cssText = 'padding: 15px; background: #f0fdf4; border-radius: 8px; border-left: 4px solid #059669;'
          instanceCard.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <strong style="color: #059669;">New Instance Created</strong>
                <p style="margin: 5px 0 0 0; font-size: 13px; color: #666;">
                  Instance ID: <code>${notification.getInstanceId()}</code>
                </p>
              </div>
              ${Badge({
                config: new ComponentConfigBuilder('success').build(),
                children: 'Transient'
              }).outerHTML}
            </div>
          `
          
          if (instancesList.querySelector('p')) {
            instancesList.innerHTML = ''
          }
          instancesList.appendChild(instanceCard)
        }
      }
    })
    instancesContent.appendChild(createInstanceBtn)

    instancesCard.appendChild(instancesContent)
    container.appendChild(instancesCard)

    const comparisonCard = Card({
      config: new ComponentConfigBuilder('default').build(),
      styling: new ComponentStylingBuilder().build(),
      children: ''
    })
    comparisonCard.style.cssText = 'padding: 20px; margin: 20px 0; background: #eff6ff;'
    comparisonCard.innerHTML = `
      <h4 style="margin: 0 0 15px 0; color: #3b82f6;">Service Lifetime Comparison</h4>
      <div style="display: grid; gap: 15px;">
        <div style="padding: 15px; background: white; border-radius: 6px;">
          <strong style="color: #059669;">✓ Singleton</strong>
          <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">
            Created once, shared everywhere. Same instance for all resolves.
          </p>
        </div>
        <div style="padding: 15px; background: white; border-radius: 6px;">
          <strong style="color: #3b82f6;">🔄 Transient</strong>
          <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">
            Created every time. New instance for each resolve.
          </p>
        </div>
        <div style="padding: 15px; background: white; border-radius: 6px;">
          <strong style="color: #f59e0b;">⏱️ Scoped</strong>
          <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">
            Created once per scope. Same instance within a scope, different across scopes.
          </p>
        </div>
      </div>
    `
    container.appendChild(comparisonCard)

    return container
  },
}
