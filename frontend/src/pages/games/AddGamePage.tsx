import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import api from "@/api/axiosConfig";
import { toast } from "react-toastify";
import DeckOptionsForPlayer from "../../components/DeckOptionsForPlayer.tsx";
import PlayerSelect from "../../components/PlayerSelect.tsx";
import { useNavigate } from "react-router-dom";
import { usePlayers } from "../../hooks/usePlayers.ts";

interface ParticipantInput {
    playerId?: number;
    deckId?: number;
    isWinner: boolean;
    notes?: string;
    turnOrder: number;
}

interface PlayerGroup {
    id: number;
    name: string;
}

export default function AddGamePage() {

    const { players } = usePlayers();

    const [groups, setGroups] = useState<PlayerGroup[]>([]);
    const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

    const [participants, setParticipants] = useState<ParticipantInput[]>([]);
    const [numberOfPlayers, setNumberOfPlayers] = useState<number>(4);
    const [firstKillTurn, setFirstKillTurn] = useState<number>(0);
    const [lastTurn, setLastTurn] = useState<number>(0);
    const [comment, setComment] = useState("");
    const [date, setDate] = useState<string>(
        new Date().toISOString().split("T")[0]
    );

    const navigate = useNavigate();

    useEffect(() => {
        api.get<PlayerGroup[]>("/api/groups")
            .then(res => setGroups(res.data))
            .catch(err => console.error("Error loading groups:", err));
    }, []);

    useEffect(() => {
        if (groups.length > 0 && selectedGroupId === null) {
            setSelectedGroupId(groups[0].id);
        }
    }, [groups]);

    useEffect(() => {
        setParticipants(prev => {
            const copy = [...prev];

            while (copy.length < numberOfPlayers) {
                copy.push({
                    playerId: undefined,
                    deckId: undefined,
                    isWinner: false,
                    notes: "",
                    turnOrder: 0
                });
            }

            return copy.slice(0, numberOfPlayers);
        });
    }, [numberOfPlayers]);

    function isDuplicateTurnOrder(value: number, index: number) {
        if (value === 0) return false;

        return participants.some(
            (p, i) => i !== index && p.turnOrder === value
        );
    }
    function validateTurnOrder(): boolean {
        const values = participants.map(p => p.turnOrder ?? 0);

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
        setParticipants(prev => {
            const copy = [...prev];
            copy[index] = { ...copy[index], ...patch };
            return copy;
        });
    }

    function handleNumberChange(e: ChangeEvent<HTMLInputElement>) {
        const val = Number(e.target.value);
        if (val >= 1) setNumberOfPlayers(val);
    }

    function handleFirstTurnKillChange(e: ChangeEvent<HTMLInputElement>) {
        const val = Number(e.target.value);
        if (val >= 0) setFirstKillTurn(val);
    }

    function handleLastTurnChange(e: ChangeEvent<HTMLInputElement>) {
        const val = Number(e.target.value);
        if (val >= 0) setLastTurn(val);
    }

    function handlePlayerChange(index: number, playerId: number) {
        updateParticipant(index, {
            playerId,
            deckId: undefined
        });
    }

    function handleDeckChange(index: number, deckId: number) {
        updateParticipant(index, { deckId });
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const toasty = toast.loading("Submitting game...");

        if (participants.some(p => !p.playerId || !p.deckId)) {
            toast.update(toasty, {
                render: "Please select player and deck for all participants",
                type: "error",
                isLoading: false
            });
            return;
        }
        if (!validateTurnOrder()) {
            toast.update(toasty, {
                render: "Turn order must be either all 0 or all unique numbers",
                type: "error",
                isLoading: false,
                autoClose: 3000
            });
            return;
        }

        const body = {
            date,
            notes: comment,
            groupId: selectedGroupId,
            participants: participants.map(p => ({
                playerId: p.playerId!,
                deckId: p.deckId!,
                isWinner: p.isWinner,
                notes: p.notes,
                turnOrder: p.turnOrder
            })),
            firstKillTurn: firstKillTurn,
            lastTurn: lastTurn
        };

        api.post("/api/games", body)
            .then(() => {
                toast.update(toasty, {
                    render: "Game added!",
                    type: "success",
                    isLoading: false,
                    autoClose: 1500
                });

                setTimeout(() => navigate("/games"), 1500);
            })
            .catch(() => {
                toast.update(toasty, {
                    render: "Error saving game",
                    type: "error",
                    isLoading: false
                });
            });
    }

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-2xl font-bold">Add Game</h2>

            <form onSubmit={handleSubmit} className="space-y-4">

                <div className="flex flex-wrap gap-6">

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Number of Players
                        </label>
                        <input
                            type="number"
                            min={2}
                            value={numberOfPlayers}
                            onChange={handleNumberChange}
                            className="border px-2 py-1 rounded w-20"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Group played in
                        </label>
                        <select
                            value={selectedGroupId ?? ""}
                            onChange={e =>
                                setSelectedGroupId(Number(e.target.value))
                            }
                            className="border px-3 py-2 rounded-md"
                        >
                            {groups.map(g => (
                                <option key={g.id} value={g.id}>
                                    {g.name}
                                </option>
                            ))}
                        </select>
                    </div>

                </div>

                {participants.map((p, idx) => (
                    <div key={idx} className="flex gap-4 items-start">
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
                                        turnOrder: Number(e.target.value)
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
                                onChange={e =>
                                    updateParticipant(idx, {
                                        isWinner: e.target.checked
                                    })
                                }
                                className="mr-2"
                            />
                            Winner
                        </div>

                        <div className="w-2/5">
                            <PlayerSelect
                                players={players}
                                value={p.playerId}
                                onChange={id =>
                                    handlePlayerChange(idx, id!)
                                }
                            />
                        </div>

                        <div className="w-2/5">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Played Deck
                            </label>

                            <select
                                value={p.deckId ?? ""}
                                onChange={e =>
                                    handleDeckChange(
                                        idx,
                                        Number(e.target.value)
                                    )
                                }
                                disabled={!p.playerId}
                                className="border px-2 py-1 rounded w-full"
                            >
                                <option value="">-- Select Deck --</option>
                                {p.playerId &&
                                    <DeckOptionsForPlayer
                                        playerId={p.playerId}
                                    />
                                }
                            </select>
                        </div>

                        <div className="w-full">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Notes
                            </label>

                            <textarea
                                value={p.notes ?? ""}
                                onChange={e =>
                                    updateParticipant(idx, {
                                        notes: e.target.value
                                    })
                                }
                                className="border px-2 py-1 rounded w-full"
                                rows={2}
                                placeholder="Optional notes..."
                            />
                        </div>

                    </div>
                ))}

                <div className="flex flex-wrap gap-6">
                    <label className="block text-sm mb-1">Date</label>
                    <input
                        type="date"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        className="border px-2 py-1 rounded"
                    />

                    <label className="block text-sm font-medium text-gray-700 mb-2">Turn of first kill</label>
                    <input
                        type="number"
                        min={0}
                        value={firstKillTurn}
                        onChange={handleFirstTurnKillChange}
                        className="border px-2 py-1 rounded w-20"
                    />

                    <label className="block text-sm font-medium text-gray-700 mb-2">Last turn</label>
                    <input
                        type="number"
                        min={0}
                        value={lastTurn}
                        onChange={handleLastTurnChange}
                        className="border px-2 py-1 rounded w-20"
                    />
                    0 means not recorded
                </div>

                <div>
                    <label className="block text-sm mb-1">
                        Game Comment
                    </label>
                    <textarea
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        className="border px-2 py-1 rounded w-full"
                        rows={3}
                    />
                </div>

                <button
                    type="submit"
                    className="px-6 py-2 bg-purple-700 text-white rounded hover:bg-purple-800"
                >
                    Add Game
                </button>

            </form>
        </div>
    );
}
