import {useEffect, useState} from "react";
import axios from "axios";
import {toast} from "react-toastify";
import PlayerSelect from "../../components/PlayerSelect.tsx";

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

interface RetireDeckDTO {
    deckId: number;
    retired: boolean;
}

interface RetirePlayerDTO {
    id: number;
    isRetired: boolean;
}

export default function decksPage() {
    const [players, setPlayers] = useState<Player[]>([]);
    const [decks, setDecks] = useState<DeckDTO[]>([]);
    const [selectedPlayerId, setSelectedPlayerId] = useState<number | undefined>(undefined);
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

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
        if (selectedPlayerId == null) return;

        const toasty = toast.loading("Loading decks...");

        axios.get(`/api/players/${selectedPlayerId}/decks`)
            .then(response => {
                const data = response.data;
                const decksArray = Array.isArray(data) ? data : Object.values(data);
                setDecks(decksArray);
                toast.update(toasty, {
                    render: "Decks loaded",
                    type: "success",
                    isLoading: false,
                    autoClose: 3000
                });
            })
            .catch(() => {
                toast.update(toasty, {
                    render: "Error loading decks",
                    type: "error",
                    isLoading: false
                });
            });

    }, [selectedPlayerId]);

    function onChangeHandlerPlayer(playerId?: number) {
        const val = playerId;
        const id = val ? Number(val) : undefined;

        setSelectedPlayerId(id);

        if (!id) {
            setSelectedPlayer(null);
            return;
        }

        axios.get(`/api/players/${id}`)
            .then(res => {
                setSelectedPlayer(res.data);
            })
            .catch(() => {
                toast.error("Failed to load player");
                setSelectedPlayer(null);
            });
    }

    function handleRetirePlayer() {
        if (selectedPlayerId === undefined || selectedPlayer === undefined) {
            return;
        }

        const toasty = toast.loading("Please wait...");

        const dto: RetirePlayerDTO = {
            id: selectedPlayerId,
            isRetired: !selectedPlayer?.isRetired
        };

        axios.post('/api/players/retire', dto)
            .then(res => {
                const updated = res.data as Player;

                setSelectedPlayer(updated);

                toast.update(toasty, {
                    render: "Player updated",
                    type: "success",
                    isLoading: false,
                    autoClose: 3000
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

    return (
        <div className="p-6">
            <h3 className="text-xl font-semibold text-purple-800 space-x-6">
                Show decks
            </h3>
            <div className="mb-6">
                <PlayerSelect
                    players={players}
                    value={selectedPlayerId}
                    onChange={onChangeHandlerPlayer}
                />
            </div>
            {selectedPlayerId && (
                <p className="mt-2">
                    Status:{" "}
                    {selectedPlayer?.isRetired
                        ? <span className="text-red-600">Retired</span>
                        : <span className="text-green-600">Active</span>
                    }
                </p>
            )}
            {selectedPlayerId && selectedPlayer && (<button
                type="button"
                className={`px-6 py-2 font-semibold rounded-md focus:ring-2 ${
                    selectedPlayer.isRetired
                        ? "bg-red-600 text-white hover:bg-red-700 focus:ring-red-400"
                        : "bg-purple-700 text-white hover:bg-purple-800 focus:ring-green-400"
                }`}
                onClick={handleRetirePlayer}
            >
                {selectedPlayer?.isRetired ? "Reactivate player" : "Retire player"}
            </button>
                )}
            <div className="mb-6">
                <label className="block text-sm font-medium text-purple-900 mb-2">Decks the selected Player has played</label>
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
                        </tr>
                        </thead>
                        <tbody>
                        {decks.map(deck => (
                            <tr key={deck.deckId}
                                className={deck.retired ? "bg-red-50" : ""}
                            >
                                <td className="border border-gray-300 px-4 py-2">
                                    {Array.isArray(deck.commanders) ? deck.commanders?.filter(Boolean).join(" // ") : deck.commanders}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">{deck.colors}</td>
                                <td className="border border-gray-300 px-4 py-2">{deck.deckName}</td>

                                <td className="border border-gray-300 px-4 py-2">

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
                            </tr>
                        ))}
                        </tbody>
                    </table>
                : null}
            </div>
        </div>
    )
}