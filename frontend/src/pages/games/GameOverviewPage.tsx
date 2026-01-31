import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import PlayerSelect from "../../components/PlayerSelect.tsx";
import { useCommanders } from "../../hooks/useCommanders";
import { usePlayers } from "../../hooks/usePlayers.ts";
import GroupMultiSelect from "../../components/GroupMultiSelect.tsx";

interface GameParticipant {
    playerName: string;
    commanders: string[] | string;
    deckName: string;
    isWinner: boolean;
}

interface GameOverviewDTO {
    gameId: number;
    date: string;
    notes: string;
    participants: GameParticipant[];
    groupId: number;
    firstKillTurn: number;
    lastTurn: number;
}

interface PageResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
}

export default function GameOverviewPage() {
    const { players } = usePlayers();
    const { commanders: allCommanders, loading: commandersLoading } = useCommanders();

    const [selectedPlayerId, setSelectedPlayerId] = useState<number | undefined>();
    const [commanderInput, setCommanderInput] = useState("");
    const [selectedGroupIds, setSelectedGroupIds] = useState<number[]>([]);

    const [playerFilterId, setPlayerFilterId] = useState<number | null>(null);
    const [commanderFilter, setCommanderFilter] = useState<string | null>(null);
    const [groupFilterIds, setGroupFilterIds] = useState<number[] | null>(null);

    const [games, setGames] = useState<GameOverviewDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [hasLoaded, setHasLoaded] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        setLoading(true);

        axios.get<PageResponse<GameOverviewDTO>>("/api/games", {
            params: {
                page,
                size: 20,
                playerId: playerFilterId,
                commander: commanderFilter,
                groupIds: groupFilterIds ? groupFilterIds.join(",") : null,
                firstKillTurn: 0,
                lastTurn: 0,
            },
        })
            .then(resp => {
                setGames(resp.data.content ?? []);
                setTotalPages(resp.data.totalPages ?? 0);
                setHasLoaded(true);
            })
            .finally(() => setLoading(false));
    }, [page, playerFilterId, commanderFilter, groupFilterIds]);

    const handleApply = () => {
        setPage(0);
        setPlayerFilterId(selectedPlayerId ?? null);
        setCommanderFilter(commanderInput.trim() || null);
        setGroupFilterIds(selectedGroupIds.length > 0 ? [...selectedGroupIds] : null);
    };

    const handleReset = () => {
        setPage(0);
        setSelectedPlayerId(undefined);
        setCommanderInput("");
        setSelectedGroupIds([]);
        setPlayerFilterId(null);
        setCommanderFilter(null);
        setGroupFilterIds(null);
    };

    if (loading && !hasLoaded) {
        return <p className="p-6 text-lg font-medium">Loading…</p>;
    }

    return (
        <div className="p-4 md:p-6">
            <h3 className="text-xl font-semibold text-purple-800 mb-4">Game Overview</h3>

            {/* FILTERS */}
            <div className="flex flex-col gap-4 md:flex-row md:items-end mb-6">
                <PlayerSelect
                    players={players}
                    value={selectedPlayerId}
                    onChange={setSelectedPlayerId}
                    label="Player"
                />

                <div className="w-full md:w-auto">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Commander</label>
                    <input
                        list="commanders"
                        value={commanderInput}
                        disabled={commandersLoading}
                        placeholder={commandersLoading ? "Loading…" : "Commander name"}
                        onChange={e => setCommanderInput(e.target.value)}
                        className="w-full md:min-w-[320px] border border-gray-300 px-3 py-2 rounded-md
                                   focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                    <datalist id="commanders">
                        {allCommanders.map(name => (
                            <option key={name} value={name} />
                        ))}
                    </datalist>
                </div>

                <GroupMultiSelect
                    value={selectedGroupIds}
                    onChange={setSelectedGroupIds}
                />

                <button
                    onClick={handleApply}
                    className="w-full md:w-auto px-4 py-2 rounded-md bg-purple-700 text-white font-semibold"
                >
                    Apply
                </button>

                <button
                    onClick={handleReset}
                    className="w-full md:w-auto px-4 py-2 rounded-md bg-red-600 text-white font-semibold"
                >
                    Reset
                </button>
            </div>

            {hasLoaded && games.length === 0 && <p>No games found</p>}

            <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="border px-4 py-2">Players</th>
                        <th className="border px-4 py-2">Date</th>
                        <th className="border px-4 py-2">Notes</th>
                        <th className="border px-4 py-2">Edit</th>
                    </tr>
                    </thead>
                    <tbody>
                    {games.map(game => (
                        <tr key={game.gameId}>
                            <td className="border px-4 py-2">
                                <ul className="space-y-1">
                                    {game.participants.map(p => (
                                        <li
                                            key={p.playerName}
                                            className={`flex justify-between ${
                                                p.isWinner ? "font-bold text-green-700" : ""
                                            }`}
                                        >
                                            <span>{p.playerName}</span>
                                            <span className="text-gray-600">
                                                    {Array.isArray(p.commanders)
                                                        ? p.commanders.filter(Boolean).join(" // ")
                                                        : p.commanders}
                                                </span>
                                        </li>
                                    ))}
                                </ul>
                            </td>
                            <td className="border px-4 py-2">{game.date}</td>
                            <td className="border px-4 py-2">{game.notes}</td>
                            <td className="border px-4 py-2">
                                <Link to={`/games/${game.gameId}/edit`} className="text-purple-900 underline">
                                    Edit
                                </Link>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div className="md:hidden space-y-4">
                {games.map(game => (
                    <div key={game.gameId} className="border rounded-lg p-4 shadow-sm">
                        <div className="text-sm text-gray-600 mb-2">{game.date}</div>

                        <ul className="space-y-1 mb-2">
                            {game.participants.map(p => (
                                <li
                                    key={p.playerName}
                                    className={`flex justify-between ${
                                        p.isWinner ? "font-semibold text-green-700" : ""
                                    }`}
                                >
                                    <span>{p.playerName}</span>
                                    <span className="text-gray-600 text-sm">
                                        {Array.isArray(p.commanders)
                                            ? p.commanders.filter(Boolean).join(" // ")
                                            : p.commanders}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        {game.notes && (
                            <p className="text-sm text-gray-700 line-clamp-2 mb-2">{game.notes}</p>
                        )}

                        <Link
                            to={`/games/${game.gameId}/edit`}
                            className="inline-block mt-2 text-purple-800 font-semibold underline"
                        >
                            Edit
                        </Link>
                    </div>
                ))}
            </div>

            <div className="flex justify-between items-center mt-6">
                <button
                    disabled={page === 0}
                    onClick={() => setPage(p => p - 1)}
                    className="px-4 py-2 rounded bg-purple-700 text-white font-semibold disabled:opacity-40"
                >
                    ← Previous
                </button>

                <span className="text-sm text-gray-600">
                    Page {page + 1} of {totalPages}
                </span>

                <button
                    disabled={page + 1 >= totalPages}
                    onClick={() => setPage(p => p + 1)}
                    className="px-4 py-2 rounded bg-purple-700 text-white font-semibold disabled:opacity-40"
                >
                    Next →
                </button>
            </div>
        </div>
    );
}
