import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App'
import { SiteContentProvider } from './context/SiteContentContext'

import './styles/index.css'

ReactDOM.createRoot(
  document.getElementById('root')
).render(

  <React.StrictMode>

    <BrowserRouter
  basename={window.location.pathname.startsWith('/my-business-website') ? '/my-business-website' : '/'}
>
      <SiteContentProvider>

        <App />

      </SiteContentProvider>

    </BrowserRouter>

  </React.StrictMode>

)