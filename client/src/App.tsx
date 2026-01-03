import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useQuery } from '@tanstack/react-query'
import { api } from './treaty'

interface User {
  id: number
  name: string
  email: string
  age: number
}

function App() {
  const [count, setCount] = useState(0)

  // Fetch users with TanStack Query
  const { data: users, isLoading, error, refetch } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await api.user.get();
      return res.data?.users || []
    },
    retry: 3,
    staleTime: 5 * 60 * 1000  // 5min cache
  })

  if (isLoading) return <div className="loading">Loading users...</div>
  if (error) return (
    <div className="error">
      Error: {(error as Error).message}
      <button onClick={() => refetch()}>Retry</button>
    </div>
  )

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React + Elysia</h1>

      {/* Users Table */}
      <div className="card">
        <h2>Users ({users?.length || 0})</h2>
        <div className="users-grid">
          {users?.map(user => (
            <div key={user.id} className="user-card">
              <h3>{user.name}</h3>
              <p>{user.email}</p>
              <p>Age: {user.age}</p>
            </div>
          ))}
        </div>
        <button onClick={() => refetch()}>Refresh Users</button>
      </div>

      {/* Original Counter */}
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        API: <a href="http://localhost:8080/user" target="_blank">/user</a>
      </p>
    </>
  )
}

export default App
