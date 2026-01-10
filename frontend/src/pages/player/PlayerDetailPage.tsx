

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import DeckStatsTable from "../../components/DeckStatsTable.tsx";
import MinGamesInput from "../../components/MinGamesInput.tsx";

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
    const [minGames, setMinGames] = useState<number>(1);

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

    useEffect(() => {
        if (!id) return;
        const toasty = toast.loading("Loading details...");

        axios.get<DeckStatDTO[]>(`/api/stats/players/${id}/top-played-decks`)
            .then(res => {
                setTopPlayed(res.data)
                toast.update(toasty, {
                    render: "Details loaded",
                    type: "success",
                    isLoading: false,
                    autoClose: 2000
                });
            });

        axios.get<DeckStatDTO[]>(`/api/stats/players/${id}/top-successful-decks`, {params: { minGames: minGames } })
            .then(res => {
                setTopSuccessful(res.data)
                toast.update(toasty, {
                    render: "Details loaded",
                    type: "success",
                    isLoading: false,
                    autoClose: 2000
                });
            });


    }, [id, minGames]);

    useEffect(() => {
        setTopPlayedFiltered(getTopDecks(topPlayed, hideRetiredDecks));
        setTopSuccessfulFiltered(getTopDecks(topSuccessful, hideRetiredDecks));
    }, [topPlayed, topSuccessful, hideRetiredDecks, minGames]);

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

                <MinGamesInput
                    value={minGames}
                    onChange={setMinGames}
                />

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


