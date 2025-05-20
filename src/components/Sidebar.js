import { NavLink } from "react-router-dom";

export default function Sidebar() {
    return (
        <nav className="sidebar">
            <ul>
                <li><NavLink to="/">Home</NavLink></li>
                <li><NavLink to="bs-pricer">Black-Scholes-Pricer</NavLink></li>
            </ul>
        </nav>
    );
}