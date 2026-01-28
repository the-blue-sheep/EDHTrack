import axios from "axios";
import {useState, useEffect, type ChangeEvent, type FormEvent} from "react";
import { computeColorsFromCommanders } from "../../services/scryfall.ts";
import { toast } from "react-toastify";
import { AutocompleteInput } from "../../components/AutocompleteInput.tsx";
import PlayerSelect from "../../components/PlayerSelect.tsx";
import * as React from "react";
import {usePlayers} from "../../hooks/usePlayers.ts";

interface CreateDeckDTO {
    playerId: number;
    commanders: string[];
    deckName: string;
    colors: string;
    bracket: string;
}

interface BracketDTO {
    name: string;
    displayName: string;
}

export default function AddDeckPage() {
    const { players } = usePlayers();
    const [selectedPlayerId, setSelectedPlayerId] = useState<number | undefined>(undefined);
    const [formData, setFormData] = useState<CreateDeckDTO>({
        playerId: 0,
        commanders: ["", ""],
        deckName: "",
        colors: "",
        bracket: ""
    });
    const [brackets, setBrackets] = useState<BracketDTO[]>([]);

    useEffect(() => {
        axios.get<BracketDTO[]>("/api/decks/brackets")
            .then(res => setBrackets(res.data))
            .catch(() => console.error("Failed to load brackets"));
    }, []);

    function onChangeHandler(e: ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }
    function onChangeHandlerPlayer(playerId?: number) {
        const val = playerId;
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

    function onChangeHandleBracket(e: React.ChangeEvent<HTMLSelectElement>) {
        const value = e.target.value;
        setFormData(prev => ({
            ...prev,
            bracket: value
        }));
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
                    colors: "",
                    bracket: ""
                });
            })
            .catch(() => {toast.update(toasty, {render: "Error", type: "error", isLoading: false})});
    }

    if (players === null) {
        return <p>Loading players…</p>;
    }

    return (
        <div className="p-6">
            <h3 className="text-xl font-semibold text-purple-800 mb-6">
                Add a new deck
            </h3>

            <div className="mb-6">
                <PlayerSelect
                    players={players}
                    value={selectedPlayerId}
                    onChange={onChangeHandlerPlayer}
                />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Commander
                        </label>
                        <AutocompleteInput
                            value={formData.commanders[0]}
                            onChange={val => onChangeHandleCommanders(0, val)}
                        />
                    </div>

                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Partner / Background
                        </label>
                        <AutocompleteInput
                            value={formData.commanders[1]}
                            onChange={val => onChangeHandleCommanders(1, val)}
                        />
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Deckname
                        </label>
                        <input
                            name="deckName"
                            type="text"
                            value={formData.deckName}
                            onChange={onChangeHandler}
                            placeholder="Optional Deckname"
                            className="min-w-[200px] border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                    </div>

                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Bracket
                        </label>
                        <select
                            name="bracket"
                            value={formData.bracket}
                            onChange={onChangeHandleBracket}
                            className="min-w-[200px] border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        >
                            <option value="" disabled>Select bracket</option>
                            {brackets.map(b => (
                                <option key={b.name} value={b.name}>{b.displayName}</option>
                            ))}
                        </select>
                    </div>
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
