import HomePage from "./pages/HomePage.tsx";
import {Route, Routes} from "react-router-dom";
import AddGamePage from "./pages/AddGamePage.tsx";
import PlayerManagerPage from "./pages/PlayerManagerPage.tsx";
import StatsPage from "./pages/StatsPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import SettingsPage from "./pages/SettingsPage.tsx";
import AppLayout from "./components/ui/Layout.tsx";

function App() {

  return (
    <>
        <AppLayout>

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
        </AppLayout>

    </>
  )
}

export default App
