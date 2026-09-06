import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import BuildCombo from './pages/BuildCombo'
import ViewCombo from './pages/ViewCombo'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/build-combo" element={<BuildCombo />} />
      <Route path="/combo/:code" element={<ViewCombo />} />
    </Routes>
  )
}

export default App
