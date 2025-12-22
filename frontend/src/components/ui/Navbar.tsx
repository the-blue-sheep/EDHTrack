import { Link } from "react-router-dom";
import logo from '../../assets/EDHTrack-Logo.png';

export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 bg-green-900">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4">

                <Link to="/" className="flex items-center">
                    <img src={logo} alt="EDH Track" className="h-24 mg:h-28 w-auto" />
                </Link>

                <nav className="flex flex-1 justify-center gap-8 text-lg font-medium">
                    <Link to="/" className="hover:text-blue-600">Home</Link>
                    <Link to="/stats" className="hover:text-blue-600">Statistics</Link>
                    <Link to="/games" className="hover:text-blue-600">Games</Link>
                    <Link to="/players" className="hover:text-blue-600">Players</Link>
                    <Link to="/settings" className="hover:text-blue-600">Settings</Link>
                    <Link to="/login" className="hover:text-blue-600">Login</Link>
                </nav>

            </div>
        </header>
    );
}
