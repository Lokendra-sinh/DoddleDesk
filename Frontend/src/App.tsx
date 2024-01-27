import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Board from './Components/Board/Board';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import { RecoilRoot } from 'recoil';


function App() {
 

  return (
    <RecoilRoot>
   <Router>
    <Routes>
      
     <Route path="/" element={
      <div className='w-screen min-h-screen relative'>
        <Board />
      </div>
     } />
     <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
   </Router>
   </RecoilRoot>
  )
}

export default App
