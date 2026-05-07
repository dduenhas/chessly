import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { A11yProvider } from './hooks/useA11y'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <A11yProvider>
        <App />
      </A11yProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
