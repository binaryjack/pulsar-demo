import { Button, Card, ComponentConfigBuilder, ComponentStylingBuilder, Input, Typography } from '@atomos/prime'
import type { Meta, StoryObj } from '@storybook/html'

const meta: Meta = {
  title: 'Pulsar Features/Portals',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## Portal System

Portals allow rendering content outside the normal component hierarchy:
- **Modal dialogs**: Render above all other content
- **Tooltips**: Positioned anywhere on the page
- **Notifications**: Toast messages outside parent containers
- **Flexible positioning**: Break free from parent z-index and overflow
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj

export const ModalDialog: Story = {
  render: () => {
    let isModalOpen = false

    const container = document.createElement('div')
    container.style.cssText = 'padding: 20px; max-width: 600px;'

    const title = Typography({
      config: new ComponentConfigBuilder('h2').build(),
      children: 'Modal Portal Demo'
    })
    container.appendChild(title)

    const desc = document.createElement('p')
    desc.style.cssText = 'background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;'
    desc.textContent = '🚪 Click the button to open a modal. The modal is rendered via Portal outside the normal DOM hierarchy!'
    container.appendChild(desc)

    const contentCard = Card({
      config: new ComponentConfigBuilder('default').build(),
      styling: new ComponentStylingBuilder().build(),
      children: ''
    })
    contentCard.style.cssText = 'padding: 30px; margin: 20px 0; overflow: hidden; position: relative;'

    const cardContent = document.createElement('div')
    cardContent.innerHTML = `
      <h3 style="margin: 0 0 15px 0;">Parent Container</h3>
      <p style="color: #666; margin-bottom: 20px;">
        This container has <code>overflow: hidden</code>, but the modal will still appear on top!
      </p>
    `

    const openModalBtn = Button({
      config: new ComponentConfigBuilder('primary').build(),
      styling: new ComponentStylingBuilder().build(),
      children: '🚪 Open Modal',
      onclick: () => {
        isModalOpen = true
        renderModal()
      }
    })
    cardContent.appendChild(openModalBtn)
    contentCard.appendChild(cardContent)
    container.appendChild(contentCard)

    // Modal container (will be portal target)
    const modalContainer = document.createElement('div')
    modalContainer.id = 'modal-portal'

    const renderModal = () => {
      if (!isModalOpen) {
        modalContainer.innerHTML = ''
        return
      }

      // Create modal backdrop
      const backdrop = document.createElement('div')
      backdrop.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        animation: fadeIn 0.2s ease-out;
      `

      // Add fade-in animation
      const style = document.createElement('style')
      style.textContent = `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `
      document.head.appendChild(style)

      const modalCard = Card({
        config: new ComponentConfigBuilder('default').build(),
        styling: new ComponentStylingBuilder().build(),
        children: ''
      })
      modalCard.style.cssText = `
        max-width: 500px;
        width: 90%;
        padding: 30px;
        animation: slideUp 0.3s ease-out;
      `

      modalCard.innerHTML = `
        <h2 style="margin: 0 0 20px 0;">Modal Dialog</h2>
        <p style="margin: 15px 0; color: #666;">
          This modal is rendered using a Portal. It appears above everything else,
          even though its parent container has overflow: hidden!
        </p>
        <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669;">
          <strong style="color: #059669;">Portal Benefit:</strong>
          <p style="margin: 5px 0 0 0; font-size: 14px;">
            Portals solve z-index and overflow issues by rendering content at a different DOM location.
          </p>
        </div>
        ${Input({
          config: new ComponentConfigBuilder('default').build(),
          styling: new ComponentStylingBuilder().build(),
          placeholder: 'You can interact with modal content',
          value: ''
        }).outerHTML}
      `

      const closeBtn = Button({
        config: new ComponentConfigBuilder('error').build(),
        styling: new ComponentStylingBuilder().build(),
        children: '✕ Close',
        onclick: () => {
          isModalOpen = false
          renderModal()
        }
      })
      closeBtn.style.marginTop = '20px'
      modalCard.appendChild(closeBtn)

      backdrop.appendChild(modalCard)

      // Close on backdrop click
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          isModalOpen = false
          renderModal()
        }
      })

      modalContainer.innerHTML = ''
      modalContainer.appendChild(backdrop)
    }

    document.body.appendChild(modalContainer)

    return container
  },
}

export const ToastNotifications: Story = {
  render: () => {
    const container = document.createElement('div')
    container.style.cssText = 'padding: 20px; max-width: 600px;'

    const title = Typography({
      config: new ComponentConfigBuilder('h2').build(),
      children: 'Toast Notifications Portal'
    })
    container.appendChild(title)

    const desc = document.createElement('p')
    desc.style.cssText = 'background: #fff3cd; padding: 15px; border-radius: 8px; margin: 15px 0;'
    desc.textContent = '📢 Click buttons to show different toast notifications. They appear in a fixed position via Portal!'
    container.appendChild(desc)

    // Toast container
    const toastContainer = document.createElement('div')
    toastContainer.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      gap: 10px;
      min-width: 300px;
    `
    document.body.appendChild(toastContainer)

    const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
      const colors = {
        success: { bg: '#f0fdf4', border: '#059669', text: '#059669', icon: '✓' },
        error: { bg: '#fef2f2', border: '#dc2626', text: '#dc2626', icon: '✕' },
        info: { bg: '#eff6ff', border: '#3b82f6', text: '#3b82f6', icon: 'ℹ' },
        warning: { bg: '#fffbeb', border: '#f59e0b', text: '#f59e0b', icon: '⚠' }
      }

      const toast = document.createElement('div')
      toast.style.cssText = `
        background: ${colors[type].bg};
        border: 2px solid ${colors[type].border};
        border-radius: 8px;
        padding: 15px;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideInRight 0.3s ease-out;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      `

      const style = document.createElement('style')
      style.textContent = `
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
      `
      document.head.appendChild(style)

      toast.innerHTML = `
        <div style="
          width: 24px;
          height: 24px;
          background: ${colors[type].border};
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        ">
          ${colors[type].icon}
        </div>
        <span style="flex: 1; color: ${colors[type].text}; font-weight: 500;">
          ${message}
        </span>
      `

      toastContainer.appendChild(toast)

      // Auto-dismiss after 3 seconds
      setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-out'
        setTimeout(() => toast.remove(), 300)
      }, 3000)
    }

    const btnContainer = document.createElement('div')
    btnContainer.style.cssText = 'display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin: 20px 0;'

    const toastTypes: Array<{ type: 'success' | 'error' | 'info' | 'warning'; label: string; message: string }> = [
      { type: 'success', label: '✓ Success', message: 'Operation completed successfully!' },
      { type: 'error', label: '✕ Error', message: 'Something went wrong!' },
      { type: 'info', label: 'ℹ Info', message: 'Here is some information for you' },
      { type: 'warning', label: '⚠ Warning', message: 'Please be careful!' }
    ]

    toastTypes.forEach(({ type, label, message }) => {
      const btn = Button({
        config: new ComponentConfigBuilder(type === 'success' ? 'success' : type === 'error' ? 'error' : type === 'warning' ? 'warning' : 'primary').build(),
        styling: new ComponentStylingBuilder().build(),
        children: label,
        onclick: () => showToast(message, type)
      })
      btnContainer.appendChild(btn)
    })

    container.appendChild(btnContainer)

    const note = Card({
      config: new ComponentConfigBuilder('default').build(),
      styling: new ComponentStylingBuilder().build(),
      children: ''
    })
    note.style.cssText = 'padding: 20px; margin: 20px 0;'
    note.innerHTML = `
      <h4 style="margin: 0 0 10px 0;">How Portals Work</h4>
      <ul style="margin: 0; padding-left: 20px; color: #666;">
        <li>Toasts are rendered in a fixed container outside this component</li>
        <li>They won't be affected by parent overflow or positioning</li>
        <li>Perfect for modals, notifications, and tooltips</li>
        <li>Maintains proper stacking context and z-index</li>
      </ul>
    `
    container.appendChild(note)

    return container
  },
}
