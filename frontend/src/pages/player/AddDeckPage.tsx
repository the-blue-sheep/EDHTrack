import axios from "axios";
import {useState, useEffect, type ChangeEvent, type FormEvent} from "react";
import { computeColorsFromCommanders } from "../../services/scryfall.ts";
import { toast } from "react-toastify";
import { AutocompleteInput } from "../../components/AutocompleteInput.tsx";

interface Player {
    id: number;
    name: string;
    isRetired: boolean;
}

interface CreateDeckDTO {
    playerId: number;
    commanders: string[];
    deckName: string;
    colors: string;
}

export default function AddDeckPage() {
    const [players, setPlayers] = useState<Player[]>([]);
    const [selectedPlayerId, setSelectedPlayerId] = useState<number | undefined>(undefined);
    const [formData, setFormData] = useState<CreateDeckDTO>({
        playerId: 0,
        commanders: ["", ""],
        deckName: "",
        colors: ""
    });

    useEffect(() => {
        axios.get<Player[]>("/api/players")
            .then(response => {
                setPlayers(Array.isArray(response.data) ? response.data : []);
            })
            .catch(error => {
                console.error("Error while loading players:", error);
            });
    }, []);

    function onChangeHandler(e: ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }
    function onChangeHandlerPlayer(e: ChangeEvent<HTMLSelectElement>) {
        const val = e.target.value;
        const id =  val ? Number(val) : undefined;
        setSelectedPlayerId(id);

        setFormData(prev => ({
            ...prev,
            playerId: id ?? 0
        }));
    }
    function onChangeHandleCommanders(index: number, value: string) {
        setFormData(prev => {
            const newCommanders = [...prev.commanders];
            newCommanders[index] = value;
            return {
                ...prev,
                commanders: newCommanders,
            };
        });
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const toasty = toast.loading("Please wait...");
        const commandersClean = formData.commanders.filter(Boolean);
        const computedColors = await computeColorsFromCommanders(commandersClean);

        const finalDTO = {
            ...formData,
            commanders: commandersClean,
            colors: computedColors
        };

        axios.post("/api/decks", finalDTO)
            .then(() => {toast.update(toasty, {render: "All is good", type: "success", isLoading: false, autoClose: 3000})
                setFormData({
                    playerId: 0,
                    commanders: ["", ""],
                    deckName: "",
                    colors: ""
                });
            })
            .catch(() => {toast.update(toasty, {render: "Error", type: "error", isLoading: false})});
    }

    if (players === null) {
        return <p>Loading players…</p>;
    }

    return (
        <div className="p-6">
            <h3 className="text-xl font-semibold text-purple-800 space-x-6">
                Add a new deck
            </h3>
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
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Commander
                    </label>
                    <AutocompleteInput
                        value={formData.commanders[0]}
                        onChange={val => onChangeHandleCommanders(0, val)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Partner / Background
                    </label>
                    <AutocompleteInput
                        value={formData.commanders[1]}
                        onChange={val => onChangeHandleCommanders(1, val)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Deckname
                    </label>
                    <input
                        name="deckName"
                        type="text"
                        value={formData.deckName}
                        onChange={onChangeHandler}
                        placeholder="Optional Deckname"
                        className="min-w-[320px] max-w-2xl border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                </div>

                <div>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-purple-700 text-white font-semibold rounded-md hover:bg-purple-800 focus:ring-2 focus:ring-green-400"
                    >
                        Add deck to player
                    </button>
                </div>
            </form>
        </div>
    );

}
