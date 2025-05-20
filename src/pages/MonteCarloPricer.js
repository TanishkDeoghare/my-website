import { useState } from 'react';

export default function MonteCarloPricer() {
    const [inputs, setInputs] = useState({
        S: '', K: '', T: '', r: '', sigma: '', paths: '10000', optionType: 'call'
    });
    const [price, setPrice] = useState(null);

    const handleChange = e =>
        setInputs({ ...inputs, [e.target.name]: e.target.value});

    const handleSubmit = async e => {
        e.preventDefault();
        const res = await fetch('/api/mc-price', {
            method : 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(inputs),
        });

        if (!res.ok){
            const errText = await res.text();
            console.error('Server Error:', errText);
            return;
        }
        const data = await res.json();
        setPrice(data.price);
    };

    return (
        <div style={{padding: '2rem'}}>
            <h2>Monte Carlo Option pricer</h2>
            <form onSubmit={handleSubmit}>
                {['S','K','T','r','sigma','paths'].map(name =>(
                    <div key={name}>
                        <label>{name}:</label>
                        <input
                            type='number'
                            step="any"
                            name={name}
                            value={inputs[name]}
                            onChange={handleChange}
                            required>
                        </input>
                    </div>
                ))}
                <div>
                    <label>Type: </label>
                    <select 
                        name='optionType'
                        onChange={handleChange}
                        value={inputs.optionType}
                    >
                        <option value="call">Call</option>
                        <option value="put">Put</option>
                    </select>
                </div>
                <button type='submit'>Run Simulation</button>
            </form>
            {price !== null && (
                <p>Estimate price: <strong>{price.toFixed(4)}</strong></p>
            )}
        </div>
    );
}