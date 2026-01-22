/**
 * Resource Demo - Async data loading
 */

import { Show } from "pulsar"
import { useState } from "pulsar"
import { createResource } from "pulsar"

// Simulated API calls
const fetchUser = async (id: number): Promise<{ id: number; name: string; email: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1500))
    if (id === 666) throw new Error('User not found')
    return {
        id,
        name: `User ${id}`,
        email: `user${id}@pulsar.dev`
    }
}

const fetchPosts = async (userId: number): Promise<Array<{ id: number; title: string }>> => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return [
        { id: 1, title: `Post 1 by User ${userId}` },
        { id: 2, title: `Post 2 by User ${userId}` },
        { id: 3, title: `Post 3 by User ${userId}` },
    ]
}

export const ResourceDemo = () => {
    const [userId, setUserId] = useState(1)
    
    const user = createResource(
        () => fetchUser(userId())
    )

    const posts = createResource(
        () => user.data ? fetchPosts(user.data.id) : Promise.resolve([])
    )

    return (
        <div>
            <h2>📡 Resources - Async Data</h2>
            <p className="description">
                Declarative async data loading with automatic loading/error states.
            </p>

            <div className="demo-card">
                <h3>User Resource</h3>
                <p>Load user data asynchronously with automatic state management.</p>

                <div>
                    <input
                        type="number"
                        value={userId()}
                        onInput={(e) => setUserId(Number(e.currentTarget.value))}
                        min="1"
                        max="999"
                    />
                    <button onClick={() => user.refetch()}>🔄 Refetch</button>
                    <button onClick={() => setUserId(666)}>💣 Trigger Error</button>
                </div>

                <div>
                    <Show
                        when={!user.isLoading}
                        fallback={<div className="loading">Loading user data</div>}
                    >
                        <Show
                            when={!user.isError}
                            fallback={
                                <div className="error-display">
                                    ❌ Error: {user.error?.message}
                                </div>
                            }
                        >
                            <Show when={!!user.data}>
                                <div className="success-display">
                                    <h4>👤 {user.data?.name}</h4>
                                    <p>📧 {user.data?.email}</p>
                                    <p>🆔 ID: {user.data?.id}</p>
                                </div>
                            </Show>
                        </Show>
                    </Show>
                </div>
            </div>

            <div className="demo-card">
                <h3>Dependent Resource</h3>
                <p>Posts resource depends on user resource.</p>

                <Show
                    when={!posts.isLoading}
                    fallback={<div className="loading">Loading posts</div>}
                >
                    <Show when={!!posts.data}>
                        <div>
                            {posts.data?.map((post: { id: number; title: string }) => (
                                <div key={post.id} className="card">
                                    <strong>📝 {post.title}</strong>
                                </div>
                            ))}
                        </div>
                    </Show>
                </Show>
            </div>

            <div className="demo-card">
                <h3>Code Example</h3>
                <pre>{`// Create a resource
const [user, { refetch, mutate }] = createResource(
    userId,  // Source signal
    async (id) => {
        const response = await fetch(\`/api/users/\${id}\`)
        return response.json()
    }
)

// Dependent resource
const [posts] = createResource(
    () => user()?.id,  // Depends on user
    fetchPosts
)

// Use in JSX
<Show 
    when={!user.loading}
    fallback={<div>Loading...</div>}
>
    <div>{user()?.name}</div>
</Show>`}</pre>
            </div>
        </div>
    )
}
