import React from 'react'
import ReactDOM from 'react-dom/client'
import {MainComponent as App} from './MainComponent.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
