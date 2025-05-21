import { useState } from "react";

export default function PDEPricer(){
    const [inputs, setInputs] = useState({
        S: '', K: '', T: '', r: '', sigma: '', S_max: '', M: '100', N: '1000', optionType: 'call' 
    });
    const [price, setPrice] = useState(null);

    const handleChange = e => 
        setInputs({ ...inputs, [e.target.name]: e.target.value});

    const handleSubmit = async e => {
        e.preventDefault();
        const res = await fetch('http://localhost:5000/api/pde-price', {
            method : 'POST',
            headers : {'Content-Type': 'application/json'},
            body : JSON.stringify(inputs) 
        });

        const {price} = await res.json();
        setPrice(price);
    };

    return (
        <div style={{padding: '2rem'}}>
            <h2>Finite Difference Pricer (Crank-Nicholson)</h2>
            <form onSubmit={handleSubmit}>
                {['S','K','T','r','sigma','S_max','M','N'].map(name =>(
                    <div key={name} style={{margin: '0.5rem 0'}}>
                        <label style={{width: '80px', display: 'inline-block'}}>
                            {name}: 
                        </label>
                        <input
                            type='number'
                            step='any'
                            name={name}
                            value={inputs[name]}
                            onChange={handleChange}
                            required
                        />
                    </div>
                ))}
                <div style={{ margin: '0.5rem 0'}}>
                    <label style={{ width: '80px', display: 'inline-block'}}>
                        Type: 
                    </label>
                    <select
                        name='optionType'
                        value={inputs.optionType}
                        onChange={handleChange}
                    >
                        <option value='call'>Call</option>
                        <option value='put'>Put</option>
                    </select>
                </div>
                <button type="submit">Compute PDE Price</button>
            </form>
            {price != null && (
                <p style={{marginTop: '1rem'}}>
                    Option Price: <strong>{price.toFixed(4)}</strong>
                </p>
            )}
        </div>
    );
}