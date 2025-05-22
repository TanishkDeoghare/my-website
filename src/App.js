import './App.css';
import { useEffect, useState } from 'react';
import AuthPage from './pages/Authpage.js';
import MainApp from './MainApp.js';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const h = window.location.hash;
    if  (h.startsWith('#token=')){
      const token = h.replace('#token=','');
      localStorage.setItem('token', token);
      window.history.replaceState(null, '', window.location.pathname);
    }
    const token = localStorage.getItem('token');
    if (token) {
      setUser(true);
    }
  }, []);

  const handleAuth = () => {
    setUser(true);
  };

  return user
    ? <MainApp/>
    : <AuthPage onAuth={handleAuth}/>;
}

export default App;