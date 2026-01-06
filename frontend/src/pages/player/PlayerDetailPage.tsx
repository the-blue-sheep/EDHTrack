

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
    isRetired: boolean;
}

export default function PlayerDetailPage() {
    const { id } = useParams();
    const [data, setData] = useState<PlayerDetailDTO | null>(null);
    const [topPlayed, setTopPlayed] = useState<DeckStatDTO[]>([]);
    const [topSuccessful, setTopSuccessful] = useState<DeckStatDTO[]>([]);
    const [hideRetiredDecks, setHideRetiredDecks] = useState<boolean>(false);
    const [topPlayedFiltered, setTopPlayedFiltered] = useState<DeckStatDTO[]>([]);
    const [topSuccessfulFiltered, setTopSuccessfulFiltered] = useState<DeckStatDTO[]>([]);

    function getTopDecks(decks: DeckStatDTO[], hideRetired: boolean, count: number = 3) {
        if (!decks) return [];

        if (!hideRetired) {
            return decks.slice(0, count);
        }

        const top: DeckStatDTO[] = [];
        for (const deck of decks) {
            if (!deck.isRetired) {
                top.push(deck);
            }
            if (top.length === count) break;
        }

        return top;
    }

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
            <table className="w-full table-auto border-collapse text-sm">
                <thead>
                <tr className="border-b bg-gray-100">
                    <th className="px-4 py-2 text-left w-1/2">Deck</th>
                    <th className="px-4 py-2 text-center w-1/6">Games</th>
                    <th className="px-4 py-2 text-center w-1/6">Wins</th>
                    <th className="px-4 py-2 text-center w-1/6">Winrate</th>
                </tr>
                </thead>
                <tbody>
                {decks.map(deck => (
                    <tr
                        key={deck.deckId}
                        className="border-b last:border-b-0 hover:bg-purple-50"
                    >
                        <td className="px-4 py-2 font-medium">{deck.deckName}</td>
                        <td className="px-4 py-2 text-center">{deck.totalGames}</td>
                        <td className="px-4 py-2 text-center">{deck.wins}</td>
                        <td className="px-4 py-2 text-center">
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
        setTopPlayedFiltered(getTopDecks(topPlayed, hideRetiredDecks));
        setTopSuccessfulFiltered(getTopDecks(topSuccessful, hideRetiredDecks));
    }, [topPlayed, topSuccessful, hideRetiredDecks]);

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
            <div
                className="grid gap-4 mb-6 grid-cols-[repeat(auto-fit,minmax(200px,1fr))]"
            >
                <p className="mb-4">
                    Status:{" "}
                    <span className={data.isRetired ? "text-red-600" : "text-green-600"}>
                        {data.isRetired ? "Retired" : "Active"}
                    </span>
                </p>
                <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 text-purple-900 font-bold">
                        <input
                            type="checkbox"
                            checked={hideRetiredDecks}
                            onChange={e => setHideRetiredDecks(e.target.checked)}
                        />
                        Hide retired Decks
                    </label>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Stat label="Games" value={data.totalGames} />
                <Stat label="Wins" value={data.wins} />
                <Stat label="Winrate" value={`${(data.winRate * 100).toFixed(1)}%`} />
            </div>
            <div className="space-y-6">
                <div>
                    <h2 className="text-lg font-semibold text-purple-900 mb-3">
                        Top 3 Successful Decks
                    </h2>
                    <DeckStatsTable decks={topSuccessfulFiltered} />
                </div>

                <div>
                    <h2 className="text-lg font-semibold text-purple-900 mb-3">
                        Top 3 Played Decks
                    </h2>
                    <DeckStatsTable decks={topPlayedFiltered} />
                </div>
            </div>
        </div>
    );
}


