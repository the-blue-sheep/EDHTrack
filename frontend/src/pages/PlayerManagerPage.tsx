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
                    </tr>
                    </thead>
                    <tbody>
                    {data.map((player, index) => (
                        <tr
                            key={player.playerId}
                            onClick={() => navigate(`/players/${player.playerId}`)}
                            className="border-b last:border-b-0 cursor-pointer hover:bg-purple-50"
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
                        </tr>

                    ))}
                    </tbody>
                </table>
            : null}
        </div>
    );
}
