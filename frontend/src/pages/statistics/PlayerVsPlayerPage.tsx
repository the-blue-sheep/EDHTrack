import {type ChangeEvent, useState} from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {usePlayers} from "../../hooks/usePlayers.ts";

interface PlayerVsPlayerDTO {
    player1Id: number;
    player1Name: string;
    player2Id: number;
    player2Name: string;
    totalGamesPlayer1: number;
    totalGamesPlayer2: number;
    gamesTogether: number;
    player1WinsHeadToHead: number;
    player2WinsHeadToHead: number;
    winRatePlayer1Overall: number;
    winRatePlayer2Overall: number;
    winRatePlayer1WithPlayer2: number;
    winRatePlayer2WithPlayer1: number;
    deltaPlayer1: number;
    deltaPlayer: number;
}


export default function PlayerVsPlayerPage() {
    const { players } = usePlayers();
    const [player1Id, setPlayer1Id] = useState<number | null>(null);
    const [player2Id, setPlayer2Id] = useState<number | null>(null);
    const [tableSizes, setTableSizes] = useState<number[]>([3, 4, 5, 6]);
    const [data, setData] = useState<PlayerVsPlayerDTO | null>(null);
    const [loading, setLoading] = useState(false);

    function loadStats() {
        if (player1Id === null || player2Id === null) return;
        if (player1Id === player2Id) {
            toast.warning("Please select two different players");
            return;
        }

        setLoading(true);
        const toasty = toast.loading("Loading statistics...");

        axios.get<PlayerVsPlayerDTO>(
            "/api/stats/player-vs-player-stat",
            {
                params: {
                    playerId1: player1Id,
                    playerId2: player2Id,
                    tableSizes: tableSizes.join(",")
                }
            }
        )
            .then(res => {
                setData(res.data);
                toast.update(toasty, {
                    render: "Statistics loaded",
                    type: "success",
                    isLoading: false,
                    autoClose: 2000
                });
            })
            .catch(err => {
                console.error(err);
                setData(null);
                toast.update(toasty, {
                    render: "Error loading statistics",
                    type: "error",
                    isLoading: false,
                    autoClose: 3000
                });
            })
            .finally(() => setLoading(false));
    }

    function renderDesktopStats(data: PlayerVsPlayerDTO) {
        return (
            <>
                <h2 className="text-xl font-semibold mb-4">
                    {data.player1Name} vs {data.player2Name}
                </h2>

                <h3 className="font-semibold mt-2">Overall Performance</h3>
                <p>{data.player1Name}: {(data.winRatePlayer1Overall * 100).toFixed(1)}% over {data.totalGamesPlayer1} games</p>
                <p>{data.player2Name}: {(data.winRatePlayer2Overall * 100).toFixed(1)}% over {data.totalGamesPlayer2} games</p>

                <h3 className="font-semibold mt-4">
                    Performance with {data.player2Name} present
                </h3>

                <p>
                    {data.player1Name}: {(data.winRatePlayer1WithPlayer2 * 100).toFixed(1)}% over {data.gamesTogether} games
                </p>

                <p className="mt-2 font-bold">
                    {data.player1Name}'s winrate{" "}
                    <span className={data.deltaPlayer1 >= 0 ? "text-green-600" : "text-red-600"}>
                      {data.deltaPlayer1 >= 0 ? "increases" : "drops"}
                    </span>{" "}
                    by {Math.abs(data.deltaPlayer1 * 100).toFixed(1)} percentage points when {data.player2Name} is at the table.
                </p>

                <h3 className="font-semibold mt-4">Head-to-Head</h3>
                <p>Games together: {data.gamesTogether}</p>
                <p>{data.player1Name} wins: {data.player1WinsHeadToHead}</p>
                <p>{data.player2Name} wins: {data.player2WinsHeadToHead}</p>
            </>
        );
    }

    function renderMobileStats(data: PlayerVsPlayerDTO) {
        return (
            <>
                <div className="border rounded p-4">
                    <h2 className="font-bold text-lg mb-2">
                        {data.player1Name} vs {data.player2Name}
                    </h2>

                    <p className="text-sm">
                        {data.player1Name}: {(data.winRatePlayer1Overall * 100).toFixed(1)}%
                    </p>
                    <p className="text-sm">
                        {data.player2Name}: {(data.winRatePlayer2Overall * 100).toFixed(1)}%
                    </p>
                </div>

                <div className="border rounded p-4">
                    <h3 className="font-semibold mb-1">
                        With {data.player2Name} at the table
                    </h3>

                    <p className="text-sm">
                        {data.player1Name}: {(data.winRatePlayer1WithPlayer2 * 100).toFixed(1)}%
                    </p>

                    <p className="mt-2 font-bold text-sm">
                      <span className={data.deltaPlayer1 >= 0 ? "text-green-600" : "text-red-600"}>
                        {data.deltaPlayer1 >= 0 ? "↑" : "↓"}
                      </span>{" "}
                        {Math.abs(data.deltaPlayer1 * 100).toFixed(1)} pp
                    </p>
                </div>

                <div className="border rounded p-4">
                    <h3 className="font-semibold mb-1">Head-to-Head</h3>
                    <p className="text-sm">Games together: {data.gamesTogether}</p>
                    <p className="text-sm">{data.player1Name}: {data.player1WinsHeadToHead}</p>
                    <p className="text-sm">{data.player2Name}: {data.player2WinsHeadToHead}</p>
                </div>
            </>
        );
    }

    return (
        <div className="p-6">
            <h3 className="text-xl font-semibold text-purple-800 space-x-6">
                Player vs Player
            </h3>

            <div className="grid gap-4 mb-6 grid-cols-[repeat(auto-fit,minmax(240px,1fr))]">
                <div className="flex items-center gap-2">
                    <label className="text-purple-900 font-bold">
                        Player 1
                    </label>
                    <select
                        value={player1Id ?? ""}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                            setPlayer1Id(e.target.value ? Number(e.target.value) : null)
                        }
                        className="border rounded px-2 py-1 min-w-[200px]"
                    >
                        <option value="">-- Select --</option>
                        {players.map(p => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <label className="text-purple-900 font-bold">
                        Player 2
                    </label>
                    <select
                        value={player2Id ?? ""}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                            setPlayer2Id(e.target.value ? Number(e.target.value) : null)
                        }
                        className="border rounded px-2 py-1 min-w-[200px]"
                    >
                        <option value="">-- Select --</option>
                        {players.map(p => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex flex-col gap-2 mb-6">
                <label className="text-purple-900 font-bold">Table size</label>
                <div className="flex gap-4">
                    {[3, 4, 5, 6].map(size => (
                        <label key={size} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={tableSizes.includes(size)}
                                onChange={e => {
                                    setTableSizes(prev =>
                                        e.target.checked
                                            ? [...prev, size]
                                            : prev.filter(s => s !== size)
                                    );
                                }}
                            />
                            {size} Players
                        </label>
                    ))}
                </div>
            </div>

            <button
                onClick={loadStats}
                className="px-6 py-2 bg-purple-700 text-white font-semibold rounded-md hover:bg-purple-800 disabled:bg-gray-400"
                disabled={player1Id === null || player2Id === null || player1Id === player2Id}
            >
                Compare
            </button>

            {loading ? <p className="mt-4">Loading...</p> : null}

            {!loading && data && (
                <>
                    {/* DESKTOP */}
                    <div className="hidden md:block mt-6">
                        {renderDesktopStats(data)}
                    </div>

                    {/* MOBILE */}
                    <div className="md:hidden mt-6 space-y-4">
                        {renderMobileStats(data)}
                    </div>
                </>
            )}

            {data && (
                <>
                    {data.gamesTogether < 5 && (
                        <p className="mt-2 text-yellow-700 font-bold">
                            ⚠️ Sample size too small for head-to-head analysis.
                        </p>
                    )}
                </>
            )}
        </div>
    );
}
