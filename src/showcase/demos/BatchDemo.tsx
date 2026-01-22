/**
 * Batch Updates Demo
 */

import { useState } from "pulsar"
import { batch } from "pulsar"

export const BatchDemo = () => {
    const [count1, setCount1] = useState(0)
    const [count2, setCount2] = useState(0)
    const [count3, setCount3] = useState(0)
    const [renderCount, setRenderCount] = useState(0)

    // Track renders
    setRenderCount(renderCount() + 1)

    const updateWithoutBatch = () => {
        setCount1(count1() + 1) // Triggers render
        setCount2(count2() + 1) // Triggers render  
        setCount3(count3() + 1) // Triggers render
        // Total: 3 renders!
    }

    const updateWithBatch = () => {
        batch(() => {
            setCount1(count1() + 1)
            setCount2(count2() + 1)
            setCount3(count3() + 1)
        })
        // Total: 1 render!
    }

    return (
        <div>
            <h2>📦 Batch Updates</h2>
            <p className="description">
                Batch multiple state updates into a single render cycle for better performance.
            </p>

            <div className="demo-card" style={`background: ${renderCount() > 10 ? 'linear-gradient(135deg, #dc3545 0%, #ffc107 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}; color: white; padding: 30px; border-radius: 12px; box-shadow: 0 8px 16px rgba(0,0,0,0.2);`}>
                <h3 style="margin: 0; font-size: 1.2rem;">Render Counter</h3>
                <div style="font-size: 5rem; font-weight: bold; text-align: center; margin: 20px 0; text-shadow: 3px 3px 6px rgba(0,0,0,0.3);">
                    {renderCount()}
                </div>
                <p style="text-align: center; font-size: 1.2rem; margin: 0;">
                    {renderCount() > 10 ? '🔥 Many renders! Try batch()' : '✨ Total component renders'}
                </p>
            </div>

            <div className="grid">
                <div className="card" style="background: linear-gradient(135deg, #667eea 0%, #4c63d2 100%); color: white; transform: scale(1.05); transition: transform 0.3s;">
                    <h4 style="margin: 0 0 10px 0;">Counter 1</h4>
                    <div style="font-size: 3.5rem; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
                        {count1()}
                    </div>
                </div>
                <div className="card" style="background: linear-gradient(135deg, #764ba2 0%, #5a3a7d 100%); color: white; transform: scale(1.05); transition: transform 0.3s;">
                    <h4 style="margin: 0 0 10px 0;">Counter 2</h4>
                    <div style="font-size: 3.5rem; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
                        {count2()}
                    </div>
                </div>
                <div className="card" style="background: linear-gradient(135deg, #28a745 0%, #218838 100%); color: white; transform: scale(1.05); transition: transform 0.3s;">
                    <h4 style="margin: 0 0 10px 0;">Counter 3</h4>
                    <div style="font-size: 3.5rem; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
                        {count3()}
                    </div>
                </div>
            </div>

            <div className="demo-card">
                <h3>Performance Comparison</h3>
                <p>Watch the render counter above!</p>

                <button onClick={updateWithoutBatch}>
                    ❌ Update Without Batch (3 renders)
                </button>
                <button onClick={updateWithBatch}>
                    ✅ Update With Batch (1 render)
                </button>
            </div>

            <div className="demo-card">
                <h3>Code Example</h3>
                <pre>{`// Without batching - 3 renders
const updateWithoutBatch = () => {
    setCount1(count1() + 1) // Render 1
    setCount2(count2() + 1) // Render 2
    setCount3(count3() + 1) // Render 3
}

// With batching - 1 render
const updateWithBatch = () => {
    batch(() => {
        setCount1(count1() + 1)
        setCount2(count2() + 1)
        setCount3(count3() + 1)
    }) // Single render after all updates
}`}</pre>
            </div>
        </div>
    )
}
