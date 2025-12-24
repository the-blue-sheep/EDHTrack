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


export default function GameOverviewPage() {
    const [games, setGames] = useState<GameOverviewDTO[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const toasty = toast.loading("Loading games…");
        axios.get<GameOverviewDTO[]>("/api/games")
            .then(resp => {
                setGames(resp.data);
                setLoading(false);
                toast.update(toasty, { render: "Games loaded", type: "success", isLoading: false, autoClose: 2000 });
            })
            .catch(err => {
                console.error("Error loading games:", err);
                toast.update(toasty, { render: "Error loading games", type: "error", isLoading: false, autoClose: 3000 });
                setLoading(false);
            });
    }, []);

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
                            <th className="border border-gray-300 px-4 py-2">Date</th>
                            <th className="border border-gray-300 px-4 py-2">Notes</th>
                            <th className="border border-gray-300 px-4 py-2">Participants</th>
                            <th className="border border-gray-300 px-4 py-2">Decks</th>
                            <th className="border border-gray-300 px-4 py-2">Winners</th>
                        </tr>
                        </thead>
                        <tbody>
                        {games.map(game => (
                            <tr key={game.gameId}>
                                <td className="border border-gray-300 px-4 py-2">{game.date}</td>
                                <td className="border border-gray-300 px-4 py-2">{game.notes}</td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {game.participants.map(p => p.playerName).join(", ")}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {game.participants.map(p => p.deckName).join(", ")}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {game.participants
                                        .filter(p => p.isWinner)
                                        .map(p => p.playerName)
                                        .join(", ")
                                    }
                                </td>
                                <td>
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
        </div>
    );
}
