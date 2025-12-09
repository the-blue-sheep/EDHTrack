import {NavLink, useLocation} from "react-router-dom";

interface MenuItem {
    path: string;
    label: string;
}
type MenuConfig = {
    default: MenuItem[];
    players: MenuItem[];
    games: MenuItem[];
};

export const menuConfig = {
    default: [
        { path: "/", label: "Home" },
        { path: "/stats", label: "Statistics" },
        { path: "/settings", label: "Settings" },
    ],
    players: [
        { path: "/players", label: "Players" },
        { path: "/players/add", label: "Add Player" },
        { path: "/decks", label: "Decks" },
        { path: "/decks/add", label: "Add Deck" }
    ],
    games: [
        { path: "/games", label: "Game Overview" },
        { path: "/games/add", label: "Add Game" }
    ]
}

export default function Sidebar() {
    const location = useLocation();
    const pathname = location.pathname;

    const menuKey: keyof MenuConfig =
        pathname.startsWith("/players") ? "players"
            : pathname.startsWith("/games") ? "games"
                : "default";

    const menuItems = menuConfig[menuKey];

    return (
        <nav className="w-64 bg-gray-100 min-h-full p-4">
            <ul className="space-y-2">
                {menuItems.map(r => (
                    <li key={r.path}>
                        <NavLink
                            to={r.path}
                            className={({ isActive }) =>
                                isActive
                                    ? "block font-bold text-purple-700"
                                    : "block text-gray-700 hover:text-purple-500"
                            }
                            end
                        >
                            {r.label}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
