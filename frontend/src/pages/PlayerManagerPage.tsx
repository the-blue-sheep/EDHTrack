import axios from "axios";
import {useState, useEffect, type ChangeEvent, type FormEvent} from "react";
import { useAutocomplete } from "../hooks/useAutocomplete";
import { computeColorsFromCommanders } from "../services/scryfall";

interface Player {
    id: number;
    name: string;
    isRetired: boolean;
}

interface CreateDeckDTO {
    playerId: number;
    commanders: string[];
    deckname: string;
    colors: string;
}

export default function PlayerManagerPage() {
    const [players, setPlayers] = useState<Player[]>([]);
    const [selectedPlayerId, setSelectedPlayerId] = useState<number | undefined>(undefined);
    const [formData, setFormData] = useState<CreateDeckDTO>({
        playerId: 0,
        commanders: ["", ""],
        deckname: "",
        colors: ""
    });

    const { results: results0, clearResults: clearResults0, reopenResults: reopenResults0 } = useAutocomplete(formData.commanders[0]);
    const { results: results1, clearResults: clearResults1, reopenResults: reopenResults1 } = useAutocomplete(formData.commanders[1]);

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
        setSelectedPlayerId(val ? Number(val) : undefined);
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

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const computedColors = computeColorsFromCommanders(formData.commanders);
        const finalDTO = {
            ...formData,
            colors: computedColors
        };
        console.log("Submitting deck:", finalDTO);
        axios.post("/api/decks", finalDTO)
            .then(response => {console.log (response.data);})
            .catch(error => {console.log("Error during create Deck: ", error)});
    }

    if (players === null) {
        return <p>Loading players…</p>;
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
            </div>

            <h3 className="text-xl font-semibold text-purple-800 mb-4">
                Add Deck
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Commander
                    </label>
                    <input
                        name="commander0"
                        type="text"
                        value={formData.commanders[0]}
                        onChange={e => onChangeHandleCommanders(0, e.target.value)}
                        onFocus={reopenResults0}
                        onBlur={clearResults0}
                        placeholder="Search for commander..."
                        className="min-w-[320px] max-w-2xl border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                    {results0.length > 0 && (
                        <ul className="border mt-1 bg-white max-h-40 overflow-y-auto rounded-md">
                            {results0.map(name => (
                                <li
                                    key={name}
                                    onMouseDown={() => {
                                        onChangeHandleCommanders(0, name);
                                        clearResults0();
                                    }}
                                    className="px-3 py-2 hover:bg-green-100 cursor-pointer"
                                >
                                    {name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Partner / Background
                    </label>
                    <input
                        name="commander1"
                        type="text"
                        value={formData.commanders[1]}
                        onChange={e => onChangeHandleCommanders(1, e.target.value)}
                        onFocus={reopenResults1}
                        onBlur={clearResults1}
                        placeholder="Optional"
                        className="min-w-[320px] max-w-2xl border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                    {results1.length > 0 && (
                        <ul className="border mt-1 bg-white max-h-40 overflow-y-auto rounded-md">
                            {results1.map(name => (
                                <li
                                    key={name}
                                    onMouseDown={() => {
                                        onChangeHandleCommanders(1, name);
                                        clearResults1();
                                    }}
                                    className="px-3 py-2 hover:bg-green-100 cursor-pointer"
                                >
                                    {name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Deckname
                    </label>
                    <input
                        name="deckname"
                        type="text"
                        value={formData.deckname}
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
