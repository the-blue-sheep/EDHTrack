import HomePage from "./pages/HomePage.tsx";
import {Route, Routes} from "react-router-dom";
import AddGamePage from "./pages/player/AddGamePage.tsx";
import PlayerManagerPage from "./pages/PlayerManagerPage.tsx";
import StatsPage from "./pages/StatsPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import SettingsPage from "./pages/SettingsPage.tsx";
import AppLayout from "./components/ui/Layout.tsx";
import AddPlayerForm from "./pages/player/AddPlayerPage.tsx";
import AddDeckPage from "./pages/player/AddDeckPage.tsx";
import DecksPage from "./pages/player/DecksPage.tsx";

function App() {

  return (
    <>
        <div className={"pt-16"}>
            <Routes>
                <Route element={<AppLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/add" element={<AddGamePage />} />
                    <Route path="/players" element={<PlayerManagerPage />} />
                    <Route path="/decks" element={<DecksPage />} />
                    <Route path="/decks/add" element={<AddDeckPage />} />
                    <Route path="/players/add" element={<AddPlayerForm />} />
                    <Route path="/stats" element={<StatsPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                </Route>
            </Routes>
        </div>
    </>
  )
}

export default App
