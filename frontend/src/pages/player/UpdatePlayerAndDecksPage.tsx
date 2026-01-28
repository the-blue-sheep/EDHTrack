import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { computeColorsFromCommanders } from "../../services/scryfall.ts";
import { AutocompleteInput } from "../../components/AutocompleteInput.tsx";
import PlayerSelect from "../../components/PlayerSelect.tsx";
import * as React from "react";
import { BRACKET_LABELS } from "../../utils.ts"

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
    bracket: string;
    retired: boolean;
}

interface RetireDeckDTO {
    deckId: number;
    retired: boolean;
}

interface BracketDTO {
    name: string;
    displayName: string;
}

export default function UpdatePlayerAndDecksPage() {
    const [players, setPlayers] = useState<Player[]>([]); //Kein Custom hook weil setPlayers hier auch anderweitig verwendet wird
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
    const [selectedPlayerId, setSelectedPlayerId] = useState<number | undefined>(undefined);
    const [newName, setNewName] = useState("");
    const [decks, setDecks] = useState<DeckDTO[]>([]);
    const [editingDeckId, setEditingDeckId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState({
        deckName: "",
        commanders: [] as string[],
        colors: "",
        bracket: ""
    });
    const [brackets, setBrackets] = useState<BracketDTO[]>([]);

    useEffect(() => {
        axios.get<Player[]>("/api/players")
            .then(response => {
                setPlayers(Array.isArray(response.data) ? response.data : []);
            });

        axios.get<BracketDTO[]>("/api/decks/brackets")
            .then(res => setBrackets(res.data))
            .catch(() => console.error("Failed to load brackets"));
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

    useEffect(() => {
        if (!selectedPlayerId) {
            setSelectedPlayer(null);
            return;
        }

        const toasty = toast.loading("Loading player...");
        axios.get<Player>(`/api/players/${selectedPlayerId}`)
            .then(response => {
                setSelectedPlayer(response.data);
                toast.update(toasty, {
                    render: "Player loaded",
                    type: "success",
                    isLoading: false,
                    autoClose: 2000
                });
            })
            .catch(() => {
                toast.update(toasty, {
                    render: "Error loading player",
                    type: "error",
                    isLoading: false,
                    autoClose: 3000
                });
            });
    }, [selectedPlayerId]);


    function onChangeHandlerPlayer(playerId?: number) {
        setSelectedPlayerId(playerId);
    }

    function handleRetireDeck(deck: DeckDTO) {
        if(selectedPlayerId !== null) {
            const retireDeckDTO: RetireDeckDTO = {
                deckId: deck.deckId,
                retired: deck.retired
            }

            const toasty = toast.loading("Please wait...");

            axios.post('/api/decks/retire', retireDeckDTO)
                .then(res => {
                    const updatedDeck = res.data;
                    setDecks(prev =>
                        prev.map(d => d.deckId === updatedDeck.deckId ? updatedDeck : d)
                    );
                    toast.update(toasty, { render: "Retire status changed", type: "success", isLoading: false, autoClose: 3000 });
                })
                .catch(() => {toast.update(toasty, {render: "Error", type: "error", isLoading: false, autoClose: 3000})});
        }
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
            colors: deck.colors,
            bracket: deck.bracket
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
            colors: newColors,
            bracket: editForm.bracket
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

    function onChangeHandleBracket(e: React.ChangeEvent<HTMLSelectElement>) {
        const value = e.target.value;
        setEditForm(prev => ({
            ...prev,
            bracket: value
        }));
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
                <PlayerSelect
                    players={players}
                    value={selectedPlayerId}
                    onChange={onChangeHandlerPlayer}
                />
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

                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Bracket
                        </label>
                        <select
                            name="bracket"
                            value={editForm.bracket}
                            onChange={onChangeHandleBracket}
                            className="min-w-[200px] border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        >
                            <option value="" disabled>Select bracket</option>
                            {brackets.map(b => (
                                <option key={b.name} value={b.name}>{b.displayName}</option>
                            ))}
                        </select>
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
                        <th className="border px-4 py-2">Bracket</th>
                        <th className="border px-4 py-2">Status</th>
                        <th className="border px-4 py-2">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {decks.map(deck => (
                        <tr key={deck.deckId}
                            className={deck.retired ? "bg-red-50" : ""}
                        >
                            <td className="border px-4 py-2">
                                {deck.commanders?.join(" // ") ?? ""}
                            </td>
                            <td className="border px-4 py-2">{deck.colors}</td>
                            <td className="border px-4 py-2">{deck.deckName}</td>
                            <td className="border px-4 py-2">
                                {BRACKET_LABELS[deck.bracket] ?? deck.bracket}
                            </td>
                            <td className="border px-4 py-2">
                                <button
                                    type="button"
                                    className={`px-6 py-2 font-semibold rounded-md focus:ring-2 ${
                                        deck.retired
                                            ? "bg-red-600 text-white hover:bg-red-700 focus:ring-red-400"
                                            : "bg-purple-700 text-white hover:bg-purple-800 focus:ring-green-400"
                                    }`}
                                    onClick={() => handleRetireDeck(deck)}
                                >
                                    {deck.retired ? "Retired" : "Active"}
                                </button>
                            </td>
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
