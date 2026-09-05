import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <main style={{ padding: '2rem', textAlign: 'center' }}>
            <h1>OddsIQ</h1>
            <p>AI-graded football & basketball picks. Coming soon.</p>
          </main>
        }
      />
    </Routes>
  )
}

export default App
