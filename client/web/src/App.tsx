import { Outlet } from '@tanstack/react-router'
import './App.css'

function App() {
  return (
    <main className="page-shell">
      <Outlet />
    </main>
  )
}

export default App
