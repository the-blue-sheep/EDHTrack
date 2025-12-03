import axios from "axios";
import { useState, type ChangeEvent } from "react";

export default function PlayerManagerPage() {

    const [input, setInput] = useState("");

    const [results, setResults] = useState<string[]>([]);

    function getCommanderName(text: string) {

        if (text.length === 0) {
            setResults([]);
            return;
        }

        // Scryfall Autocomplete liefert nur Namen (keine Typen)
        axios.get("https://api.scryfall.com/cards/autocomplete", {
            headers: {
                "Accept": "*/*",
                // Im Browser geht der User-Agent offiziell nicht,
                // aber wir lassen ihn drin.
                "User-Agent": "EDHTrack/0.4"
            },
            params: {
                q: text         // kein "*" und keine Filter – autocomplete braucht puren Text
            }
        })
            .then(response => {
                const names: string[] = response.data.data;

                const filtered = names.filter(name =>
                    name.toLowerCase().startsWith(text.toLowerCase())
                );

                setResults(filtered);
            })
            .catch(() => {
                setResults([]);
            });
    }

    return (
        <>
            <h2>Spieler-Verwaltung</h2>

            {/* Eingabefeld */}
            <input
                type="text"
                value={input}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const value = e.target.value;
                    setInput(value);
                    getCommanderName(value.trim());
                }}
                placeholder="Search for commander..."
            />

            {/* Dropdown */}
            {results.length > 0 && (
                <ul>
                    {results.map((name) => (
                        <li
                            key={name}
                            onClick={() => {
                                // Setzt den Namen ins Inputfeld
                                setInput(name);

                                // Schließt Dropdown
                                setResults([]);
                            }}
                        >
                            {name}
                        </li>
                    ))}
                </ul>
            )}

            <button>Add commander to player</button>
        </>
    );
}
