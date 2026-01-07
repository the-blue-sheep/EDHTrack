import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import DeckOptionsForPlayer from '../../components/DeckOptionsForPlayer.tsx'
import { useNavigate } from "react-router-dom";

interface Player {
    id: number;
    name: string;
}

interface ParticipantInput {
    playerId?: number;
    deckId?: number;
    isWinner: boolean;
}

export default function AddGamePage() {
    const [players, setPlayers] = useState<Player[]>([]);
    const [participants, setParticipants] = useState<ParticipantInput[]>([]);
    const [numberOfPlayers, setNumberOfPlayers] = useState<number>(4);
    const [comment, setComment] = useState("");
    const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get<Player[]>("/api/players")
            .then(res => setPlayers(res.data))
            .catch(err => console.error("Error loading players:", err));
    }, []);

    // Array Länge passend zur Spieleranzahl
    useEffect(() => {
        setParticipants(prev => {
            const copy = [...prev];
            while (copy.length < numberOfPlayers) {
                copy.push({ playerId: undefined, deckId: undefined, isWinner: false });
            }
            while (copy.length > numberOfPlayers) {
                copy.pop();
            }
            return copy;
        });
    }, [numberOfPlayers]);

    function handleNumberChange(e: ChangeEvent<HTMLInputElement>) {
        const val = Number(e.target.value);
        if (val >= 1) setNumberOfPlayers(val);
    }

    function handlePlayerChange(index: number, playerId: number) {
        setParticipants(prev => {
            const copy = [...prev];
            copy[index] = { ...copy[index], playerId, deckId: undefined };
            return copy;
        });
    }

    function handleDeckChange(index: number, deckId: number) {
        setParticipants(prev => {
            const copy = [...prev];
            copy[index] = { ...copy[index], deckId };
            return copy;
        });
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const toasty = toast.loading("Submitting game...");

        if (participants.some(p => !p.playerId || !p.deckId)) {
            toast.update(toasty, {
                render: "Please select player and deck for all participants",
                type: "error",
                isLoading: false,
                autoClose: 3000
            });
            return;
        }

        const body = {
            date,
            notes: comment,
            participants: participants.map(p => ({
                playerId: p.playerId!,
                deckId: p.deckId!,
                isWinner: p.isWinner
            }))
        };

        axios.post("/api/games", body)
            .then(() => {
                toast.update(toasty, {
                    render: "Game added!",
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

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-2xl font-bold">Add Game</h2>

            <form onSubmit={handleSubmit} className="space-y-4">

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Players
                    </label>
                    <input
                        type="number"
                        min={1}
                        value={numberOfPlayers}
                        onChange={handleNumberChange}
                        className="border px-2 py-1 rounded w-20"
                    />
                </div>

                {participants.map((p, idx) => (
                    <div key={idx} className="flex items-center gap-4 mb-2">

                        <div className="flex items-center w-1/6">
                            <input
                                type="checkbox"
                                checked={p.isWinner}
                                onChange={e => {
                                    const checked = e.target.checked;
                                    setParticipants(prev => {
                                        const copy = [...prev];
                                        copy[idx] = { ...copy[idx], isWinner: checked };
                                        return copy;
                                    });
                                }}
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
                                onChange={e => handlePlayerChange(idx, Number(e.target.value))}
                                className="border px-2 py-1 rounded w-full"
                            >
                                <option value="">-- Select Player --</option>
                                {players.map(player => (
                                    <option key={player.id} value={player.id}>
                                        {player.name}
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
                                onChange={e => handleDeckChange(idx, Number(e.target.value))}
                                disabled={!p.playerId}
                                className="border px-2 py-1 rounded w-full"
                            >
                                <option value="">-- Select Deck --</option>
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
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        className="border px-2 py-1 rounded"
                    />
                </div>

                <div>
                    <label className="min-w-[320px] max-w-2xl border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500">Comment</label>
                    <textarea
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        className="border px-2 py-1 rounded w-full"
                        rows={3}
                    />
                </div>

                <button
                    type="submit"
                    className="px-6 py-2 bg-purple-700 text-white font-semibold rounded-md hover:bg-purple-800"
                >
                    Add Game
                </button>

            </form>
        </div>
    );
}
