import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/axiosConfig";
import { toast } from "react-toastify";

interface PlayerGamesCountDTO {
    playerId: number;
    playerName: string;
    isRetired: boolean;
    totalGames: number;
}

export default function PlayerManagerPage() {
    const [data, setData] = useState<PlayerGamesCountDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [hideRetired, setHideRetired] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const toasty = toast.loading("Loading players...");
        setLoading(true);

        api
            .get<PlayerGamesCountDTO[]>(`/api/stats/players/game-count?hideRetired=${hideRetired}`)
            .then(res => {
                setData(res.data);
                toast.update(toasty, {
                    render: "Players loaded",
                    type: "success",
                    isLoading: false,
                    autoClose: 2000
                });
            })
            .catch(() => {
                toast.update(toasty, {
                    render: "Error loading players",
                    type: "error",
                    isLoading: false,
                    autoClose: 3000
                });
            })
            .finally(() => setLoading(false));
    }, [hideRetired]);

    function handleRetirePlayer(
        e: React.MouseEvent<HTMLButtonElement>,
        player: PlayerGamesCountDTO
    ) {
        e.stopPropagation();

        const toasty = toast.loading("Please wait...");

        api
            .post("/api/players/retire", {
                id: player.playerId,
                isRetired: !player.isRetired
            })
            .then(() => {
                setData(prev =>
                    prev.map(p =>
                        p.playerId === player.playerId
                            ? { ...p, isRetired: !p.isRetired }
                            : p
                    )
                );

                toast.update(toasty, {
                    render: "Player updated",
                    type: "success",
                    isLoading: false,
                    autoClose: 2000
                });
            })
            .catch(() => {
                toast.update(toasty, {
                    render: "Error updating player",
                    type: "error",
                    isLoading: false,
                    autoClose: 3000
                });
            });
    }

    return (
        <div className="p-4 md:p-6">
            <h1 className="text-2xl font-bold text-purple-900 mb-4">
                Player Overview
            </h1>

            <label className="flex items-center gap-2 font-bold text-purple-900 mb-4">
                <input
                    type="checkbox"
                    checked={hideRetired}
                    onChange={e => setHideRetired(e.target.checked)}
                />
                Hide retired players
            </label>

            {loading && <p>Loading...</p>}

            {/* DESKTOP TABLE */}
            <div className="hidden md:block">
                <table className="w-full border-collapse">
                    <thead>
                    <tr className="border-b">
                        <th className="px-3 py-2 text-left">#</th>
                        <th className="px-3 py-2 text-left">Player</th>
                        <th className="px-3 py-2 text-center">Games</th>
                        <th className="px-3 py-2 text-center">Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.map((player, index) => (
                        <tr
                            key={player.playerId}
                            onClick={() => navigate(`/players/${player.playerId}`)}
                            className={`border-b cursor-pointer hover:bg-purple-50 ${
                                player.isRetired ? "bg-red-50" : ""
                            }`}
                        >
                            <td className="px-3 py-2">{index + 1}</td>
                            <td className={`px-3 py-2 font-medium ${
                                player.isRetired ? "text-gray-400 italic" : ""
                            }`}>
                                {player.playerName}
                            </td>
                            <td className="px-3 py-2 text-center">
                                {player.totalGames}
                            </td>
                            <td className="px-3 py-2 text-center">
                                <button
                                    onClick={(e) => handleRetirePlayer(e, player)}
                                    className={`px-6 py-2 font-semibold rounded-md ${
                                        player.isRetired
                                            ? "bg-red-600 text-white hover:bg-red-700"
                                            : "bg-purple-700 text-white hover:bg-purple-800"
                                    }`}
                                >
                                    {player.isRetired ? "Activate" : "Retire"}
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* MOBILE CARDS */}
            <div className="md:hidden space-y-4">
                {data.map(player => (
                    <div
                        key={player.playerId}
                        onClick={() => navigate(`/players/${player.playerId}`)}
                        className={`border rounded-lg p-4 shadow-sm cursor-pointer ${
                            player.isRetired ? "bg-red-50" : ""
                        }`}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h2 className={`text-lg font-semibold ${
                                player.isRetired ? "text-gray-400 italic" : "text-purple-900"
                            }`}>
                                {player.playerName}
                            </h2>

                            <span className="text-sm text-gray-600">
                                {player.totalGames} games
                            </span>
                        </div>

                        <button
                            onClick={(e) => handleRetirePlayer(e, player)}
                            className={`mt-2 w-full py-2 font-semibold rounded-md ${
                                player.isRetired
                                    ? "bg-red-600 text-white"
                                    : "bg-purple-700 text-white"
                            }`}
                        >
                            {player.isRetired ? "Activate player" : "Retire player"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
