import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { SettingsGate } from './lib/settings'
import './public.css'
import './admin.css'
createRoot(document.getElementById('root')!).render(<React.StrictMode><BrowserRouter><SettingsGate><App /></SettingsGate></BrowserRouter></React.StrictMode>)
