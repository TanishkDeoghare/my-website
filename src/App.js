import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import Sidebar from './components/Sidebar';
import Home from './pages/Home.js';
import BlackScholesPricer from './pages/BlackScholesPricer';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Sidebar/>
        <div className='main-content'>
          <header style={{ background: '#282c34', padding: '2rem', color:'white'}}>
            <h1>Welcome to my website</h1>
          </header>
          <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='bs-pricer' element={<BlackScholesPricer/>} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App;
