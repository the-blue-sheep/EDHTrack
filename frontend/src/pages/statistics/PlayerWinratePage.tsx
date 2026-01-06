import {type ChangeEvent, useEffect, useState} from "react";
import axios from "axios";
import {toast} from "react-toastify";

interface Player {
    id: number;
    name: string;
    isRetired: boolean;
}

interface WinrateByPlayerDTO {
    playerId: number;
    playerName: string;
    gamesIn: number;
    gamesWon: number;
    winRate: number;
}


export default function PlayerWinratePage() {
    const [players, setPlayers] = useState<Player[]>([]);
    const [selectedPlayerId, setSelectedPlayerId] = useState<number | undefined>(undefined);
    const [data, setData] = useState<WinrateByPlayerDTO | null>(null);
    const [loading] = useState(false);

    useEffect(() => {
        axios.get<Player[]>("/api/players")
            .then(response => {
                setPlayers(Array.isArray(response.data) ? response.data : []);
            })
            .catch(error => {
                console.error("Error while loading players:", error);
            });
    }, []);

    function onChangeHandlerPlayer(e: ChangeEvent<HTMLSelectElement>) {
        const val = e.target.value;

        if (!val) {
            setSelectedPlayerId(undefined);
            setData(null);
            return;
        }

        const id = Number(val);
        setSelectedPlayerId(id);

        const toastId = toast.loading("Loading winrate...");

        axios.get<WinrateByPlayerDTO>(`/api/stats/player-winrate?playerId=${id}`)
            .then(response => {
                setData(response.data);

                toast.update(toastId, {
                    render: "Winrate loaded",
                    type: "success",
                    isLoading: false,
                    autoClose: 2000
                });
            })
            .catch(err => {
                console.error(err);
                setData(null);

                toast.update(toastId, {
                    render: "Error loading winrate",
                    type: "error",
                    isLoading: false,
                    autoClose: 3000
                });
            });
    }

    return (
        <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="mb-6">
                    <h3 className="text-xl font-semibold text-purple-800 space-x-6">Player Winrate</h3>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Player
                    </label>
                    <select
                        name="id"
                        id="player-select"
                        value={selectedPlayerId ?? ""}
                        onChange={onChangeHandlerPlayer}
                        className="min-w-[320px] max-w-2xl border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                        <option value="">-- Select --</option>
                        {players.map(player => (
                            <option key={player.id} value={player.id}>
                                {player.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? <p>Loading...</p> : null}

            {data ?
                <div className="mt-6">

                    <h2 className="text-xl font-semibold mb-4 text-purple-900">
                        {data.playerName}
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="border rounded-lg p-4 text-center">
                            <p className="text-sm text-gray-500">Games Played</p>
                            <p className="text-2xl font-bold">
                                {data.gamesIn}
                            </p>
                        </div>

                        <div className="border rounded-lg p-4 text-center">
                            <p className="text-sm text-gray-500">Wins</p>
                            <p className="text-2xl font-bold">
                                {data.gamesWon}
                            </p>
                        </div>

                        <div className="border rounded-lg p-4 text-center">
                            <p className="text-sm text-gray-500">Winrate</p>
                            <p className="text-2xl font-bold">
                                {(data.winRate * 100).toFixed(1)}%
                            </p>
                        </div>
                    </div>

                </div>
            : null}
        </div>
    )
}