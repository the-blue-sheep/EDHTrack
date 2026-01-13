import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import PlayerSelect from "../../components/PlayerSelect.tsx";
import { useCommanders } from "../../hooks/useCommanders";

interface GameParticipant {
    playerName: string;
    deckName: string;
    isWinner: boolean;
}

interface GameOverviewDTO {
    gameId: number;
    date: string;
    notes: string;
    participants: GameParticipant[];
}

interface PageResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
}

interface Player {
    id: number;
    name: string;
    isRetired: boolean;
}

export default function GameOverviewPage() {
    const [players, setPlayers] = useState<Player[]>([]);
    const [selectedPlayerId, setSelectedPlayerId] = useState<number | undefined>(undefined);
    const [playerFilterId, setPlayerFilterId] = useState<number | undefined>(undefined);
    const [games, setGames] = useState<GameOverviewDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [commanderInput, setCommanderInput] = useState("");
    const [commanderFilter, setCommanderFilter] = useState("");
    const [hasLoaded, setHasLoaded] = useState(false);
    const { commanders: allCommanders, loading: commandersLoading } = useCommanders();


    useEffect(() => {
        setLoading(true);

        axios.get<PageResponse<GameOverviewDTO>>("/api/games", {
            params: {
                page,
                size: 20,
                playerId: selectedPlayerId,
                commander: commanderFilter || undefined
            }
        })
            .then(resp => {
                setGames(resp.data.content ?? []);
                setTotalPages(resp.data.totalPages ?? 0);
                setHasLoaded(true);
            })
            .finally(() => setLoading(false));
    }, [page, playerFilterId, commanderFilter]);


    useEffect(() => {
        axios.get<Player[]>("/api/players")
            .then(response => {
                setPlayers(Array.isArray(response.data) ? response.data : []);
            });
    }, []);

    if (loading && !hasLoaded) {
        return <p className="p-6 text-lg font-medium">Loading…</p>;
    }

    return (
        <div className="p-6">
            <h3 className="text-xl font-semibold text-purple-800 space-x-6">Game Overview</h3>
            <div className="flex gap-4 mt-4 mb-6 items-end">

                <PlayerSelect
                    players={players}
                    value={selectedPlayerId}
                    onChange={(id) => {
                        setPage(0);
                        setSelectedPlayerId(id);
                    }}
                    label="Player"
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Search for Games with…
                    </label>

                    <input
                        list="commanders"
                        value={commanderInput}
                        disabled={commandersLoading}
                        placeholder={commandersLoading ? "Loading commanders…" : "Commander name"}
                        onChange={e => setCommanderInput(e.target.value)}
                        className="min-w-[320px] max-w-2xl border border-gray-300 px-3 py-2 rounded-md
                       focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />

                    <datalist id="commanders">
                        {allCommanders.map(name => (
                            <option key={name} value={name} />
                        ))}
                    </datalist>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 invisible">
                        Apply
                    </label>

                    <button
                        onClick={() => {
                            setPage(0);
                            setCommanderFilter(commanderInput.trim());
                            setPlayerFilterId(selectedPlayerId);
                        }}
                        className="px-3 py-2 border rounded-md bg-purple-700 text-white
                       focus:ring-2 focus:ring-purple-500"
                    >
                        Apply
                    </button>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 invisible">
                        Reset
                    </label>
                    <button
                        onClick={() => {
                            setPage(0);

                            setSelectedPlayerId(undefined);
                            setCommanderInput("");

                            setPlayerFilterId(undefined);
                            setCommanderFilter("");
                        }}
                        className="px-3 py-2 border rounded-md bg-red-600 text-white
                       focus:ring-2 focus:ring-purple-500"
                    >
                        Reset
                    </button>
                </div>
            </div>


            {hasLoaded && games.length === 0 ? (
                <p>No games found</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse border border-gray-300">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">Games</th>
                            <th className="border border-gray-300 px-4 py-2">Date</th>
                            <th className="border border-gray-300 px-4 py-2">Notes</th>
                            <th className="border border-gray-300 px-4 py-2">Edit</th>
                        </tr>
                        </thead>
                        <tbody>
                        {games.map(game => (
                            <tr key={game.gameId}>

                                <td className="border px-4 py-2">
                                    <ul className="space-y-1">
                                        {game.participants.map(p => (
                                            <li key={p.playerName}
                                                className={`flex justify-between gap-4 ${
                                                    p.isWinner ? "font-bold text-green-700" : ""
                                                }`}
                                            >
                                                <span>
                                                    {p.isWinner && "🏆 "} {p.playerName}
                                                </span>
                                                <span className="text-gray-600">
                                                    {p.deckName}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                                <td className="border border-gray-300 px-4 py-2">{game.date}</td>
                                <td className="border border-gray-300 px-4 py-2">{game.notes}</td>
                                <td className="border border-gray-300 px-4 py-2">
                                    <Link to={`/games/${game.gameId}/edit`} className="text-purple-900 underline">
                                        Edit
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="flex items-center justify-between mt-4">
                <button
                    disabled={page === 0}
                    onClick={() => setPage(p => p - 1)}
                    className="px-3 py-1 border rounded bg-purple-700 text-white font-semibold disabled:opacity-40"
                >
                    ← Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i).map(i => (
                    <button
                        key={i}
                        onClick={() => setPage(i)}
                        className={`px-3 py-1 border rounded ${i === page ? "bg-purple-900 text-white" : "bg-white text-gray-700"}`}
                    >
                        {i + 1}
                    </button>
                ))}

                <button
                    disabled={page + 1 >= totalPages}
                    onClick={() => setPage(p => p + 1)}
                    className="px-3 py-1 border rounded bg-purple-700 text-white font-semibold disabled:opacity-40"
                >
                    Next →
                </button>
            </div>
            <div className="flex items-center justify-center gap-2 mt-4">
                <span className="text-sm text-gray-600">
                    Page {page + 1} of {totalPages}
                </span>
            </div>
        </div>
    );
}
