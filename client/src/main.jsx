import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// ❌ Make sure you do NOT have BrowserRouter here
// import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />  {/* No BrowserRouter wrapping here */}
  </StrictMode>,
)