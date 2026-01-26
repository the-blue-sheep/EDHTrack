import { Link } from "react-router-dom";
import logo from '../../assets/EDHTrack-Logo.png';
import { useAuth } from "../../auth/useAuth";
import { useState } from "react";

export default function Navbar() {
    const { user, logout } = useAuth();
    const [open, setOpen] = useState(false);

    return (
        <>
            <header className="sticky top-0 z-50 bg-green-900">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4">

                    <div className="flex items-center gap-4">

                        <button
                            className="md:hidden text-white text-2xl"
                            onClick={() => setOpen(true)}
                        >
                            ☰
                        </button>

                        <Link to="/" className="flex items-center">
                            <img src={logo} alt="EDH Track" className="h-16 md:h-24 w-auto" />
                        </Link>
                    </div>

                    <nav className="hidden md:flex flex-1 justify-center gap-8 text-lg font-medium text-white">
                        <Link to="/" className="hover:text-blue-400">Home</Link>
                        <Link to="/stats" className="hover:text-blue-400">Statistics</Link>
                        <Link to="/games" className="hover:text-blue-400">Games</Link>
                        <Link to="/players" className="hover:text-blue-400">Players</Link>
                        <Link to="/settings" className="hover:text-blue-400">Settings</Link>
                    </nav>

                    {user ? (
                        <div className="hidden md:flex gap-3 items-center text-lg font-medium text-white">
                            <span>{user.username} ({user.role})</span>
                            <button onClick={logout}>Logout</button>
                        </div>
                    ) : (
                        <Link to="/login" className="hidden md:block text-white">Login</Link>
                    )}
                </div>
            </header>

            {open && (
                <div
                    className="fixed inset-0 bg-black/40 z-40"
                    onClick={() => setOpen(false)}
                />
            )}

            <aside
                className={`
                    fixed top-0 left-0 h-full w-64 bg-white z-50
                    transform transition-transform duration-200
                    ${open ? "translate-x-0" : "-translate-x-full"}
                `}
            >
                <div className="p-4 border-b flex justify-between items-center">
                    <span className="font-bold text-lg">Menu</span>
                    <button onClick={() => setOpen(false)}>✕</button>
                </div>

                <nav className="flex flex-col p-4 gap-4 text-lg">

                    <MobileLink to="/" label="Home" close={() => setOpen(false)} />
                    <MobileLink to="/stats" label="Statistics" close={() => setOpen(false)} />
                    <MobileLink to="/games" label="Games" close={() => setOpen(false)} />
                    <MobileLink to="/games/add" label="Add Game" close={() => setOpen(false)} />
                    <MobileLink to="/players" label="Players" close={() => setOpen(false)} />
                    <MobileLink to="/players/add" label="Add Player" close={() => setOpen(false)} />
                    <MobileLink to="/settings" label="Settings" close={() => setOpen(false)} />

                    <hr />

                    {user ? (
                        <>
                            <span className="text-sm text-gray-500">
                                {user.username} ({user.role})
                            </span>
                            <button
                                onClick={() => {
                                    logout();
                                    setOpen(false);
                                }}
                                className="text-left text-red-600"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <MobileLink to="/login" label="Login" close={() => setOpen(false)} />
                    )}
                </nav>
            </aside>
        </>
    );
}

function MobileLink(
    { to, label, close }:
    { to: string; label: string; close: () => void }
) {
    return (
        <Link
            to={to}
            onClick={close}
            className="text-gray-800 hover:text-purple-600"
        >
            {label}
        </Link>
    );
}
