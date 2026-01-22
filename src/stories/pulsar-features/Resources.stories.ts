import { Badge, Button, Card, ComponentConfigBuilder, ComponentStylingBuilder, Spinner, Typography } from '@atomos/prime'
import type { Meta, StoryObj } from '@storybook/html'
import { createResource } from 'pulsar/resource'

const meta: Meta = {
  title: 'Pulsar Features/Resources & Async',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## Async Resource Management

Pulsar provides powerful async data fetching with:
- **createResource**: Single async resource with loading/error states
- **createTrackedResource**: Track multiple resources together
- **Automatic caching**: Deduplication and memoization
- **Reactive updates**: UI updates automatically when data loads
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj

// Mock API functions
const fetchUser = (id: number) => 
  new Promise<{ id: number; name: string; email: string }>(resolve => 
    setTimeout(() => resolve({
      id,
      name: `User ${id}`,
      email: `user${id}@example.com`
    }), 1000)
  )

const fetchPosts = (userId: number) =>
  new Promise<Array<{ id: number; title: string }>>(resolve =>
    setTimeout(() => resolve([
      { id: 1, title: 'First Post' },
      { id: 2, title: 'Second Post' },
      { id: 3, title: 'Learning Pulsar' }
    ]), 1500)
  )

export const BasicResourceFetching: Story = {
  render: () => {
    let currentUserId = 1
    const user = createResource(() => fetchUser(currentUserId))

    const container = document.createElement('div')
    container.style.cssText = 'padding: 20px; max-width: 600px;'

    const title = Typography({
      config: new ComponentConfigBuilder('h2').build(),
      children: 'User Profile Loader'
    })
    container.appendChild(title)

    const desc = document.createElement('p')
    desc.style.cssText = 'background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;'
    desc.textContent = '🔄 Click buttons to fetch different users. Notice the automatic loading states!'
    container.appendChild(desc)

    // User selector
    const selectorContainer = document.createElement('div')
    selectorContainer.style.cssText = 'display: flex; gap: 10px; margin: 20px 0;'

    for (let i = 1; i <= 5; i++) {
      const btn = Button({
        config: new ComponentConfigBuilder(i === currentUserId ? 'primary' : 'secondary').build(),
        styling: new ComponentStylingBuilder().build(),
        children: `User ${i}`,
        onclick: () => {
          currentUserId = i
          user.refetch()
          // Update button styles
          selectorContainer.querySelectorAll('button').forEach((b, idx) => {
            b.className = b.className.replace(/bg-\w+-\d+/g, '')
            b.classList.add(idx + 1 === i ? 'bg-primary-600' : 'bg-secondary-600')
          })
        }
      })
      selectorContainer.appendChild(btn)
    }
    container.appendChild(selectorContainer)

    // Content card
    const contentCard = Card({
      config: new ComponentConfigBuilder('default').build(),
      styling: new ComponentStylingBuilder().build(),
      children: ''
    })
    contentCard.style.cssText = 'padding: 30px; margin: 20px 0; min-height: 200px;'

    const updateContent = () => {
      if (user.isLoading) {
        contentCard.innerHTML = `
          <div style="display: flex; flex-direction: column; align-items: center; gap: 20px;">
            ${Spinner({ config: new ComponentConfigBuilder('primary').build() }).outerHTML}
            <p style="color: #666;">Loading user data...</p>
          </div>
        `
      } else if (user.error) {
        contentCard.innerHTML = `
          <div style="text-align: center; color: #dc2626;">
            <div style="font-size: 3rem; margin-bottom: 10px;">⚠️</div>
            <p><strong>Error:</strong> ${user.error.message}</p>
          </div>
        `
      } else if (user.data) {
        contentCard.innerHTML = `
          <div style="text-align: center;">
            <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;
                        color: white; font-size: 2rem; font-weight: bold;">
              ${user.data.name.charAt(0)}
            </div>
            <h3 style="margin: 10px 0; font-size: 1.5rem;">${user.data.name}</h3>
            <p style="color: #666; margin: 5px 0;">${user.data.email}</p>
            <div style="margin-top: 20px;">
              ${Badge({ 
                config: new ComponentConfigBuilder('success').build(),
                children: `User ID: ${user.data.id}` 
              }).outerHTML}
            </div>
          </div>
        `
      }
    }

    // Subscribe to resource changes
    const checkInterval = setInterval(() => {
      updateContent()
    }, 100)

    setTimeout(() => clearInterval(checkInterval), 60000) // Clean up after 1 minute

    updateContent()
    container.appendChild(contentCard)

    return container
  },
}

export const ParallelResourceLoading: Story = {
  render: () => {
    const userId = 1
    const userResource = createResource(() => fetchUser(userId))
    const postsResource = createResource(() => fetchPosts(userId))

    const container = document.createElement('div')
    container.style.cssText = 'padding: 20px; max-width: 800px;'

    const title = Typography({
      config: new ComponentConfigBuilder('h2').build(),
      children: 'Parallel Data Loading'
    })
    container.appendChild(title)

    const desc = document.createElement('p')
    desc.style.cssText = 'background: #fff3cd; padding: 15px; border-radius: 8px; margin: 15px 0;'
    desc.textContent = '⚡ Loading user profile and posts in parallel. Watch both resources load independently!'
    container.appendChild(desc)

    // Status indicators
    const statusContainer = document.createElement('div')
    statusContainer.style.cssText = 'display: flex; gap: 10px; margin: 20px 0;'

    const userStatus = Badge({
      config: new ComponentConfigBuilder('warning').build(),
      children: 'User: Loading...'
    })
    const postsStatus = Badge({
      config: new ComponentConfigBuilder('warning').build(),
      children: 'Posts: Loading...'
    })

    statusContainer.appendChild(userStatus)
    statusContainer.appendChild(postsStatus)
    container.appendChild(statusContainer)

    // User card
    const userCard = Card({
      config: new ComponentConfigBuilder('default').build(),
      styling: new ComponentStylingBuilder().build(),
      children: ''
    })
    userCard.style.cssText = 'padding: 20px; margin: 20px 0;'

    // Posts card
    const postsCard = Card({
      config: new ComponentConfigBuilder('default').build(),
      styling: new ComponentStylingBuilder().build(),
      children: ''
    })
    postsCard.style.cssText = 'padding: 20px; margin: 20px 0;'

    const updateUI = () => {
      // Update user card
      if (userResource.isLoading) {
        userCard.innerHTML = `
          <div style="display: flex; align-items: center; gap: 15px;">
            ${Spinner({ config: new ComponentConfigBuilder('primary').build() }).outerHTML}
            <span>Loading user...</span>
          </div>
        `
        userStatus.textContent = 'User: Loading...'
        userStatus.className = userStatus.className.replace(/bg-\w+-\d+/g, 'bg-warning-600')
      } else if (userResource.data) {
        userCard.innerHTML = `
          <div>
            <h3 style="margin: 0 0 10px 0;">👤 ${userResource.data.name}</h3>
            <p style="color: #666; margin: 0;">${userResource.data.email}</p>
          </div>
        `
        userStatus.textContent = 'User: ✓ Loaded'
        userStatus.className = userStatus.className.replace(/bg-\w+-\d+/g, 'bg-success-600')
      }

      // Update posts card
      if (postsResource.isLoading) {
        postsCard.innerHTML = `
          <div style="display: flex; align-items: center; gap: 15px;">
            ${Spinner({ config: new ComponentConfigBuilder('primary').build() }).outerHTML}
            <span>Loading posts...</span>
          </div>
        `
        postsStatus.textContent = 'Posts: Loading...'
        postsStatus.className = postsStatus.className.replace(/bg-\w+-\d+/g, 'bg-warning-600')
      } else if (postsResource.data) {
        postsCard.innerHTML = `
          <h3 style="margin: 0 0 15px 0;">📝 Recent Posts</h3>
          ${postsResource.data.map((post: { id: number; title: string }) => `
            <div style="padding: 10px; margin: 5px 0; background: #f9fafb; border-radius: 6px;">
              ${post.title}
            </div>
          `).join('')}
        `
        postsStatus.textContent = 'Posts: ✓ Loaded'
        postsStatus.className = postsStatus.className.replace(/bg-\w+-\d+/g, 'bg-success-600')
      }
    }

    const checkInterval = setInterval(updateUI, 100)
    setTimeout(() => clearInterval(checkInterval), 60000)

    updateUI()
    container.appendChild(userCard)
    container.appendChild(postsCard)

    return container
  },
}
