import { NavLink } from "react-router-dom";

export default function Sidebar() {
    return (
        <nav className="sidebar">
            <ul>
                <li><NavLink to="/">Home</NavLink></li>
            </ul>
            <div className="Sidebar section">
                <h3>Option Pricers</h3>
                <ul>
                    <li><NavLink to="bs-pricer">Black-Scholes-Pricer</NavLink></li>
                    <li><NavLink to="mc-pricer">Monte-Carlo-Pricer</NavLink></li>
                    <li><NavLink to="black-pricer">Black's-Model-Pricer</NavLink></li>
                    <li><NavLink to="binomial-pricer">Binomial-Model-Pricer</NavLink></li>
                    <li><NavLink to="trinomial-pricer">Trinomial-Model-Pricer</NavLink></li>
                    <li><NavLink to="PDE-pricer">PDE-Model-Pricer</NavLink></li>
                </ul>
            </div>
        </nav>
    );
}