import axios from "axios";
import {useState, useEffect, type ChangeEvent, type FormEvent} from "react";

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
    const WUBRG = ["W","U","B","R","G"];
    const [input, setInput] = useState("");
    const [debouncedInput, setDebouncedInput] = useState(input);
    const [results, setResults] = useState<string[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);
    const [selectedPlayerId, setSelectedPlayerId] = useState<number | undefined>(undefined);
    const [formData, setFormData] = useState<CreateDeckDTO>({
        playerId: 0,
        commanders: ["", ""],
        deckname: "",
        colors: ""
    });

    // Scryfall verlangt ein Delay zwischen den Anfragen von 50-100 Millisekunden
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedInput(input.trim());
        }, 80);

        return () => {
            clearTimeout(handler);
        };
    }, [input]);

    useEffect(() => {
        if (debouncedInput === "") {
            setResults([]);
            return;
        }
        axios
            .get("https://api.scryfall.com/cards/autocomplete", {
                headers: {
                    Accept: "*/*",
                    "User-Agent": "EDHTrack/0.4"
                },
                params: {
                    q: debouncedInput,
                },
            })
            .then((response) => {
                const names: string[] = response.data.data || [];
                setResults(names);
            })
            .catch((_) => {
                setResults([]);
            });
    }, [debouncedInput]);

    useEffect(() => {
        axios.get<Player[]>("/api/players")
            .then(response => {
                setPlayers(Array.isArray(response.data) ? response.data : []);
            })
            .catch(error => {
                console.error("Error while loading players:", error);
            });
    }, []);

    async function getColorsForCommander(name: string): Promise<string> {
        try {
            const resp = await axios.get(`https://api.scryfall.com/cards/named`, {
                params: { exact: name },
                headers: {
                    "Accept": "application/json",
                    "User-Agent": "EDHTrack/0.4"
                }
            });
            const card = resp.data;
            const identity: string[] = card.color_identity || [];
            const unique = Array.from(new Set(identity));
            unique.sort((a,b) => WUBRG.indexOf(a) - WUBRG.indexOf(b));
            return unique.join("");
        } catch (error) {
            console.error("Error fetching commander colors: ", error);
            return "";
        }
    }


    function computeColorsFromCommanders(commanderNames: string[]): string {
        const allColors = commanderNames
            .flatMap(name => getColorsForCommander(name));

        // Commander können die gleichen Farben haben, daher unique
        const unique = [...new Set(allColors)];

        return unique.join("");
    }


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
        <>
            <h2>Player Administration</h2>

            <form onSubmit={handleSubmit}>
                <label>Select Player
                    <select
                        name="id"
                        id="player-select"
                        value={selectedPlayerId ?? ""}
                        onChange={onChangeHandlerPlayer}
                        className="border px-2 py-1 rounded"
                    >
                        <option value="">-- Select --</option>
                        {players.map(player => (
                            <option key={player.id} value={player.id}>
                                {player.name}
                            </option>
                        ))}
                    </select>
                </label>
                <br/>
                <label>Commander
                    <input
                        name="commander0"
                        type="text"
                        value={formData.commanders[0]}
                        onChange={e => onChangeHandleCommanders(0, e.target.value)}
                        placeholder="Search for commander..."
                        className="border p-2 rounded"
                    />
                </label>
                <label>Partner, Background
                    <input
                        name="commander1"
                        type="text"
                        value={formData.commanders[1]}
                        onChange={e => onChangeHandleCommanders(1, e.target.value)}
                        placeholder="Optional"
                        className="border p-2 rounded"
                    />
                </label>
                {results.length > 0 && (
                    <ul className="border mt-1 bg-white max-h-40 overflow-y-auto">
                        {results.map((name) => (
                            <li
                                key={name}
                                className="p-2 hover:bg-gray-200 cursor-pointer"
                                onClick={() => {
                                    setInput(name);
                                    setResults([]);
                                }}
                            >
                                {name}
                            </li>
                        ))}
                    </ul>
                )}

                <br/>
                <label>Deckname
                    <input
                        name="deckname"
                        type="text"
                        value={formData?.deckname}
                        onChange={onChangeHandler}
                        placeholder="Optional Deckname"
                        className="border p-2 rounded"
                    />
                </label>
                <br/>
                <button className="mt-4 px-4 py-2 bg-purple-950 text-white rounded">
                    Add deck to player
                </button>
            </form>
        </>
    );
}
