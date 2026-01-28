import {toast} from "react-toastify";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import PlayerSelect from "../../components/PlayerSelect.tsx";
import {useEffect, useState} from "react";
import {usePlayers} from "../../hooks/usePlayers.ts";


interface DeckDTO {
    deckId: number,
    commanders: string[] | string,
    deckName: string,
    colors: string,
    retired: boolean,
}

export default function DeletePage() {
    const { players } = usePlayers();
    const [decks, setDecks] = useState<DeckDTO[]>([]);
    const [selectedPlayerId, setSelectedPlayerId] = useState<number | undefined>(undefined);
    const navigate = useNavigate();


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
        setSelectedPlayerId(playerId);
    }

    async function handleDelete() {
        if (!window.confirm("Are you sure you want to delete this player?")) return;
        if(decks.length > 0) {
            window.alert("Decks found. Not able to delete the player")
            return;
        }
        const toasty = toast.loading("Deleting game...");


        axios.delete(`/api/players/${selectedPlayerId}`)
            .then(() => {
                toast.update(toasty, {
                    render: "Player deleted!",
                    type: "success",
                    isLoading: false,
                    autoClose: 1500
                });

                setTimeout(() => {
                    navigate("/players");
                }, 1500);
            })
            .catch(() => toast.update(toasty, {
                render: "Error deleting player!",
                type: "error",
                isLoading: false
            }));

    }

    async function handleDeleteDeck( deckId: number) {
        if (!window.confirm("Are you sure you want to delete this deck?")) return;
        const toasty = toast.loading("Deleting deck...");
        axios.delete(`/api/decks/${deckId}`)
            .then(() => {
                toast.update(toasty, {
                    render: "Deleting deck!",
                    type: "success",
                    isLoading: false,
                    autoClose: 1500
                })
                setTimeout(() => {
                    navigate("/players");
                }, 1500);
            })
            .catch(() => {
                toast.update(toasty, {
                    render: "Error deleting deck!",
                    type: "error",
                    isLoading: false,
                    autoClose: 1500
                })
                window.alert("Error deleting deck! Is it still part of games?")
            })
    }

    return (
        <div className="p-6">
            <h3 className="text-xl font-semibold text-purple-800 space-x-6">
                Delete Page
            </h3>
            <div className="mb-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-red-800 rounded-md">
                <p>You can only delete decks if they are not part of a game.</p>
                <p className="mt-2">You can only delete players if they have no decks.</p>
            </div>

            <div className="flex flex-auto gap-6">
                <div className="mb-6">
                    <PlayerSelect
                        players={players}
                        value={selectedPlayerId}
                        onChange={onChangeHandlerPlayer}
                    />
                </div>

                {selectedPlayerId ?
                    <div className="mb-6">
                        <label className="block text-sm text-transparent invisible mb-2">You can't see me!</label>
                        <button
                        type="button"
                        onClick={handleDelete}
                        className="px-6 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-800"
                        >
                            Delete Player
                        </button>
                    </div>
                    : null}
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
                            <tr key={deck.deckId}>
                                <td className="border border-gray-300 px-4 py-2">
                                    {Array.isArray(deck.commanders) ? deck.commanders?.filter(Boolean).join(" // ") : deck.commanders}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">{deck.colors}</td>
                                <td className="border border-gray-300 px-4 py-2">{deck.deckName}</td>

                                <td className="border border-gray-300 px-4 py-2">

                                    <button
                                        type="button"
                                        className="px-6 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-800"
                                        onClick={() => handleDeleteDeck(deck.deckId)}
                                    >
                                        Delete
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