
import './App.css'
import HomePage from "./pages/HomePage.tsx";
import {Route, Routes} from "react-router-dom";
import AddGamePage from "./pages/AddGamePage.tsx";
import PlayerManagerPage from "./pages/PlayerManagerPage.tsx";
import StatsPage from "./pages/StatsPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import Navbar from "./Navbar.tsx";
import SettingsPage from "./pages/SettingsPage.tsx";

function App() {

  return (
    <>
        <Navbar />
        <h1>EDH Track</h1>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/add" element={<AddGamePage />} />
                <Route path="/players" element={<PlayerManagerPage />} />
                <Route path="/stats" element={<StatsPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/settings" element={<SettingsPage />} />
            </Routes>
    </>
  )
}

export default App
