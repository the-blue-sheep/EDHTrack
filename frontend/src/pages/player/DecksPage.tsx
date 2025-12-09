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

export default function decksPage() {
    const [players, setPlayers] = useState<Player[]>([]);
    const [decks, setDecks] = useState<DeckDTO[]>([]);
    const [selectedPlayerId, setSelectedPlayerId] = useState<number | undefined>(undefined);

    useEffect(() => {
        axios.get<Player[]>("/api/players")
            .then(response => {
                setPlayers(Array.isArray(response.data) ? response.data : []);
            })
            .catch(error => {
                console.error("Error while loading players:", error);
            });
    }, []);

    function onChangeHandlerPlayer(e: ChangeEvent<HTMLSelectElement>) {
        const val = e.target.value;
        const id =  val ? Number(val) : undefined;
        setSelectedPlayerId(id);
    }
    function handleLoadDecks() {
        if (selectedPlayerId !== undefined) {
            const toasty = toast.loading("Please wait...");
            axios.get(`/api/players/${selectedPlayerId}/decks`)
                .then(response => {
                    toast.update(toasty, { render: "All is good", type: "success", isLoading: false, autoClose: 3000 });
                    const data = response.data;
                    const decksArray = Array.isArray(data) ? data : Object.values(data);
                    setDecks(decksArray);
                    console.log(decksArray);
                })
                .catch(() => {
                    toast.update(toasty, { render: "Error", type: "error", isLoading: false });
                });
        } else {
            toast.error("You need to select a player...");
        }
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Player
                </label>
                <select
                    name="id"
                    id="player-select"
                    value={selectedPlayerId ?? ""}
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
                <button
                    onClick={handleLoadDecks}
                    className="px-6 py-2 bg-purple-700 text-white font-semibold rounded-md hover:bg-purple-800 focus:ring-2 focus:ring-green-400">
                    Load Decks
                </button>
            </div>
            <div className="mb-6">
                <label className="block text-sm font-medium text-purple-900 mb-2">Decks the selected Player has played</label>
            </div>
            <div className="mb-6">
                {decks.length > 0 && (
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
                            <tr key={deck.deckId}>
                                                                <td className="border border-gray-300 px-4 py-2">
                                    {Array.isArray(deck.commanders) ? deck.commanders.join(", ") : deck.commanders}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">{deck.colors}</td>
                                <td className="border border-gray-300 px-4 py-2">{deck.deckName}</td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {deck.retired ? "Retired" : "Active"}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}