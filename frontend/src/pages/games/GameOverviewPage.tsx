import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

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

export default function GameOverviewPage() {
    const [games, setGames] = useState<GameOverviewDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const toasty = toast.loading("Loading games…");
        axios.get<PageResponse<GameOverviewDTO>>("/api/games")
            .then(resp => {
                setGames(resp.data.content);
                setLoading(false);
                toast.update(toasty, { render: "Games loaded", type: "success", isLoading: false, autoClose: 2000 });
            })
            .catch(err => {
                console.error("Error loading games:", err);
                toast.update(toasty, { render: "Error loading games", type: "error", isLoading: false, autoClose: 3000 });
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        setLoading(true);

        axios.get("/api/games", {
            params: { page, size: 20 }
        })
            .then(resp => {
                setGames(resp.data.content);
                setTotalPages(resp.data.totalPages);
            })
            .finally(() => setLoading(false));
    }, [page]);


    if (loading) {
        return <p className="p-6 text-lg font-medium">Loading…</p>;
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Game Overview</h2>

            {games.length === 0 ? (
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
