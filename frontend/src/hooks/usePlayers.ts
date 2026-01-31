import { useEffect, useState } from "react";
import axios from "axios";

export interface Player {
    id: number;
    name: string;
    isRetired: boolean;
}

export function usePlayers() {
    const [players, setPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        axios.get<Player[]>("/api/players")
            .then(res => {
                setPlayers(Array.isArray(res.data) ? res.data : []);
            })
            .catch(err => {
                console.error("Error while loading players:", err);
                setError("Failed to load players");
            })
            .finally(() => setLoading(false));
    }, []);

    return { players, loading, error, setPlayers };
}
