import './App.css';
import { useEffect, useState } from 'react';
import AuthPage from './pages/Authpage.js';
import MainApp from './MainApp.js';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
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
