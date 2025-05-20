import './App.css';
import React from 'react';

function App() {
  return (
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center'}}>
      <header style={{ background: '#282c34', padding: '2rem', color: 'white'}}>
        <h1> Welcome to my website</h1>
      </header>
      <main style={{padding: '2rem'}}>
        <p>This site showcases all my personal projects built and deployed.</p>
        <button onClick={() => alert('Hello!')}>
          Click Me
        </button>
      </main>
      <footer style={{ marginTop: '2rem', fontSize: '0.8rem'}}>
        © {new Date().getFullYear()} Tanishk Deoghare
      </footer>
    </div>
  )
}

export default App;
