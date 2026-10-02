import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './lib/AuthContext'
import Home from './pages/Home'
import BuildCombo from './pages/BuildCombo'
import ViewCombo from './pages/ViewCombo'
import Account from './pages/Account'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/build-combo" element={<BuildCombo />} />
        <Route path="/combo/:code" element={<ViewCombo />} />
        <Route path="/account" element={<Account />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
