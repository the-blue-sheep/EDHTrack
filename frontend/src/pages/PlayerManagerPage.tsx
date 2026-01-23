import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
        axios.get<PlayerGamesCountDTO[]>(`/api/stats/players/game-count?hideRetired=${hideRetired}`)
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

        const dto = {
            id: player.playerId,
            isRetired: !player.isRetired
        };

        axios.post("/api/players/retire", dto)
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
        <div className="p-6">
            <h1 className="text-2xl font-bold text-purple-900 mb-6">
                Player Overview
            </h1>
            <div className="flex items-center gap-2 mb-4">
                <label className="flex items-center gap-2 font-bold text-purple-900">
                    <input
                        type="checkbox"
                        checked={hideRetired}
                        onChange={e => setHideRetired(e.target.checked)}
                    />
                    Hide retired players
                </label>
            </div>

            {loading ? <p>Loading...</p> : null}

            {!loading && data.length > 0 ?
                <table className="w-full border-collapse">
                    <thead>
                    <tr className="border-b">
                        <th className="px-3 py-2 text-left">#</th>
                        <th className="px-3 py-2 text-left">Player</th>
                        <th className="px-3 py-2 text-center">Games Played</th>
                        <th className="px-3 py-2 text-center">Retired</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.map((player, index) => (
                        <tr
                            key={player.playerId}
                            onClick={() => navigate(`/players/${player.playerId}`)}
                            className={player.isRetired ? "bg-red-50 border-b last:border-b-0 cursor-pointer hover:bg-purple-50" : "border-b last:border-b-0 cursor-pointer hover:bg-purple-50"}
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
                                    type="button"
                                    className={`px-6 py-2 font-semibold rounded-md focus:ring-2 ${
                                        player.isRetired
                                            ? "bg-red-600 text-white hover:bg-red-700 focus:ring-red-400"
                                            : "bg-purple-700 text-white hover:bg-purple-800 focus:ring-green-400"
                                    }`}
                                    onClick={(e) => handleRetirePlayer(e, player)}
                                >
                                    {player?.isRetired ? "Active" : "Retire"}
                                </button>
                            </td>
                        </tr>

                    ))}
                    </tbody>
                </table>
            : null}
        </div>
    );
}
