
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Board from './Components/Board/Board';
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
    </Routes>
   </Router>
   </RecoilRoot>
  )
}

export default App
