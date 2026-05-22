import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom'

import App from './App'
import HallOfFame from './pages/HallOfFame'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />

        <Route
          path="/halloffame"
          element={<HallOfFame />}
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)