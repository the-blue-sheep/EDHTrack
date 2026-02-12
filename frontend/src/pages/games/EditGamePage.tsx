import {useParams} from "react-router-dom";
import {type ChangeEvent, type FormEvent, useEffect, useState} from "react";
import DeckOptionsForPlayer from "../../components/DeckOptionsForPlayer.tsx";
import api from "@/api/axiosConfig";
import { useNavigate } from "react-router-dom";
import {toast} from "react-toastify";

class GameEditDTO {
    gameId: number = 0;
    date: string = new Date().toISOString().split("T")[0];
    notes: string = "";
    firstKillTurn: number = 0;
    lastTurn: number = 0;
    participants: ParticipantInput[] = [];
}

interface ParticipantInput {
    playerId: number;
    playerName: string;
    deckId?: number;
    commander: string;
    deckName?: string;
    isWinner: boolean;
    notes?: string;
    turnOrder: number;
}

interface PlayerGroup {
    id: number;
    name: string;
}

export default function EditGamePage() {
    const { id } = useParams();
    const [groups, setGroups] = useState<PlayerGroup[]>([]);
    const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
    const [game, setGame] = useState<GameEditDTO>(new GameEditDTO());
    const [numberOfPlayers] = useState<number>();
    const navigate = useNavigate();

    useEffect(() => {
        api.get(`/api/games/${id}`)
            .then(r => setGame(r.data));

        api.get<PlayerGroup[]>("/api/groups")
            .then(res => setGroups(res.data))
            .catch(err => console.error("Error loading groups:", err));
    }, [id]);

    useEffect(() => {
        if (groups.length > 0 && selectedGroupId === undefined) {
            setSelectedGroupId(groups[0].id);
        }
    }, [groups]);

    function toggleWinner(index: number, isWinner: boolean) {
        setGame(prev => {
            if (!prev) return prev;
            const copy = [...prev.participants];
            copy[index] = { ...copy[index], isWinner };
            return { ...prev, participants: copy };
        });
    }

    function handleFirstKillTurnChange(e: ChangeEvent<HTMLInputElement>) {
        setGame(prev => ({
            ...prev,
            firstKillTurn: Number(e.target.value)
        }));
    }

    function handleLastTurnChange(e: ChangeEvent<HTMLInputElement>) {
        setGame(prev => ({
            ...prev,
            lastTurn: Number(e.target.value)
        }));
    }
    function isDuplicateTurnOrder(value: number, index: number) {
        if (value === 0) return false;

        return game.participants.some(
            (p, i) => i !== index && p.turnOrder === value
        );
    }
    function validateTurnOrder(): boolean {
        const values = game.participants.map(p => p.turnOrder ?? 0);

        const nonZero = values.filter(v => v !== 0);

        if (nonZero.length === 0) return true;

        if (values.some(v => v === 0)) return false;

        const unique = new Set(nonZero);
        return unique.size === nonZero.length;
    }
    function updateParticipant(
        index: number,
        patch: Partial<ParticipantInput>
    ) {
        setGame(prev => {
            if (!prev) return prev;

            const copy = [...prev.participants];
            copy[index] = { ...copy[index], ...patch };

            return { ...prev, participants: copy };
        });
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const toasty = toast.loading("Submitting game...");
        if (!validateTurnOrder()) {
            toast.update(toasty, {
                render: "Turn order must be either all 0 or all unique numbers",
                type: "error",
                isLoading: false,
                autoClose: 3000
            });
            return;
        }
        await api.put(`/api/games/${id}`, game)
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

        api.delete(`/api/games`, {params: {id: game.gameId}})
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

                    <div
                        key={idx}
                        className="flex gap-4 items-start"
                    >
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Turn Order
                            </label>
                            <input
                                type="number"
                                min={0}
                                max={numberOfPlayers}
                                value={p.turnOrder ?? 0}
                                onChange={e =>
                                    updateParticipant(idx, {
                                        turnOrder: Number(e.target.value) || 0
                                    })
                                }
                                className={`border px-2 py-1 rounded w-20 ${
                                    isDuplicateTurnOrder(p.turnOrder ?? 0, idx)
                                        ? "border-red-500 border-4"
                                        : ""
                                }`}

                            />
                        </div>
                        <div className="flex items-center mt-6">
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
                                Deck
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

                        <div className="w-full">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Notes
                            </label>
                            <textarea
                                value={p.notes ?? ""}
                                onChange={e => {
                                    const notes = e.target.value;
                                    setGame(prev => {
                                        if (!prev) return prev;
                                        const copy = [...prev.participants];
                                        copy[idx] = { ...copy[idx], notes };
                                        return { ...prev, participants: copy };
                                    });
                                }}
                                className="border rounded px-2 py-1 w-full"
                                rows={2}
                                placeholder="Optional notes..."
                            />
                        </div>

                    </div>
                ))}

                <div className="flex flex-wrap gap-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                        type="date"
                        value={game.date ?? ""}
                        onChange={e => setGame(prev => prev && { ...prev, date: e.target.value })}
                        className="border px-2 py-1 rounded"
                    />

                    <label className="block text-sm font-medium text-gray-700 mb-2">Turn of first kill</label>
                    <input
                        type="number"
                        min={0}
                        value={game.firstKillTurn ?? 0}
                        onChange={handleFirstKillTurnChange}
                        className="border px-2 py-1 rounded w-20"
                    />

                    <label className="block text-sm font-medium text-gray-700 mb-2">Last turn</label>
                    <input
                        type="number"
                        min={0}
                        value={game.lastTurn ?? 0}
                        onChange={handleLastTurnChange}
                        className="border px-2 py-1 rounded w-20"
                    />
                    0 means not recorded
                </div>

                <div>
                    <label className="min-w-[320px] max-w-2xl border border-gray-300 px-3 py-2 rounded-md  focus:ring-purple-500 focus:border-purple-500">
                        Comment
                    </label>
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
