import {type ChangeEvent, useEffect, useState} from "react";
import axios from "axios";
import {toast} from "react-toastify";

interface Player {
    id: number;
    name: string;
    isRetired: boolean;
}

interface DeckDTO {
    deckId: number,
    commanders: string[],
    deckName: string,
    colors: string,
    retired: boolean,
}

interface RetirePlayerDTO {
    id: number;
    name: string;
    isRetired: boolean;
}

interface RetireDeckDTO {
    deckId: number;
    retired: boolean;
}

export default function RetirePage() {
    const [players, setPlayers] = useState<Player[]>([]);
    const [decks, setDecks] = useState<DeckDTO[]>([]);
    const [selectedPlayer, setSelectedPlayer] = useState<RetirePlayerDTO | null>(null);

    useEffect(() => {
        axios.get<Player[]>("/api/players")
            .then(response => {
                setPlayers(Array.isArray(response.data) ? response.data : []);
            })
            .catch(error => {
                console.error("Error while loading players:", error);
            });
    }, []);

    useEffect(() => {
        if (selectedPlayer === null) {
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
                    autoClose: 3000
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
            setDecks([]);
            return;
        }
        const id = val ? Number(val) : undefined;
        if (id == null) {
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
                    autoClose: 3000
                });

                const dto: RetirePlayerDTO = {
                    id: response.data.id,
                    name: response.data.name,
                    isRetired: response.data.isRetired
                };

                setSelectedPlayer(dto);
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

    function handleRetirePlayer() {
        if(selectedPlayer !== undefined) {
            const toasty = toast.loading("Please wait...");

            axios.post('/api/players/retire', selectedPlayer)
                .then((response) => {
                    toast.update(toasty, {render: "Player loaded", type: "success", isLoading: false, autoClose: 3000})
                    const updated = response.data as RetirePlayerDTO;
                    setSelectedPlayer(updated);
                })
                .catch(() => {toast.update(toasty, {render: "Error", type: "error", isLoading: false, autoClose: 3000})});
        }
    }

    function handleRetireDeck(deck: DeckDTO) {
        if(selectedPlayer !== null) {
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

    return (
        <div className="p-6">
            <h3 className="text-xl font-semibold text-purple-800 space-x-6">
                Retire Management
            </h3>
            <div>
                Retire a player or deck because they are no longer in your playgroup or you dissolved the deck.
                This is only relevant if you decide it is for the statistics.
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Player
                </label>
                <select
                    name="id"
                    id="player-select"
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
                {selectedPlayer ?
                    <p className="mt-2">
                        Status:{" "}
                        {selectedPlayer.isRetired
                            ? <span className="text-red-600">Retired</span>
                            : <span className="text-green-600">Active</span>
                        }
                    </p>
                : null}
            </div>
            <div className="mb-6">
            <button
                type="button"
                className="px-6 py-2 bg-purple-700 text-white font-semibold rounded-md hover:bg-purple-800 focus:ring-2 focus:ring-green-400"
                onClick={handleRetirePlayer}
            >
                <label>Change retire status</label>
            </button>
            </div>
            <div className="mb-6">
                <label className="block text-sm font-medium text-purple-900 mb-2">Decks from the selected Player</label>
            </div>
            <div className="mb-6">
                {decks.length > 0 ?
                    <table className="min-w-full border-collapse border border-gray-300">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">Commanders</th>
                            <th className="border border-gray-300 px-4 py-2">Colors</th>
                            <th className="border border-gray-300 px-4 py-2">Deck Name</th>
                            <th className="border border-gray-300 px-4 py-2">Status</th>
                            <th className="border border-gray-300 px-4 py-2">Retire Deck?</th>
                        </tr>
                        </thead>
                        <tbody>
                        {decks.map(deck => (
                            <tr key={deck.deckId}>
                                <td className="border border-gray-300 px-4 py-2">
                                    {Array.isArray(deck.commanders) ? deck.commanders.join(", ") : deck.commanders}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">{deck.colors}</td>
                                <td className="border border-gray-300 px-4 py-2">{deck.deckName}</td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {deck.retired ? "Retired" : "Active"}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    <button
                                        type="button"
                                        className="px-6 py-2 bg-purple-700 text-white font-semibold rounded-md hover:bg-purple-800 focus:ring-2 focus:ring-green-400"
                                        onClick={() => handleRetireDeck(deck)}
                                        >
                                        Change retire status
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                : null}
            </div>
        </div>
    );
}
