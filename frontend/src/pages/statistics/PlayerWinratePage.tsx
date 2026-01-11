import {useEffect, useState} from "react";
import axios from "axios";
import {toast} from "react-toastify";
import DeckStatsTable from "../../components/DeckStatsTable.tsx";
import PlayerSelect from "../../components/PlayerSelect.tsx";
import MinGamesInput from "../../components/MinGamesInput.tsx";

interface Player {
    id: number;
    name: string;
    isRetired: boolean;
}

interface WinrateByPlayerDTO {
    playerId: number;
    playerName: string;
    gamesIn: number;
    gamesWon: number;
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

export default function PlayerWinratePage() {
    const [players, setPlayers] = useState<Player[]>([]);
    const [selectedPlayerId, setSelectedPlayerId] = useState<number | undefined>(undefined);
    const [data, setData] = useState<WinrateByPlayerDTO | null>(null);
    const [loading] = useState(false);
    const [topPlayed, setTopPlayed] = useState<DeckStatDTO[]>([]);
    const [topSuccessful, setTopSuccessful] = useState<DeckStatDTO[]>([]);
    const [hideRetiredDecks, setHideRetiredDecks] = useState<boolean>(false);
    const [topPlayedFiltered, setTopPlayedFiltered] = useState<DeckStatDTO[]>([]);
    const [topSuccessfulFiltered, setTopSuccessfulFiltered] = useState<DeckStatDTO[]>([]);
    const [minGames, setMinGames] = useState<number>(1);

    function getTopDecks(decks: DeckStatDTO[], hideRetired: boolean) {
        if (!decks) return [];

        if (!hideRetired) {
            return decks;
        }

        const top: DeckStatDTO[] = [];
        for (const deck of decks) {
            if (!deck.isRetired) {
                top.push(deck);
            }
        }

        return top;
    }

    useEffect(() => {
        axios.get<Player[]>("/api/players")
            .then(response => {
                setPlayers(Array.isArray(response.data) ? response.data : []);
            })
            .catch(error => {
                console.error("Error while loading players:", error);
            });
    }, []);

    useEffect(() => {
        setTopPlayedFiltered(getTopDecks(topPlayed, hideRetiredDecks));
        setTopSuccessfulFiltered(getTopDecks(topSuccessful, hideRetiredDecks));
    }, [topPlayed, topSuccessful, hideRetiredDecks]);

    useEffect(() => {
        if (!selectedPlayerId) return;
        const toasty = toast.loading("Loading details...");

        axios.get<DeckStatDTO[]>(`/api/stats/players/${selectedPlayerId}/top-played-decks`, {params: {limit:100}})
            .then(res => {
                setTopPlayed(res.data)
                toast.update(toasty, {
                    render: "Details loaded",
                    type: "success",
                    isLoading: false,
                    autoClose: 2000
                });
            });

        axios.get<DeckStatDTO[]>(`/api/stats/players/${selectedPlayerId}/top-successful-decks`, {params: {limit:100, minGames: minGames }} )
            .then(res => {
                setTopSuccessful(res.data)
                toast.update(toasty, {
                    render: "Details loaded",
                    type: "success",
                    isLoading: false,
                    autoClose: 2000
                });
            });
    }, [selectedPlayerId, minGames]);

    function onChangeHandlerPlayer(playerId?: number) {
        const val = playerId;

        if (!val) {
            setSelectedPlayerId(undefined);
            setData(null);
            return;
        }

        const id = Number(val);
        setSelectedPlayerId(id);

        const toastId = toast.loading("Loading winrate...");

        axios.get<WinrateByPlayerDTO>(`/api/stats/player-winrate?playerId=${id}`)
            .then(response => {
                setData(response.data);

                toast.update(toastId, {
                    render: "Winrate loaded",
                    type: "success",
                    isLoading: false,
                    autoClose: 2000
                });
            })
            .catch(err => {
                console.error(err);
                setData(null);

                toast.update(toastId, {
                    render: "Error loading winrate",
                    type: "error",
                    isLoading: false,
                    autoClose: 3000
                });
            });
    }

    return (
        <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="mb-6">
                    <h3 className="text-xl font-semibold text-purple-800 space-x-6">Player Winrate</h3>
                    <div className="flex items-center gap-3 mb-6">
                        <PlayerSelect
                            players={players}
                            value={selectedPlayerId}
                            onChange={onChangeHandlerPlayer}
                            />

                        <label className="flex items-center gap-2 text-purple-900 font-bold">
                            <input
                                type="checkbox"
                                checked={hideRetiredDecks}
                                onChange={e => setHideRetiredDecks(e.target.checked)}
                            />
                            Hide retired Decks
                        </label>

                        <MinGamesInput
                            value={minGames}
                            onChange={setMinGames}
                        />
                    </div>
                </div>
            </div>

            {loading ? <p>Loading...</p> : null}

            {data ?
                <div className="mt-6">

                    <h2 className="text-xl font-semibold mb-4 text-purple-900">
                        {data.playerName}
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="border rounded-lg p-4 text-center">
                            <p className="text-sm text-gray-500">Games Played</p>
                            <p className="text-2xl font-bold">
                                {data.gamesIn}
                            </p>
                        </div>

                        <div className="border rounded-lg p-4 text-center">
                            <p className="text-sm text-gray-500">Wins</p>
                            <p className="text-2xl font-bold">
                                {data.gamesWon}
                            </p>
                        </div>

                        <div className="border rounded-lg p-4 text-center">
                            <p className="text-sm text-gray-500">Winrate</p>
                            <p className="text-2xl font-bold">
                                {(data.winRate * 100).toFixed(1)}%
                            </p>
                        </div>
                    </div>
                </div>
            : null}

            {data ?
                <div className="space-y-6">
                    <div>
                        <h2 className="text-lg font-semibold text-purple-900 mb-3">
                            Ranked Top Successful Decks
                        </h2>
                        <DeckStatsTable decks={topSuccessfulFiltered} />
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-purple-900 mb-3">
                            Ranked Top Played Decks
                        </h2>
                        <DeckStatsTable decks={topPlayedFiltered} />
                    </div>
                </div>
                : null}
        </div>
    )
}