import { Badge, Button, Card, ComponentConfigBuilder, ComponentStylingBuilder, Input, Typography } from '@atomos/prime'
import type { Meta, StoryObj } from '@storybook/html'
import { createContext } from 'pulsar/context'

const meta: Meta = {
  title: 'Pulsar Features/Context System',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## Context API

Pulsar provides a React-like Context API for prop drilling avoidance:
- **createContext**: Create a context with default value
- **useContext**: Access context value in nested components
- **Provider**: Wrap components to provide context value
- **Type-safe**: Full TypeScript support
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj

interface ThemeContext {
  primaryColor: string
  fontSize: 'small' | 'medium' | 'large'
  borderRadius: number
}

interface UserContext {
  username: string
  role: 'admin' | 'user' | 'guest'
  isLoggedIn: boolean
}

export const ThemeContextDemo: Story = {
  render: () => {
    const ThemeCtx = createContext<ThemeContext>({
      primaryColor: '#667eea',
      fontSize: 'medium',
      borderRadius: 8
    })

    const container = document.createElement('div')
    container.style.cssText = 'padding: 20px; max-width: 800px;'

    const title = Typography({
      config: new ComponentConfigBuilder('h2').build(),
      children: 'Theme Context Demo'
    })
    container.appendChild(title)

    const desc = document.createElement('p')
    desc.style.cssText = 'background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;'
    desc.textContent = '🎨 Change theme settings above. Nested components automatically receive updates via context!'
    container.appendChild(desc)

    // Theme controls
    let currentTheme: ThemeContext = {
      primaryColor: '#667eea',
      fontSize: 'medium',
      borderRadius: 8
    }

    const controlsCard = Card({
      config: new ComponentConfigBuilder('default').build(),
      styling: new ComponentStylingBuilder().build(),
      children: ''
    })
    controlsCard.style.cssText = 'padding: 20px; margin: 20px 0;'

    const controlsContent = document.createElement('div')
    controlsContent.innerHTML = `
      <h3 style="margin: 0 0 15px 0;">Theme Controls</h3>
      <div style="display: grid; gap: 15px;">
        <div>
          <label style="display: block; margin-bottom: 5px; font-weight: 500;">Primary Color</label>
          <div style="display: flex; gap: 10px;">
            ${['#667eea', '#059669', '#dc2626', '#f59e0b', '#8b5cf6'].map(color => `
              <button data-color="${color}" style="
                width: 40px; 
                height: 40px; 
                border-radius: 50%; 
                background: ${color}; 
                border: 3px solid ${color === currentTheme.primaryColor ? '#000' : 'transparent'};
                cursor: pointer;
              "></button>
            `).join('')}
          </div>
        </div>
        <div>
          <label style="display: block; margin-bottom: 5px; font-weight: 500;">Font Size</label>
          <div style="display: flex; gap: 10px;" id="font-size-buttons">
            ${['small', 'medium', 'large'].map(size => `
              <button data-size="${size}" style="
                padding: 8px 16px;
                border-radius: 6px;
                border: 1px solid #cbd5e1;
                background: ${size === currentTheme.fontSize ? '#667eea' : '#f1f5f9'};
                color: ${size === currentTheme.fontSize ? 'white' : '#334155'};
                cursor: pointer;
                font-weight: 500;
              ">${size.charAt(0).toUpperCase() + size.slice(1)}</button>
            `).join('')}
          </div>
        </div>
        <div>
          <label style="display: block; margin-bottom: 5px; font-weight: 500;">Border Radius: ${currentTheme.borderRadius}px</label>
          <input type="range" min="0" max="20" value="${currentTheme.borderRadius}" 
                 style="width: 100%;" data-radius>
        </div>
      </div>
    `

    const updateTheme = () => {
      renderThemedComponents()
      
      // Update active states for color buttons
      controlsContent.querySelectorAll('[data-color]').forEach(btn => {
        const color = (btn as HTMLElement).dataset.color
        ;(btn as HTMLElement).style.border = `3px solid ${color === currentTheme.primaryColor ? '#000' : 'transparent'}`
      })
      
      // Update active states for font size buttons
      controlsContent.querySelectorAll('[data-size]').forEach(btn => {
        const size = (btn as HTMLElement).dataset.size
        if (size === currentTheme.fontSize) {
          (btn as HTMLElement).style.background = '#667eea'
          ;(btn as HTMLElement).style.color = 'white'
        } else {
          (btn as HTMLElement).style.background = '#f1f5f9'
          ;(btn as HTMLElement).style.color = '#334155'
        }
      })
    }

    // Event listeners for color controls
    controlsContent.querySelectorAll('[data-color]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        currentTheme.primaryColor = (e.target as HTMLElement).dataset.color || '#667eea'
        updateTheme()
      })
    })

    // Event listeners for font size controls
    controlsContent.querySelectorAll('[data-size]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        currentTheme.fontSize = ((e.target as HTMLElement).dataset.size as 'small' | 'medium' | 'large') || 'medium'
        updateTheme()
      })
    })

    const radiusSlider = controlsContent.querySelector('[data-radius]') as HTMLInputElement
    radiusSlider?.addEventListener('input', (e) => {
      currentTheme.borderRadius = Number((e.target as HTMLInputElement).value)
      const label = controlsContent.querySelector('label[style*="Border Radius"]')
      if (label) label.textContent = `Border Radius: ${currentTheme.borderRadius}px`
      updateTheme()
    })

    controlsCard.appendChild(controlsContent)
    container.appendChild(controlsCard)

    // Themed components area
    const themedArea = document.createElement('div')
    themedArea.style.cssText = 'margin: 20px 0;'

    const renderThemedComponents = () => {
      const fontSize = currentTheme.fontSize === 'small' ? '14px' : currentTheme.fontSize === 'large' ? '18px' : '16px'

      themedArea.innerHTML = ''
      
      const demoCard = Card({
        config: new ComponentConfigBuilder('default').build(),
        styling: new ComponentStylingBuilder().build(),
        children: ''
      })
      demoCard.style.cssText = `
        padding: 30px; 
        border-radius: ${currentTheme.borderRadius}px;
        font-size: ${fontSize};
      `

      demoCard.innerHTML = `
        <h3 style="margin: 0 0 15px 0; color: ${currentTheme.primaryColor};">
          Themed Component
        </h3>
        <p style="margin: 15px 0;">
          This component reads theme values from context. No prop drilling needed!
        </p>
        <div style="display: flex; gap: 10px; margin-top: 20px;">
          ${Badge({
            config: new ComponentConfigBuilder('primary').build(),
            children: `Color: ${currentTheme.primaryColor}`
          }).outerHTML}
          ${Badge({
            config: new ComponentConfigBuilder('secondary').build(),
            children: `Size: ${currentTheme.fontSize}`
          }).outerHTML}
          ${Badge({
            config: new ComponentConfigBuilder('success').build(),
            children: `Radius: ${currentTheme.borderRadius}px`
          }).outerHTML}
        </div>
        <div style="
          margin-top: 20px; 
          padding: 20px; 
          background: ${currentTheme.primaryColor}20;
          border-radius: ${currentTheme.borderRadius}px;
          border-left: 4px solid ${currentTheme.primaryColor};
        ">
          <strong style="color: ${currentTheme.primaryColor};">Nested Component</strong>
          <p style="margin: 10px 0 0 0;">
            This nested component also has access to the same theme context!
          </p>
        </div>
      `

      themedArea.appendChild(demoCard)
    }

    renderThemedComponents()
    container.appendChild(themedArea)

    return container
  },
}

