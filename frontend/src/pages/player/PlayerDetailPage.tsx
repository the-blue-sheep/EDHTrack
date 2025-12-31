

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface PlayerDetailDTO {
    playerId: number;
    playerName: string;
    isRetired: boolean;
    totalGames: number;
    wins: number;
    winRate: number;
}

interface DeckStatDTO {
    deckId: number;
    deckName: string;
    totalGames: number;
    wins: number;
    winRate: number;
}
export default function PlayerDetailPage() {
    const { id } = useParams();
    const [data, setData] = useState<PlayerDetailDTO | null>(null);
    const [topPlayed, setTopPlayed] = useState<DeckStatDTO[]>([]);
    const [topSuccessful, setTopSuccessful] = useState<DeckStatDTO[]>([]);


    function Stat({ label, value }: { label: string; value: string | number }) {
        return (
            <div className="bg-purple-50 rounded p-4 text-center">
                <div className="text-sm text-gray-600">{label}</div>
                <div className="text-xl font-bold">{value}</div>
            </div>
        );
    }

    function DeckStatsTable({ decks }: { decks: DeckStatDTO[] }) {
        if (!decks || decks.length === 0) {
            return <p className="text-gray-500 italic">No data</p>;
        }

        return (
            <table className="w-full border-collapse text-sm">
                <thead>
                <tr className="border-b">
                    <th className="px-2 py-1 text-left">Deck</th>
                    <th className="px-2 py-1 text-center">Games</th>
                    <th className="px-2 py-1 text-center">Wins</th>
                    <th className="px-2 py-1 text-center">Winrate</th>
                </tr>
                </thead>
                <tbody>
                {decks.map(deck => (
                    <tr
                        key={deck.deckId}
                        className="border-b last:border-b-0 hover:bg-purple-50"
                    >
                        <td className="px-2 py-1 font-medium">
                            {deck.deckName}
                        </td>
                        <td className="text-center">{deck.totalGames}</td>
                        <td className="text-center">{deck.wins}</td>
                        <td className="text-center">
                            {(deck.winRate * 100).toFixed(1)}%
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        );
    }

    useEffect(() => {
        if (!id) return;

        axios.get<DeckStatDTO[]>(`/api/stats/players/${id}/top-played-decks`)
            .then(res => setTopPlayed(res.data));

        axios.get<DeckStatDTO[]>(`/api/stats/players/${id}/top-successful-decks`)
            .then(res => setTopSuccessful(res.data));
    }, [id]);

    useEffect(() => {
        if (!id) return;

        const toasty = toast.loading("Loading player details...");
        axios.get<PlayerDetailDTO>(`/api/stats/players/${id}/detail`)
            .then(res => {
                setData(res.data);
                toast.update(toasty, {
                    render: "Player loaded",
                    type: "success",
                    isLoading: false,
                    autoClose: 2000
                });
            })
            .catch(() => {
                toast.update(toasty, {
                    render: "Error loading player",
                    type: "error",
                    isLoading: false,
                    autoClose: 3000
                });
            });
    }, [id]);

    if (!data) return null;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-purple-900 mb-2">
                {data.playerName}
            </h1>

            <p className="mb-4">
                Status:{" "}
                <span className={data.isRetired ? "text-red-600" : "text-green-600"}>
                    {data.isRetired ? "Retired" : "Active"}
                </span>
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Stat label="Games" value={data.totalGames} />
                <Stat label="Wins" value={data.wins} />
                <Stat label="Winrate" value={`${(data.winRate * 100).toFixed(1)}%`} />
            </div>
            <div>
                <h2 className="text-lg font-semibold text-purple-900 mb-3">
                    Top 3 Successful Decks
                </h2>

                <DeckStatsTable decks={topSuccessful} />
            </div>

            <div>
                <h2 className="text-lg font-semibold text-purple-900 mb-3">
                    Top 3 Played Decks
                </h2>

                <DeckStatsTable decks={topPlayed} />
            </div>
        </div>
    );
}


