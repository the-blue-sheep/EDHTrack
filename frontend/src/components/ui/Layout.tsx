import Navbar from "./Navbar.tsx";
import Sidebar from "./Sidebar.tsx";
import type {ReactNode} from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex flex-1">
                <Sidebar />
                <div className="flex-grow p-4">
                    {children}
                </div>
            </div>
        </div>
    );
}