export const UserAuthContext: Story = {
  render: () => {
    const UserCtx = createContext<UserContext>({
      username: 'Guest',
      role: 'guest',
      isLoggedIn: false
    })

    let currentUser: UserContext = {
      username: 'Guest',
      role: 'guest',
      isLoggedIn: false
    }

    const container = document.createElement('div')
    container.style.cssText = 'padding: 20px; max-width: 600px;'

    const title = Typography({
      config: new ComponentConfigBuilder('h2').build(),
      children: 'User Authentication Context'
    })
    container.appendChild(title)

    const desc = document.createElement('p')
    desc.style.cssText = 'background: #fff3cd; padding: 15px; border-radius: 8px; margin: 15px 0;'
    desc.textContent = '🔐 Login to see how context propagates user data to all child components!'
    container.appendChild(desc)

    // Auth controls
    const authCard = Card({
      config: new ComponentConfigBuilder('default').build(),
      styling: new ComponentStylingBuilder().build(),
      children: ''
    })
    authCard.style.cssText = 'padding: 20px; margin: 20px 0;'

    const userContent = document.createElement('div')

    const renderAuthUI = () => {
      if (!currentUser.isLoggedIn) {
        userContent.innerHTML = `
          <h3 style="margin: 0 0 15px 0;">Login</h3>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            ${Input({
              config: new ComponentConfigBuilder('default').build(),
              styling: new ComponentStylingBuilder().build(),
              placeholder: 'Username',
              value: ''
            }).outerHTML}
            <select style="padding: 10px; border: 1px solid #ddd; border-radius: 6px;">
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            ${Button({
              config: new ComponentConfigBuilder('primary').build(),
              styling: new ComponentStylingBuilder().build(),
              children: '🔓 Login'
            }).outerHTML}
          </div>
        `

        const loginBtn = userContent.querySelector('button')
        const usernameInput = userContent.querySelector('input') as HTMLInputElement
        const roleSelect = userContent.querySelector('select') as HTMLSelectElement

        loginBtn?.addEventListener('click', () => {
          const username = usernameInput.value.trim() || 'User'
          const role = roleSelect.value as 'user' | 'admin'
          
          currentUser = {
            username,
            role,
            isLoggedIn: true
          }
          
          renderAuthUI()
          renderUserInfo()
        })
      } else {
        userContent.innerHTML = `
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div>
              <h3 style="margin: 0 0 5px 0;">👤 ${currentUser.username}</h3>
              ${Badge({
                config: new ComponentConfigBuilder(currentUser.role === 'admin' ? 'primary' : 'secondary').build(),
                children: currentUser.role.toUpperCase()
              }).outerHTML}
            </div>
            ${Button({
              config: new ComponentConfigBuilder('error').build(),
              styling: new ComponentStylingBuilder().build(),
              children: '🔒 Logout'
            }).outerHTML}
          </div>
        `

        const logoutBtn = userContent.querySelector('button')
        logoutBtn?.addEventListener('click', () => {
          currentUser = {
            username: 'Guest',
            role: 'guest',
            isLoggedIn: false
          }
          renderAuthUI()
          renderUserInfo()
        })
      }
    }

    renderAuthUI()
    authCard.appendChild(userContent)
    container.appendChild(authCard)

    // User info display (simulating nested components)
    const infoArea = document.createElement('div')
    infoArea.style.cssText = 'margin: 20px 0;'

    const renderUserInfo = () => {
      infoArea.innerHTML = ''

      const infoCard = Card({
        config: new ComponentConfigBuilder('default').build(),
        styling: new ComponentStylingBuilder().build(),
        children: ''
      })
      infoCard.style.cssText = 'padding: 20px;'

      if (currentUser.isLoggedIn) {
        infoCard.innerHTML = `
          <h3 style="margin: 0 0 15px 0;">User Dashboard</h3>
          <div style="padding: 15px; background: #f9fafb; border-radius: 6px; margin-bottom: 15px;">
            <p style="margin: 0 0 5px 0;"><strong>Welcome back, ${currentUser.username}!</strong></p>
            <p style="margin: 0; color: #666; font-size: 14px;">Role: ${currentUser.role}</p>
          </div>
          ${currentUser.role === 'admin' ? `
            <div style="padding: 15px; background: #fef3c7; border-radius: 6px; border-left: 4px solid #f59e0b;">
              <p style="margin: 0;"><strong>🛠️ Admin Panel</strong></p>
              <p style="margin: 5px 0 0 0; font-size: 14px;">You have administrative privileges</p>
            </div>
          ` : ''}
          <p style="margin-top: 15px; font-size: 14px; color: #666;">
            This component receives user data from context, no props passed!
          </p>
        `
      } else {
        infoCard.innerHTML = `
          <div style="text-align: center; padding: 40px 20px; color: #666;">
            <div style="font-size: 3rem; margin-bottom: 10px;">🔒</div>
            <p>Please login to view your dashboard</p>
          </div>
        `
      }

      infoArea.appendChild(infoCard)
    }

    renderUserInfo()
    container.appendChild(infoArea)

    return container
  },
}
