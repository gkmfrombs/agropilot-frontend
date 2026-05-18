import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// i18n must be imported before App so the instance is ready before any
// component that calls useTranslation() is mounted
import './i18n'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
