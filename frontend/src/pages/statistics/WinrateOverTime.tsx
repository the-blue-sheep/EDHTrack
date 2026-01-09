import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import axios from "axios";
import PlayerSelect from "../../components/PlayerSelect.tsx";
import DeckOptionsForPlayer from "../../components/DeckOptionsForPlayer.tsx";

interface Player {
    id: number;
    name: string;
    isRetired: boolean;
}

interface WinratePointDTO {
    gamesPlayed: number;
    wins: number;
    winrate: number;
}

interface WinrateOverTimeDTO {
    playerId: number;
    playerName: string;
    deckId: number;
    deckName: string;
    stepSize: number;
    points: WinratePointDTO[];
}

export default function WinrateOverTime() {
    const [players, setPlayers] = useState<Player[]>([]);
    const [selectedPlayerId, setSelectedPlayerId] = useState<number | undefined>();
    const [selectedDeckId, setSelectedDeckId] = useState<number | undefined>();
    const [stepSize, setStepSize] = useState<number>(3);
    const [winrate, setWinrate] = useState<WinrateOverTimeDTO | null>(null);

    useEffect(() => {
        const toasty = toast.loading("Please wait...");
        axios.get<Player[]>("/api/players")
            .then(response => {
                setPlayers(response.data ?? []);
                toast.update(toasty, {
                    render: "Player updated",
                    type: "success",
                    isLoading: false,
                    autoClose: 3000
                });
            })
            .catch(error => {
                console.error("Error while loading players:", error);
                toast.update(toasty, {
                    render: "Error",
                    type: "error",
                    isLoading: false,
                    autoClose: 3000
                });
            });
    }, []);

    useEffect(() => {
        if (!selectedPlayerId || !selectedDeckId) return;

        const toasty = toast.loading("Loading statistics...");

        axios.get<WinrateOverTimeDTO>(
            `/api/stats/players/${selectedPlayerId}/decks/${selectedDeckId}/winrate-over-time`,
            { params: { stepSize } }
        )
            .then(res => {
                setWinrate(res.data);
                toast.update(toasty, {
                    render: "Statistics loaded",
                    type: "success",
                    isLoading: false,
                    autoClose: 2000
                });
            })
            .catch(() => {
                toast.update(toasty, {
                    render: "Error loading statistics",
                    type: "error",
                    isLoading: false
                });
            });
    }, [selectedPlayerId, selectedDeckId, stepSize]);

    useEffect(() => {
        if (!selectedPlayerId || !selectedDeckId || stepSize < 1) return;

        axios.get<WinrateOverTimeDTO>(
            `/api/stats/players/${selectedPlayerId}/decks/${selectedDeckId}/winrate-over-time`,
            { params: { stepSize } }
        ).then(res => setWinrate(res.data));
    }, [selectedPlayerId, selectedDeckId, stepSize]);


    function onChangeHandlerPlayer(playerId?: number) {
        setSelectedPlayerId(playerId);
        setSelectedDeckId(undefined);
        setWinrate(null);
    }

    return (
        <div className="p-6">
            <h3 className="text-xl font-semibold text-purple-800">
                Winrate over Time
            </h3>
            <div className="flex gap-4">
                <div className="mb-6">
                    <PlayerSelect
                        players={players}
                        value={selectedPlayerId}
                        onChange={onChangeHandlerPlayer}
                    />
                </div>

                <div className="flex flex-col">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Deck
                    </label>
                    <select
                        value={selectedDeckId ?? ""}
                        onChange={e => setSelectedDeckId(Number(e.target.value))}
                        className="min-w-[320px] max-w-2xl border border-gray-300 px-3 py-2 rounded-md
                               focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        disabled={!selectedPlayerId}
                    >
                        <option value="">-- Select Deck --</option>

                        {selectedPlayerId && (
                            <DeckOptionsForPlayer playerId={selectedPlayerId} />
                        )}
                    </select>
                </div>
            </div>

            <div className="w-48">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Games per step
                </label>
                <input
                    type="number"
                    min={1}
                    max={50}
                    value={stepSize}
                    onChange={e => setStepSize(Number(e.target.value))}
                    className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-purple-500"
                />
            </div>

            {winrate && winrate.points ?
                <div className="mt-6">
                    <h4 className="font-semibold mb-2">Details</h4>
                    <table className="w-full text-sm border-collapse">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="px-3 py-2 text-left">Games</th>
                            <th className="px-3 py-2 text-center">Wins</th>
                            <th className="px-3 py-2 text-center">Winrate</th>
                        </tr>
                        </thead>
                        <tbody>
                        {winrate.points.map(p => (
                            <tr key={p.gamesPlayed} className="border-b">
                                <td className="px-3 py-2">{p.gamesPlayed}</td>
                                <td className="px-3 py-2 text-center">{p.wins}</td>
                                <td className="px-3 py-2 text-center">
                                    {(p.winrate * 100).toFixed(1)}%
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            :null}
        </div>
    )
}