/**
 * Portal Demo - Render outside parent DOM
 */

import { Show } from "pulsar"
import { useState } from "pulsar"
import { Portal } from "pulsar"

export const PortalDemo = () => {
    const [showModal, setShowModal] = useState(false)
    const [showTooltip, setShowTooltip] = useState(false)

    return (
        <div>
            <h2>🌀 Portals</h2>
            <p className="description">
                Render components outside the parent DOM hierarchy.
                Perfect for modals, tooltips, and overlays.
            </p>

            <div className="demo-card">
                <h3>Modal Portal</h3>
                <p>Render a modal in a different DOM node (#modal-root).</p>

                <button onClick={() => setShowModal(true)}>
                    🚀 Open Modal
                </button>

                <Show when={showModal()}>
                    <Portal mount="#modal-root">
                        {() => {
                            const overlay = document.createElement('div')
                            overlay.className = 'portal-overlay'
                            overlay.onclick = () => setShowModal(false)
                            
                            const content = document.createElement('div')
                            content.className = 'portal-target'
                            content.innerHTML = `
                                <h3>🎉 Portal Modal</h3>
                                <p>This content is rendered outside the main DOM tree!</p>
                                <p>Check the HTML inspector - it's in #modal-root</p>
                            `
                            const btn = document.createElement('button')
                            btn.textContent = '✖️ Close'
                            btn.onclick = () => setShowModal(false)
                            content.appendChild(btn)
                            
                            overlay.appendChild(content)
                            return overlay
                        }}
                    </Portal>
                </Show>
            </div>

            <div className="demo-card">
                <h3>Tooltip Portal</h3>
                <p>Another portal example with different styling.</p>

                <button
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                >
                    Hover for Tooltip
                </button>

                <Show when={showTooltip()}>
                    <Portal mount="body">
                        <div style="position: fixed; top: 20px; right: 20px; background: #667eea; color: white; padding: 15px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); z-index: 9999;">
                            💡 This is a tooltip rendered via Portal!
                        </div>
                    </Portal>
                </Show>
            </div>

            <div className="demo-card">
                <h3>Code Example</h3>
                <pre>{`// Render modal in a different container
<Portal mount="#modal-root">
    <div className="modal-overlay">
        <div className="modal">
            <h2>Modal Title</h2>
            <p>Modal content here...</p>
            <button onClick={close}>Close</button>
        </div>
    </div>
</Portal>

// Render to body
<Portal mount="body">
    <div className="tooltip">
        Tooltip content
    </div>
</Portal>`}</pre>
            </div>
        </div>
    )
}
