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
import UpdatePlayerAndDecksPage from "./pages/player/UpdatePlayerAndDecksPage.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GameOverviewPage from "./pages/games/GameOverviewPage.tsx";
import LeaderboardPage from "./pages/statistics/LeaderboardPage.tsx";
import CommanderAmountsPage from "./pages/statistics/CommanderAmountsPage.tsx";
import WinrateByCommander from "./pages/statistics/WinrateByCommander.tsx";
import StreaksPage from "./pages/statistics/StreaksPage.tsx";
import PlayerVsPlayerPage from "./pages/statistics/PlayerVsPlayerPage.tsx";
import PlayerWinratePage from "./pages/statistics/PlayerWinratePage.tsx";
import PlayerDetailPage from "./pages/player/PlayerDetailPage.tsx";
import EditGamePage from "./pages/games/EditGamePage.tsx";

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
                    <Route path="/players/update" element={<UpdatePlayerAndDecksPage />} />
                    <Route path="/stats" element={<StatsPage />} />
                    <Route path="/statistics/leaderboard" element={<LeaderboardPage />} />
                    <Route path="/statistics/commander-amounts" element={<CommanderAmountsPage />} />
                    <Route path="/statistics/commander-winrate" element={<WinrateByCommander />} />
                    <Route path="/statistics/streaks" element={<StreaksPage />} />
                    <Route path="/statistics/player-winrate" element={<PlayerWinratePage />} />
                    <Route path="/statistics/player-vs-player" element={<PlayerVsPlayerPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/players/:id" element={<PlayerDetailPage />} />
                    <Route path="/games/:id/edit" element={<EditGamePage />} />
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
