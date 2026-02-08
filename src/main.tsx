import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './theme/tokens.css'
import './theme/light.css'
import './theme/dark.css'
import './theme/enrollment-dark.css'
import './index.css'
import { router } from './app/router.tsx'
import { ThemeProvider } from './context/ThemeContext'

// Initialize theme from localStorage before first paint (avoids flash)
const savedTheme = localStorage.getItem('theme')
const isDark = savedTheme === 'dark'
document.documentElement.classList.remove('light', 'dark')
document.documentElement.classList.add(isDark ? 'dark' : 'light')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
)
