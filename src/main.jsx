
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom'

import App from './App'
import PlayerGallery from './pages/PlayerGallery'
import HallOfFame from './pages/HallOfFame'
import Scoreboard from './pages/Scoreboard'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/gallery" element={<PlayerGallery />} />
        <Route path="/halloffame" element={<HallOfFame />} />
        <Route path="/scoreboard" element={<Scoreboard />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)