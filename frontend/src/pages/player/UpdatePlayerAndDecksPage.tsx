import { type ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { computeColorsFromCommanders } from "../../services/scryfall.ts";
import { AutocompleteInput } from "../../components/AutocompleteInput.tsx";

interface Player {
    id: number;
    name: string;
    isRetired: boolean;
}

interface PlayerUpdateDTO {
    id: number;
    newName: string;
    isRetired: boolean;
}

interface DeckDTO {
    deckId: number;
    commanders: string[];
    deckName: string;
    colors: string;
    retired: boolean;
}

export default function UpdatePlayerAndDecksPage() {
    const [players, setPlayers] = useState<Player[]>([]);
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
    const [newName, setNewName] = useState("");
    const [decks, setDecks] = useState<DeckDTO[]>([]);
    const [editingDeckId, setEditingDeckId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState({
        deckName: "",
        commanders: [] as string[],
        colors: ""
    });

    useEffect(() => {
        axios.get<Player[]>("/api/players")
            .then(response => {
                setPlayers(Array.isArray(response.data) ? response.data : []);
            });
    }, []);

    useEffect(() => {
        if (!selectedPlayer) {
            setDecks([]);
            return;
        }

        const toasty = toast.loading("Loading decks...");
        axios.get(`/api/players/${selectedPlayer.id}/decks`)
            .then(response => {
                toast.update(toasty, {
                    render: "Decks loaded",
                    type: "success",
                    isLoading: false,
                    autoClose: 2000
                });
                setDecks(Array.isArray(response.data) ? response.data : Object.values(response.data));
            })
            .catch(() => {
                toast.update(toasty, {
                    render: "Error loading decks",
                    type: "error",
                    isLoading: false,
                    autoClose: 3000
                });
            });
    }, [selectedPlayer]);


    function onChangeHandlerPlayer(e: ChangeEvent<HTMLSelectElement>) {
        const val = e.target.value;
        if (!val) {
            setSelectedPlayer(null);
            return;
        }
        const id = Number(val);
        if (isNaN(id)) {
            setSelectedPlayer(null);
            return;
        }

        const toasty = toast.loading("Please wait...");
        axios.get(`/api/players/${id}`)
            .then(response => {
                toast.update(toasty, {
                    render: "Player loaded",
                    type: "success",
                    isLoading: false,
                    autoClose: 2000
                });
                setSelectedPlayer({
                    id: response.data.id,
                    name: response.data.name,
                    isRetired: response.data.isRetired
                });
            })
            .catch(() => {
                toast.update(toasty, {
                    render: "Error",
                    type: "error",
                    isLoading: false,
                    autoClose: 3000
                });
            });
    }

    function updatePlayer(newName: string) {
        if (!selectedPlayer) return;

        const playerUpdateDTO: PlayerUpdateDTO = {
            id: selectedPlayer.id,
            newName: newName,
            isRetired: selectedPlayer.isRetired
        };

        const toasty = toast.loading("Updating player...");
        axios.post('/api/players/update', playerUpdateDTO)
            .then(response => {
                toast.update(toasty, {
                    render: "Player updated",
                    type: "success",
                    isLoading: false,
                    autoClose: 2000
                });

                const updatedPlayer: Player = response.data;

                setPlayers(prev =>
                    prev.map(p => p.id === updatedPlayer.id ? updatedPlayer : p)
                );

                setSelectedPlayer(updatedPlayer);
                setNewName("");
            })
            .catch(() => {
                toast.update(toasty, {
                    render: "Error",
                    type: "error",
                    isLoading: false,
                    autoClose: 3000
                });
            });
    }

    function handleChangeDeck(deck: DeckDTO) {
        setEditingDeckId(deck.deckId);
        setEditForm({
            deckName: deck.deckName,
            commanders: deck.commanders ?? [],
            colors: deck.colors
        });
    }

    async function saveDeck(deckId: number) {
        if (editForm.commanders == null) return;

        let newColors = editForm.colors ?? "";
        if (!newColors.trim()) {
            newColors = await computeColorsFromCommanders(editForm.commanders!);
        }

        setEditForm(prev => ({ ...prev, commanders: prev.commanders.filter(Boolean) }));

        const dto = {
            deckId,
            deckName: editForm.deckName!,
            commanders: editForm.commanders!,
            colors: newColors
        };

        const toasty = toast.loading("Saving deck...");
        axios.put(`/api/decks/${deckId}`, dto)
            .then(response => {
                toast.update(toasty, {
                    render: "Deck updated",
                    type: "success",
                    isLoading: false,
                    autoClose: 2000
                });

                setDecks(prev =>
                    prev.map(d => d.deckId === deckId ? response.data : d)
                );

                setEditingDeckId(null);
            })
            .catch(() => {
                toast.update(toasty, {
                    render: "Error saving deck",
                    type: "error",
                    isLoading: false,
                    autoClose: 3000
                });
            });
        computeColorsFromCommanders(editForm.commanders).then(colors => {
            setEditForm(prev => ({ ...prev, colors }));
        });
    }

    return (
        <div className="p-6 space-y-6">
            <h3 className="text-xl font-semibold text-purple-800 space-x-6">
                Update deck or player name
            </h3>
            <div>
                Misspelled a player name? No Problem.
                Something in your deck data is wrong? Also no Problem.
            </div>
            <div className="space-y-2">
                <label>Select Player</label>
                <select
                    value={selectedPlayer?.id ?? ""}
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

            {selectedPlayer ?
                <form
                    onSubmit={e => {
                        e.preventDefault();
                        updatePlayer(newName);
                    }}
                    className="space-x-2"
                >
                    <label>New name</label>
                    <input
                        value={newName}
                        onChange={e => setNewName(e.target.value)}
                        className="border p-2 rounded"
                    />
                    <button
                        type="submit"
                        className="bg-purple-700 text-white px-4 py-2 rounded"
                    >
                        Update
                    </button>
                </form>
            : null}

            {editingDeckId ?
                <div className="p-4 border rounded bg-gray-50 space-y-3">
                    <h3 className="text-lg font-bold">
                        Edit Deck
                    </h3>

                    <div className="flex flex-col space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            Deck Name
                        </label>
                        <input
                            type="text"
                            value={editForm.deckName}
                            onChange={e =>
                                setEditForm(prev => ({ ...prev, deckName: e.target.value }))
                            }
                            className="border p-2 rounded max-w-2xl"
                        />
                    </div>

                    <div className="flex flex-col space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            Commanders
                        </label>
                        <div className="flex items-center space-x-2">
                            <AutocompleteInput
                                value={editForm.commanders?.[0] ?? ""}
                                onChange={val =>
                                    setEditForm(prev => ({ ...prev, commanders: [val, prev.commanders?.[1] ?? ""] }))
                                }
                                className="w-full max-w-[240px]"
                            />
                            <span className="text-gray-500">//</span>
                            <AutocompleteInput
                                value={editForm.commanders?.[1] ?? ""}
                                onChange={val =>
                                    setEditForm(prev => ({ ...prev, commanders: [prev.commanders?.[0] ?? "", val] }))
                                }
                                className="w-full max-w-[240px]"
                            />
                        </div>
                    </div>


                    <div className="flex flex-col space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            Colors (automatic fill)
                        </label>
                        <input
                            type="text"
                            value={editForm.colors ?? ""}
                            readOnly
                            className="border p-2 rounded bg-gray-100 max-w-2xl"
                        />
                    </div>

                    <div className="space-x-2">
                        <button
                            className="bg-green-600 text-white px-4 py-2 rounded"
                            onClick={() => saveDeck(editingDeckId)}
                        >
                            Save
                        </button>
                        <button
                            className="bg-gray-400 text-white px-4 py-2 rounded"
                            onClick={() => setEditingDeckId(null)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            : null}

            {decks.length > 0 ?
                <table className="min-w-full border-collapse border border-gray-300">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="border px-4 py-2">Commanders</th>
                        <th className="border px-4 py-2">Colors</th>
                        <th className="border px-4 py-2">Deck Name</th>
                        <th className="border px-4 py-2">Status</th>
                        <th className="border px-4 py-2">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {decks.map(deck => (
                        <tr key={deck.deckId}>
                            <td className="border px-4 py-2">
                                {deck.commanders?.join(" // ") ?? ""}
                            </td>
                            <td className="border px-4 py-2">{deck.colors}</td>
                            <td className="border px-4 py-2">{deck.deckName}</td>
                            <td className="border px-4 py-2">{deck.retired ? "Retired" : "Active"}</td>
                            <td className="border px-4 py-2">
                                <button
                                    className="bg-purple-700 text-white px-4 py-2 rounded"
                                    onClick={() => handleChangeDeck(deck)}
                                >
                                    Edit Deck
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            : null}
        </div>
    );
}
