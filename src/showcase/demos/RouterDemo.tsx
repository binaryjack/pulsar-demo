/**
 * Router Demo
 */

import { useState } from "pulsar"

export const RouterDemo = () => {
    const [currentRoute, setCurrentRoute] = useState('home')

    const navigate = (route: string) => {
        setCurrentRoute(route)
        window.history.pushState({}, '', `#${route}`)
    }

    return (
        <div>
            <h2>🗺️ Router</h2>
            <p className="description">
                Client-side routing for single-page applications.
                (Basic demo - full router implementation in core)
            </p>

            <div className="demo-card">
                <h3>Navigation</h3>
                <div>
                    <a
                        href="#home"
                        className={`router-link ${currentRoute() === 'home' ? 'active' : ''}`}
                        onClick={(e) => {
                            e.preventDefault()
                            navigate('home')
                        }}
                    >
                        🏠 Home
                    </a>
                    <a
                        href="#about"
                        className={`router-link ${currentRoute() === 'about' ? 'active' : ''}`}
                        onClick={(e) => {
                            e.preventDefault()
                            navigate('about')
                        }}
                    >
                        ℹ️ About
                    </a>
                    <a
                        href="#contact"
                        className={`router-link ${currentRoute() === 'contact' ? 'active' : ''}`}
                        onClick={(e) => {
                            e.preventDefault()
                            navigate('contact')
                        }}
                    >
                        📧 Contact
                    </a>
                </div>
            </div>

            <div className="demo-card">
                <h3>Current Route</h3>
                
                {currentRoute() === 'home' && (
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; border-radius: 12px; box-shadow: 0 8px 16px rgba(0,0,0,0.2); animation: fadeIn 0.3s ease;">
                        <h3 style="font-size: 2.5rem; margin: 0 0 20px 0;">🏠 Home Page</h3>
                        <p style="font-size: 1.2rem; margin: 0;">Welcome to the pulsar Router demo!</p>
                        <p style="margin-top: 15px; opacity: 0.9;">Navigate using the buttons above to see smooth route transitions.</p>
                    </div>
                )}

                {currentRoute() === 'about' && (
                    <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 40px; border-radius: 12px; box-shadow: 0 8px 16px rgba(0,0,0,0.2); animation: fadeIn 0.3s ease;">
                        <h3 style="font-size: 2.5rem; margin: 0 0 20px 0;">ℹ️ About Page</h3>
                        <p style="font-size: 1.2rem; margin: 0;">Learn more about pulsar Framework.</p>
                        <p style="margin-top: 15px; opacity: 0.9;">A modern reactive framework with fine-grained reactivity!</p>
                    </div>
                )}

                {currentRoute() === 'contact' && (
                    <div style="background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%); color: white; padding: 40px; border-radius: 12px; box-shadow: 0 8px 16px rgba(0,0,0,0.2); animation: fadeIn 0.3s ease;">
                        <h3 style="font-size: 2.5rem; margin: 0 0 20px 0;">📧 Contact Page</h3>
                        <p style="font-size: 1.2rem; margin: 0;">Get in touch with us!</p>
                        <p style="margin-top: 15px; opacity: 0.9;">Email: hello@pulsar.dev</p>
                    </div>
                )}
            </div>

            <div className="demo-card">
                <h3>Code Example</h3>
                <pre>{`// Define routes
const routes = {
    '/': HomePage,
    '/about': AboutPage,
    '/contact': ContactPage,
}

// Router component
const Router = ({ routes }) => {
    const [currentPath, setCurrentPath] = useState('/')
    
    return routes[currentPath()] || NotFound
}

// Navigation
<a href="/about" onClick={(e) => {
    e.preventDefault()
    navigate('/about')
}}>
    About
</a>`}</pre>
            </div>
        </div>
    )
}
