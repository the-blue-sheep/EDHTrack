import {useParams} from "react-router-dom";
import {type FormEvent, useEffect, useState} from "react";
import DeckOptionsForPlayer from "../../components/DeckOptionsForPlayer.tsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {toast} from "react-toastify";


class GameEditDTO {
    gameId: number = 0;
    date: string = new Date().toISOString().split("T")[0];
    notes: string = "";
    participants: ParticipantInput[] = [];
}

interface ParticipantInput {
    playerId: number;
    playerName: string;
    deckId?: number;
    commander: string;
    deckName?: string;
    isWinner: boolean;
}

export default function EditGamePage() {
    const { id } = useParams();
    const [game, setGame] = useState<GameEditDTO>(new GameEditDTO());
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`/api/games/${id}`)
            .then(r => setGame(r.data));
    }, [id]);

    function toggleWinner(index: number, isWinner: boolean) {
        setGame(prev => {
            if (!prev) return prev;
            const copy = [...prev.participants];
            copy[index] = { ...copy[index], isWinner };
            return { ...prev, participants: copy };
        });
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const toasty = toast.loading("Submitting game...");
        await axios.put(`/api/games/${id}`, game)
            .then(() => {
                toast.update(toasty, {
                    render: "Game edited!",
                    type: "success",
                    isLoading: false,
                    autoClose: 1500
                });

                setTimeout(() => {
                    navigate("/games");
                }, 1500);
            })
            .catch(() => toast.update(toasty, {
                render: "Error saving game",
                type: "error",
                isLoading: false
            }));
    }

    async function handleDelete() {
        if (!window.confirm("Are you sure you want to delete this game?")) return;
        const toasty = toast.loading("Submitting game...");


        axios.delete(`/api/games`, {params: {id: game.gameId}})
            .then(() => {
                toast.update(toasty, {
                    render: "Game deleted!",
                    type: "success",
                    isLoading: false,
                    autoClose: 1500
                });

                setTimeout(() => {
                    navigate("/games");
                }, 1500);
            })
            .catch(() => toast.update(toasty, {
                render: "Error deleting game",
                type: "error",
                isLoading: false
            }));

    }

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-2xl font-bold">Add Game</h2>

            <form onSubmit={handleSubmit} className="space-y-4">

                {game.participants.map((p, idx) => (
                    <div key={idx} className="flex items-center gap-4 mb-2">

                        <div className="flex items-center w-1/6">
                            <input
                                type="checkbox"
                                checked={p.isWinner}
                                onChange={e => toggleWinner(idx, e.target.checked)}
                                className="h-4 w-4 text-green-600 border-gray-300 rounded mr-2"
                            />
                            <span className="text-sm font-medium text-gray-700">Winner</span>
                        </div>

                        <div className="w-2/5">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Player {idx + 1}
                            </label>
                            <select
                                value={p.playerId ?? ""}
                                onChange={e => {
                                    const playerId = Number(e.target.value);
                                    setGame(prev => {
                                        if (!prev) return prev;
                                        const copy = [...prev.participants];
                                        copy[idx] = { ...copy[idx], playerId, deckId: undefined };
                                        return { ...prev, participants: copy };
                                    });
                                }}
                                className="border px-2 py-1 rounded w-full"
                            >
                                <option value="">-- Select Player --</option>
                                {game.participants.map(player => (
                                    <option key={player.playerId} value={player.playerId}>
                                        {player.playerName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="w-2/5">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Deck {idx + 1}
                            </label>
                            <select
                                value={p.deckId ?? ""}
                                onChange={e => {
                                    const deckId = Number(e.target.value);
                                    setGame(prev => {
                                        if (!prev) return prev;
                                        const copy = [...prev.participants];
                                        copy[idx] = { ...copy[idx], deckId };
                                        return { ...prev, participants: copy };
                                    });
                                }}
                                disabled={!p.playerId}
                                className="border px-2 py-1 rounded w-full"
                            >
                                <option value="">-- Select Deck --</option>
                                <option value={p.deckId}>{p.deckName}</option>
                                {p.playerId ?
                                    <DeckOptionsForPlayer playerId={p.playerId} />
                                    : null}
                            </select>
                        </div>

                    </div>
                ))}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                        type="date"
                        value={game.date ?? ""}
                        onChange={e => setGame(prev => prev && { ...prev, date: e.target.value })}
                        className="border px-2 py-1 rounded"
                    />
                </div>

                <div>
                    <label className="min-w-[320px] max-w-2xl border border-gray-300 px-3 py-2 rounded-md  focus:ring-purple-500 focus:border-purple-500">Comment</label>
                    <textarea
                        value={game.notes ?? ""}
                        onChange={e => setGame(prev => prev && { ...prev, notes: e.target.value })}
                        className="border px-2 py-1 rounded w-full"
                        rows={3}
                    />
                </div>

                <div className="flex items-center justify-between mt-4">
                    <button
                        type="submit"
                        className="px-6 py-2 bg-purple-700 text-white font-semibold rounded-md hover:bg-purple-800"
                    >
                        Change Game
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="px-6 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-800"
                    >
                        Delete Game
                    </button>
                </div>
            </form>
        </div>
    )
}