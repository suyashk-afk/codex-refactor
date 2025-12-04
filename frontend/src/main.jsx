import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css' // Tailwind utilities
import './codex.css' // Original beautiful CSS (takes precedence)
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
