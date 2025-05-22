import { useState } from "react";

export default function AuthPage({onAuth}) {
    const [mode, setMode] = useState('login');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [err, setErr] = useState('');

    const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    console.log('About to fetch', `${API}/api/login`);

    const handle = async e => {
        e.preventDefault();
        setErr('');
        const url = mode === 'login' ? '/api/login' : '/api/register';
        const res = await fetch (`${API}${url}`,{
            method : 'POST',
            headers : {'Content-Type': 'application/json'},
            body : JSON.stringify({username, password})
        });
        if (!res.ok) {
            const msg = (await res.json()).msg || 'Error';
            setErr(msg);
            return;
        }

        if (mode === 'signup') {
            setMode('login');
            setErr('Registered! Please log in.');
        } else {
            const {access_token} = await res.json();
            localStorage.setItem('token', access_token);
            onAuth(username);
        }
    };

    return (
        <div style={{
            maxWidth: 320, margin: '5rem auto', padding: '2rem',
            border: '1px solid #ccc' , borderRadius: 4
        }}>
            <h2>{mode === 'login' ? 'Log In' : 'Sign up'}</h2>
            <form onSubmit={handle}>
                <div style={{margin: '0.5rem 0'}}>
                    <input 
                        placeholder="username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                        style={{width: '100%', padding: '0.5rem'}}
                    />
                    <input 
                        placeholder="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        style={{width: '100%', padding: '0.5rem'}}
                    />
                    <button
                        type="button"
                        onClick={() => {
                            // this forces a full‐page load to your Flask endpoint
                            window.location.href = `${API}/login/google`;
                        }}
                    >Sign in with Google
                    </button>
                </div>
                {err && <div style= {{color: mode === 'signup' ? 'green' : 'red', marginBottom: 8}}>{err}</div>}
                <button type='submit' style={{width:'100%', padding:'0.5rem'}}>
                    {mode === 'login' ? 'Log In' : 'Sign Up'}
                </button>
            </form>
            <div style={{ textAlign: 'center', marginTop: '1rem'}}>
                {mode === 'login'
                    ? <>Need an account? <a href='#' onClick={() => {setMode('signup'); setErr('');}}>Sign Up</a></>
                    : <>Already registered? <a href='#' onClick={() => {setMode('login'); setErr('');}}>Log In</a></>
                }
            </div>
        </div>
    );
}