import { NavLink } from "react-router-dom";

export default function Sidebar() {
    return (
        <nav className="sidebar">
            <ul>
                <li><NavLink to="/">Home</NavLink></li>
                <li><NavLink to="bs-pricer">Black-Scholes-Pricer</NavLink></li>
                <li><NavLink to="mc-pricer">Monte-Carlo-Pricer</NavLink></li>
                <li><NavLink to="black-pricer">Black's-model-pricer</NavLink></li>
                <li><NavLink to="binomial-pricer">Binomial-model-pricer</NavLink></li>
                <li><NavLink to="trinomial-pricer">Trinomial-model-pricer</NavLink></li>
            </ul>
        </nav>
    );
}