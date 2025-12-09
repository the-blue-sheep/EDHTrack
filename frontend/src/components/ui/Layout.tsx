import Navbar from "./Navbar.tsx";
import Sidebar from "./Sidebar.tsx";
import {Outlet} from "react-router-dom";

export default function AppLayout() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex flex-1">
                <Sidebar />
                <div className="flex-grow p-4">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
