import HomePage from "./pages/HomePage.tsx";
import {Route, Routes} from "react-router-dom";
import AddGamePage from "./pages/AddGamePage.tsx";
import PlayerManagerPage from "./pages/PlayerManagerPage.tsx";
import StatsPage from "./pages/StatsPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import Navbar from "./components/ui/Navbar.tsx";
import SettingsPage from "./pages/SettingsPage.tsx";

function App() {

  return (
    <>
        <Navbar />
        <div className={"pt-16"}>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/add" element={<AddGamePage />} />
                <Route path="/players" element={<PlayerManagerPage />} />
                <Route path="/stats" element={<StatsPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/settings" element={<SettingsPage />} />
            </Routes>
        </div>

    </>
  )
}

export default App
