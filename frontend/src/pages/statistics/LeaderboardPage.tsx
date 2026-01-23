import { useState } from "react";
import MinGamesInput from "../../components/MinGamesInput.tsx";

type DeterminedType = "PLAYER" | "COMMANDER" | "COLOR";

interface LeaderboardEntryDTO {
    playerName: string;
    totalGames: number;
    wins: number;
    winRate: number;
}

export default function LeaderboardPage() {
    const [type, setType] = useState<DeterminedType>("PLAYER");
    const [minGames, setMinGames] = useState<number>(0);
    const [hideRetiredPlayers, setHideRetiredPlayers] = useState<boolean>(false);
    const [hideRetiredDecks, setHideRetiredDecks] = useState<boolean>(false);
    const [tableSizes, setTableSizes] = useState<number[]>([3, 4, 5, 6]);

    const [data, setData] = useState<LeaderboardEntryDTO[]>([]);
    const [loading, setLoading] = useState(false);

    async function loadLeaderboard() {
        setLoading(true);

        if (tableSizes.length === 0) {
            alert("Please select at least one table size");
            return;
        }

        const params = new URLSearchParams({
            type,
            minGames: String(minGames),
            hideRetiredPlayers: String(hideRetiredPlayers),
            hideRetiredDecks: String(hideRetiredDecks),
            tableSizes: tableSizes.join(",")
        });

        const res = await fetch(`/api/stats/leaderboard?${params.toString()}`);
        setData(await res.json());
        setLoading(false);
    }

    return (
        <div className="p-6">
            <h3 className="text-xl font-semibold text-purple-800 space-x-6">Leaderboard</h3>

            <div
                className="grid gap-4 mb-6 grid-cols-[repeat(auto-fit,minmax(200px,1fr))]"
            >
                <div className="flex items-center gap-2">
                    <label className="text-purple-900 font-bold">Type</label>
                    <select className="border rounded px-2 py-1" value={type} onChange={e => setType(e.target.value as DeterminedType)}>
                        <option value="PLAYER">Player</option>
                        <option value="COMMANDER">Commander</option>
                        <option value="COLOR">Color</option>
                    </select>
                </div>

                <MinGamesInput
                    value={minGames}
                    onChange={setMinGames}
                />

                <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 text-purple-900 font-bold">
                        <input
                            type="checkbox"
                            checked={hideRetiredPlayers}
                            onChange={e => setHideRetiredPlayers(e.target.checked)}
                        />
                        Hide retired Players
                    </label>
                </div>

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
                onClick={loadLeaderboard}
                className="px-6 py-2 bg-purple-700 text-white font-semibold rounded-md hover:bg-purple-800 focus:ring-2 focus:ring-green-400">
                    Load
            </button>

            {loading ? <p>Loading...</p> : null}

            {!loading && data.length > 0 ?
                <table className="mt-6 w-full border-collapse">
                    <thead>
                        <tr className="border-b">
                            <th className="px-3 py-2 text-left font-semibold">Place</th>
                            <th className="px-3 py-2 text-left font-semibold">Name</th>
                            <th className="px-3 py-2 text-left font-semibold">Total Games</th>
                            <th className="px-3 py-2 text-left font-semibold">Wins</th>
                            <th className="px-3 py-2 text-left font-semibold">Winrate</th>
                        </tr>
                    </thead>
                    <tbody>
                    {data.map((entry, index) => (
                        <tr key={entry.playerName} className="border-b last:border-b-0">
                            <td>{index + 1}</td>
                            <td>{entry.playerName}</td>
                            <td>{entry.totalGames}</td>
                            <td>{entry.wins}</td>
                            <td>{entry.winRate.toFixed(2)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            : null}
        </div>
    );
}
