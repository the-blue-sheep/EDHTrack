// Sidebar.tsx
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
    const location = useLocation();

    if (location.pathname === "/players") {
        return (
            <nav className="w-64 bg-gray-100 min-h-full p-4">
                <ul>
                    <li><Link to="/players">Player Overview</Link></li>
                    <li><Link to="/players/add">Add Player</Link></li>
                    <li><Link to="/decks">Decks</Link></li>
                    <li><Link to="/decks/add">Add Deck</Link></li>
                </ul>
            </nav>
        );
    }

}
