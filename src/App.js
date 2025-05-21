import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import Sidebar from './components/Sidebar';
import Home from './pages/Home.js';
import BlackScholesPricer from './pages/BlackScholesPricer';
import MonteCarloPricer from './pages/MonteCarloPricer';
import BlackModelPricer from './pages/BlackModelPricer';
import BinomialPricer from './pages/BinomialPricer';
import TrinomialPricer from './pages/TrinomialPricer';
import { useState } from 'react';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? 'dark' : ''}>
    <BrowserRouter>
      <div className="app-container">
        <Sidebar/>
        <div className='main-content'>
          <header style={{ background: '#282c34', padding: '2rem', color:'white'}}>
            <h1>Welcome to my website</h1>
            <button onClick={() => setDarkMode(!darkMode)}
              style={{marginLeft: '60rem', padding: '0.5rem 1rem', cursor: 'pointer'}}>
                {darkMode ? 'Switch to Light' : 'Switch to Dark'}
              </button>
          </header>
          <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='bs-pricer' element={<BlackScholesPricer/>} />
            <Route path='mc-pricer' element={<MonteCarloPricer/>} />
            <Route path='black-pricer' element={<BlackModelPricer/>}/>
            <Route path='binomial-pricer' element={<BinomialPricer/>}/>
            <Route path='trinomial-pricer' element={<TrinomialPricer/>}/>
          </Routes>
        </div>
      </div>
    </BrowserRouter>
    </div>
  )
}

export default App;
