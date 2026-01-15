import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from "./Main/Main";
import HomePage from './HomePage/HomePage';
import Register from './Register/Register';
import Login from './Login/Login';
import Admin from './Admin/Admin';

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<Main />}/>
            <Route path='/homepage' element={<HomePage />}/>
            <Route path='/register' element={<Register />}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/admin' element={<Admin />}/>
        </Routes>
    </BrowserRouter>
  );
}

export default App;
