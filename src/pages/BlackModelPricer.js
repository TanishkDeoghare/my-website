import { useState } from 'react';

export default function BlackModelPricer() {
    const [inputs, setInputs] = useState({
        F: '',
        K: '',
        T: '',
        r: '',
        sigma: '',
        optionType: 'call'
    });
    const [price, setPrice] = useState(null);

    const handleChange = e =>
        setInputs({ ...inputs, [e.target.name]: e.target.value});

    const handleSubmit = async e => {
        e.preventDefault();
        const res = await fetch('http://localhost:5000/api/black-price',{
            method : 'POST',
            headers : {'Content-Type': 'application/json'},
            body : JSON.stringify(inputs),
        });
        const data = await res.json();
        setPrice(data.price);
    };

    return (
        <div style={{padding: '2rem'}}>
            <h2>Black's model Pricer</h2>
            <form onSubmit={handleSubmit}>
                {['F','K','T','r','sigma'].map(name =>(
                    <div key={name} style={{margin: '0.5rem 0'}}>
                        <label style={{width: '80px', display: 'inline-block'}}>{name}: </label>
                        <input 
                            type="number"
                            step="any"
                            name={name}
                            value={inputs[name]}
                            onChange={handleChange}
                            required
                        />
                    </div>
                ))}
                <div style={{margin: '0.5rem 0'}}>
                    <label style={{width: '80px', display: 'inline-block'}}>Type: </label>
                    <select
                        name='optionType'
                        onChange={handleChange}
                        value={inputs.optionType}
                    >
                        <option value="call">Call</option>
                        <option value="put">Put</option>
                    </select>
                </div>
                <button type='submit'>Compute Price</button>
            </form>
            {price !== null && (
                <p>
                    Option Price: <strong>{price.toFixed(4)}</strong>
                </p>
            )}
        </div>
    );
}