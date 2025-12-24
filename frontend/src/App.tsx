import HomePage from "./pages/HomePage.tsx";
import {Route, Routes} from "react-router-dom";
import AddGamePage from "./pages/games/AddGamePage.tsx";
import PlayerManagerPage from "./pages/PlayerManagerPage.tsx";
import StatsPage from "./pages/StatsPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import SettingsPage from "./pages/SettingsPage.tsx";
import AppLayout from "./components/ui/Layout.tsx";
import AddPlayerForm from "./pages/player/AddPlayerPage.tsx";
import AddDeckPage from "./pages/player/AddDeckPage.tsx";
import DecksPage from "./pages/player/DecksPage.tsx";
import RetirePage from "./pages/player/RetirePage.tsx";
import UpdatePlayerAndDecksPage from "./pages/player/UpdatePlayerAndDecksPage.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GameOverviewPage from "./pages/games/GameOverviewPage.tsx";

function App() {

  return (
    <>
        <div className={"pt-16"}>
            <Routes>
                <Route element={<AppLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/games" element={<GameOverviewPage />} />
                    <Route path="/games/add" element={<AddGamePage />} />
                    <Route path="/players" element={<PlayerManagerPage />} />
                    <Route path="/decks" element={<DecksPage />} />
                    <Route path="/decks/add" element={<AddDeckPage />} />
                    <Route path="/players/add" element={<AddPlayerForm />} />
                    <Route path="/players/retire" element={<RetirePage />} />
                    <Route path="/players/update" element={<UpdatePlayerAndDecksPage />} />
                    <Route path="/stats" element={<StatsPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                </Route>
            </Routes>
            <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={true}
            pauseOnHover={false}
            draggable={true}
            />
        </div>
    </>
  )
}

export default App
