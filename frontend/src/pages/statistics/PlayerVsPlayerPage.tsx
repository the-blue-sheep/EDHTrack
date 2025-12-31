import {type ChangeEvent, useEffect, useState} from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface Player {
    id: number;
    name: string;
    isRetired: boolean;
}

interface PlayerVsPlayerDTO {
    player1Id: number;
    player1Name: string;
    player2Id: number;
    player2Name: string;
    winRate: number;
}


export default function PlayerVsPlayerPage() {
    const [players, setPlayers] = useState<Player[]>([]);
    const [player1Id, setPlayer1Id] = useState<number | null>(null);
    const [player2Id, setPlayer2Id] = useState<number | null>(null);

    const [data, setData] = useState<PlayerVsPlayerDTO | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axios.get<Player[]>("/api/players")
            .then(res => setPlayers(res.data))
            .catch(err => {
                console.error(err);
                toast.error("Failed to load players");
            });
    }, []);

    function loadStats() {
        if (player1Id === null || player2Id === null) return;
        if (player1Id === player2Id) {
            toast.warning("Please select two different players");
            return;
        }

        setLoading(true);
        const toasty = toast.loading("Loading statistics...");

        axios.get<PlayerVsPlayerDTO>(
            "/api/stats/player-vs-player-stat",
            {
                params: {
                    playerId1: player1Id,
                    playerId2: player2Id
                }
            }
        )
            .then(res => {
                setData(res.data);
                toast.update(toasty, {
                    render: "Statistics loaded",
                    type: "success",
                    isLoading: false,
                    autoClose: 2000
                });
            })
            .catch(err => {
                console.error(err);
                setData(null);
                toast.update(toasty, {
                    render: "Error loading statistics",
                    type: "error",
                    isLoading: false,
                    autoClose: 3000
                });
            })
            .finally(() => setLoading(false));
    }

    return (
        <div className="p-6">
            <h3 className="text-xl font-semibold text-purple-800 space-x-6">
                Player vs Player
            </h3>

            <div className="grid gap-4 mb-6 grid-cols-[repeat(auto-fit,minmax(240px,1fr))]">
                <div className="flex items-center gap-2">
                    <label className="text-purple-900 font-bold">
                        Player 1
                    </label>
                    <select
                        value={player1Id ?? ""}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                            setPlayer1Id(e.target.value ? Number(e.target.value) : null)
                        }
                        className="border rounded px-2 py-1 min-w-[200px]"
                    >
                        <option value="">-- Select --</option>
                        {players.map(p => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <label className="text-purple-900 font-bold">
                        Player 2
                    </label>
                    <select
                        value={player2Id ?? ""}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                            setPlayer2Id(e.target.value ? Number(e.target.value) : null)
                        }
                        className="border rounded px-2 py-1 min-w-[200px]"
                    >
                        <option value="">-- Select --</option>
                        {players.map(p => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <button
                onClick={loadStats}
                className="px-6 py-2 bg-purple-700 text-white font-semibold rounded-md hover:bg-purple-800 disabled:bg-gray-400"
                disabled={player1Id === null || player2Id === null || player1Id === player2Id}
            >
                Compare
            </button>

            {loading && <p className="mt-4">Loading...</p>}

            {!loading && data && (
                <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-4">
                        {data.player1Name} vs {data.player2Name}
                    </h2>

                    <p className="text-lg">
                        Winrate of <span className="font-bold">{data.player1Name}</span>:
                        {" "}
                        <span className="font-bold">
                            {(data.winRate * 100).toFixed(1)}%
                        </span>
                    </p>
                </div>
            )}
        </div>
    );
}
