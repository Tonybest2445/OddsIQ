import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './lib/AuthContext'
import Home from './pages/Home'
import BuildCombo from './pages/BuildCombo'
import ViewCombo from './pages/ViewCombo'
import Account from './pages/Account'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/build-combo" element={<BuildCombo />} />
        <Route path="/combo/:code" element={<ViewCombo />} />
        <Route path="/account" element={<Account />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
