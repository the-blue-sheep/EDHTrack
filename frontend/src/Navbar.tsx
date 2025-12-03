import {Link} from "react-router-dom";

export default function Navbar() {
    return (
        <>
            <Link to={"/"}>Home</Link>
            <Link to={"/login"}>Login</Link>
            <Link to={"/stats"}>Statistics</Link>
            <Link to={"/add"}>Add Game</Link>
            <Link to={"/players"}>Players</Link>
            <Link to={"/settings"}>Settings</Link>
        </>
    )
}