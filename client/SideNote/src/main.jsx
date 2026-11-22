import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Signup from './routes/Signup'
import Login from './routes/Login'
import MainBody from './routes/MainBody'


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<Signup />}/>
      <Route path='/signin' element={<Login />}/>
      <Route path='/sidenote' element={<MainBody />}/>
    </Routes>
  </BrowserRouter>
  ,
)
