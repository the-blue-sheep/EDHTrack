import {useEffect, useState} from "react";
import axios from "axios";

interface DeckDTO {
    deckId: number;
    commanders: string[];
    deckName: string;
    colors: string;
    retired: boolean;
}

export default function DeckOptionsForPlayer({ playerId }: { playerId: number }) {
    const [decks, setDecks] = useState<DeckDTO[]>([]);

    useEffect(() => {
        axios.get<DeckDTO[]>(`/api/players/${playerId}/decks`)
            .then(res => setDecks(res.data))
            .catch(err => console.error("Error loading decks:", err));
    }, [playerId]);

    return (
        <>
            {decks
                .filter(deck => !deck.retired)
                .map(deck => (
                    <option key={deck.deckId} value={deck.deckId}>
                        {Array.isArray(deck.commanders)
                            ? deck.commanders.join(", ")
                            : deck.commanders}{" "}
                        – {deck.deckName}
                    </option>
                ))}
        </>
    );
}
