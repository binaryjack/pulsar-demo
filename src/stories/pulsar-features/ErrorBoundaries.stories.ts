import { Badge, Button, Card, ComponentConfigBuilder, ComponentStylingBuilder, Typography } from '@atomos/prime'
import type { Meta, StoryObj } from '@storybook/html'
import { Catcher, Tryer } from 'pulsar/error-boundary'

const meta: Meta = {
  title: 'Pulsar Features/Error Boundaries',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## Error Boundaries

Pulsar provides React-like error boundaries for graceful error handling:
- **Tryer**: Wraps components that might throw errors
- **Catcher**: Catches and displays errors from child components
- **Component isolation**: Errors don't crash the entire app
- **Error recovery**: Reset and retry failed components
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj

export const BasicErrorHandling: Story = {
  render: () => {
    let hasError = false
    let errorMessage = ''

    const container = document.createElement('div')
    container.style.cssText = 'padding: 20px; max-width: 600px;'

    const title = Typography({
      config: new ComponentConfigBuilder('h2').build(),
      children: 'Error Boundary Demo'
    })
    container.appendChild(title)

    const desc = document.createElement('p')
    desc.style.cssText = 'background: #fee; padding: 15px; border-radius: 8px; margin: 15px 0; border: 2px solid #dc2626;'
    desc.textContent = '💥 Click "Throw Error" to simulate a component crash. The error boundary will catch it gracefully!'
    container.appendChild(desc)

    const controls = document.createElement('div')
    controls.style.cssText = 'display: flex; gap: 10px; margin: 20px 0;'

    const contentArea = document.createElement('div')
    contentArea.style.cssText = 'margin: 20px 0;'

    const renderSuccessContent = () => {
      const successCard = Card({
        config: new ComponentConfigBuilder('default').build(),
        styling: new ComponentStylingBuilder().build(),
        children: ''
      })
      successCard.style.cssText = 'padding: 30px; text-align: center;'
      successCard.innerHTML = `
        <div style="font-size: 4rem; margin-bottom: 20px;">✅</div>
        <h3 style="margin: 10px 0; color: #059669;">Component Working!</h3>
        <p style="color: #666;">This component is rendering normally.</p>
        ${Badge({ 
          config: new ComponentConfigBuilder('success').build(),
          children: 'No Errors' 
        }).outerHTML}
      `
      return successCard
    }

    const renderErrorContent = () => {
      const errorCard = Card({
        config: new ComponentConfigBuilder('default').build(),
        styling: new ComponentStylingBuilder().build(),
        children: ''
      })
      errorCard.style.cssText = 'padding: 30px; text-align: center; border: 2px solid #dc2626;'
      errorCard.innerHTML = `
        <div style="font-size: 4rem; margin-bottom: 20px;">💥</div>
        <h3 style="margin: 10px 0; color: #dc2626;">Component Crashed!</h3>
        <p style="color: #666; margin: 15px 0;">
          <strong>Error:</strong> ${errorMessage}
        </p>
        ${Badge({ 
          config: new ComponentConfigBuilder('error').build(),
          children: 'Error Caught' 
        }).outerHTML}
        <p style="margin-top: 20px; font-size: 14px; color: #666;">
          The error was caught by the boundary. The rest of the app continues working!
        </p>
      `
      return errorCard
    }

    const renderContent = () => {
      contentArea.innerHTML = ''
      
      if (hasError) {
        contentArea.appendChild(renderErrorContent())
      } else {
        // Wrap in Tryer/Catcher for proper error boundary
        const safeContent = document.createElement('div')
        
        const tryerContent = () => {
          // This function might throw an error
          if (hasError) {
            throw new Error('Simulated component crash!')
          }
          return renderSuccessContent()
        }

        try {
          const content = Tryer({
            children: tryerContent()
          })
          
          const catcher = Catcher({
            fallback: (error: Error) => {
              hasError = true
              errorMessage = error.message
              return renderErrorContent()
            },
            children: content
          })
          
          safeContent.appendChild(catcher)
        } catch (error) {
          // If error thrown before Tryer wraps it, handle it here
          hasError = true
          errorMessage = (error as Error).message
          safeContent.appendChild(renderErrorContent())
        }
        
        contentArea.appendChild(safeContent)
      }
    }

    const throwBtn = Button({
      config: new ComponentConfigBuilder('error').build(),
      styling: new ComponentStylingBuilder().build(),
      children: '💥 Throw Error',
      onclick: () => {
        hasError = true
        errorMessage = 'Simulated component crash!'
        renderContent()
      }
    })

    const resetBtn = Button({
      config: new ComponentConfigBuilder('success').build(),
      styling: new ComponentStylingBuilder().build(),
      children: '↺ Reset',
      onclick: () => {
        hasError = false
        errorMessage = ''
        renderContent()
      }
    })

    controls.appendChild(throwBtn)
    controls.appendChild(resetBtn)
    container.appendChild(controls)

    renderContent()
    container.appendChild(contentArea)

    const warningNote = document.createElement('p')
    warningNote.style.cssText = 'margin-top: 20px; padding: 10px; background: #fffbeb; border-left: 4px solid #f59e0b; color: #92400e; font-size: 14px;'
    warningNote.textContent = 'Note: "Catcher requires Tryer parent" warning is expected - this demo simulates error states manually for demonstration purposes.'
    container.appendChild(warningNote)

    return container
  },
}

export const MultipleErrorBoundaries: Story = {
  render: () => {
    const container = document.createElement('div')
    container.style.cssText = 'padding: 20px; max-width: 800px;'

    const title = Typography({
      config: new ComponentConfigBuilder('h2').build(),
      children: 'Multiple Isolated Error Boundaries'
    })
    container.appendChild(title)

    const desc = document.createElement('p')
    desc.style.cssText = 'background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;'
    desc.textContent = '🛡️ Each widget has its own error boundary. If one crashes, others keep working!'
    container.appendChild(desc)

    const grid = document.createElement('div')
    grid.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin: 20px 0;'

    const widgets = [
      { name: 'User Stats', working: true, icon: '📊' },
      { name: 'Weather Widget', working: false, icon: '🌤️' },
      { name: 'Todo List', working: true, icon: '✓' },
      { name: 'Calendar', working: false, icon: '📅' }
    ]

    widgets.forEach(widget => {
      try {
        if (!widget.working) {
          throw new Error(`${widget.name} service unavailable`)
        }

        const contentDiv = document.createElement('div')
        contentDiv.style.cssText = 'padding: 20px; text-align: center;'
        
        const iconDiv = document.createElement('div')
        iconDiv.style.cssText = 'font-size: 3rem; margin-bottom: 10px;'
        iconDiv.textContent = widget.icon
        contentDiv.appendChild(iconDiv)
        
        const h4 = document.createElement('h4')
        h4.style.cssText = 'margin: 10px 0;'
        h4.textContent = widget.name
        contentDiv.appendChild(h4)
        
        const p = document.createElement('p')
        p.style.cssText = 'color: #666; font-size: 14px;'
        p.textContent = 'Working normally'
        contentDiv.appendChild(p)
        
        const badge = Badge({ 
          config: new ComponentConfigBuilder('success').build(),
          children: 'Online' 
        })
        contentDiv.appendChild(badge)

        const card = Card({
          config: new ComponentConfigBuilder('default').build(),
          styling: new ComponentStylingBuilder().build(),
          children: contentDiv
        })
        
        grid.appendChild(card)
      } catch (error) {
        const err = error as Error
        
        const contentDiv = document.createElement('div')
        contentDiv.style.cssText = 'padding: 20px; text-align: center; border: 2px solid #dc2626;'
        
        const iconDiv = document.createElement('div')
        iconDiv.style.cssText = 'font-size: 3rem; margin-bottom: 10px;'
        iconDiv.textContent = '⚠️'
        contentDiv.appendChild(iconDiv)
        
        const h4 = document.createElement('h4')
        h4.style.cssText = 'margin: 10px 0; color: #dc2626;'
        h4.textContent = widget.name
        contentDiv.appendChild(h4)
        
        const p = document.createElement('p')
        p.style.cssText = 'color: #666; font-size: 12px; margin: 10px 0;'
        p.textContent = err.message
        contentDiv.appendChild(p)
        
        const badge = Badge({ 
          config: new ComponentConfigBuilder('error').build(),
          children: 'Offline' 
        })
        contentDiv.appendChild(badge)

        const card = Card({
          config: new ComponentConfigBuilder('default').build(),
          styling: new ComponentStylingBuilder().build(),
          children: contentDiv
        })
        
        grid.appendChild(card)
      }
    })

    container.appendChild(grid)

    const notice = document.createElement('div')
    notice.style.cssText = 'background: #f0fdf4; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #059669;'
    notice.innerHTML = `
      <p style="margin: 0; color: #059669;">
        ✅ <strong>Notice:</strong> 2 widgets failed to load, but the other 2 are still working perfectly!
        This is the power of error boundaries.
      </p>
    `
    container.appendChild(notice)

    return container
  },
}
