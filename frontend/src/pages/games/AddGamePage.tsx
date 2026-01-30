import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
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

    const [comment, setComment] = useState("");
    const [date, setDate] = useState<string>(
        new Date().toISOString().split("T")[0]
    );

    const navigate = useNavigate();

    useEffect(() => {
        axios.get<PlayerGroup[]>("/api/groups")
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
                    notes: ""
                });
            }

            return copy.slice(0, numberOfPlayers);
        });
    }, [numberOfPlayers]);

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

        const body = {
            date,
            notes: comment,
            groupId: selectedGroupId,
            participants: participants.map(p => ({
                playerId: p.playerId!,
                deckId: p.deckId!,
                isWinner: p.isWinner,
                notes: p.notes
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
                            min={1}
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

                {/* Date */}
                <div>
                    <label className="block text-sm mb-1">Date</label>
                    <input
                        type="date"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        className="border px-2 py-1 rounded"
                    />
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
