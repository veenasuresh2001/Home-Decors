import './App.css'
import Homepage from './components/home'
import Loginpage from './components/login'
import { Route,Routes } from 'react-router-dom'
import Registration from './components/register'
import Userhome from './components/userhome'
import Adminhome from './components/adminhome'

function App() {
  
  return (
    <>
      
      
        <Routes>
        <Route path='/' element={<Homepage/>}></Route>
        <Route path='/userlogin' element={<Loginpage/>}></Route>
        <Route path='/register' element={<Registration/>}></Route>
        <Route path='/adminhome/*' element={<Adminhome/>}></Route>
        <Route path='/userhome/*' element={<Userhome/>}></Route>
        </Routes>
        
      
      
    </>
  )
}

export default App
