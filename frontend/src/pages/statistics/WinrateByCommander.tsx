import {useEffect, useState} from "react";
import axios from "axios";
import {toast} from "react-toastify";
import MinGamesInput from "../../components/MinGamesInput.tsx";
import {useCommanders} from "../../hooks/useCommanders.ts";
import GroupMultiSelect from "../../components/GroupMultiSelect.tsx";


interface CommanderWinRateDTO {
    commanderName: string;
    totalGames: number;
    wins: number;
    winRate: number;
}

export default function WinrateByCommander() {
    const [commanderName, setCommanderName] = useState<string>("");
    const [data, setData] = useState<CommanderWinRateDTO | null>(null);
    const [loading, setLoading] = useState(false);
    const [allData, setAllData] = useState<CommanderWinRateDTO[]>([]);
    const [minGames, setMinGames] = useState<number>(1);
    const { commanders: allCommanders, loading: commandersLoading } = useCommanders();
    const [groupIds, setGroupIds] = useState<number[]>([]);

    useEffect(() => {
        if (!commanderName) {
            setData(null);
            return;
        }

        if (!allCommanders.includes(commanderName)) {
            return;
        }

        const toasty = toast.loading("Loading statistics...");
        setLoading(true);

        axios.get<CommanderWinRateDTO>(
            "/api/stats/commander-winrate",
            { params: { commanderName, minGames, groupIds } }
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
                setData(null);
                toast.update(toasty, {
                    render: "Error loading statistics",
                    type: "error",
                    isLoading: false,
                    autoClose: 3000
                });
                console.error(err);
            })
            .finally(() => {
                setLoading(false);
            });

    }, [commanderName, allCommanders, groupIds]);

    function loadAll() {
        const toasty = toast.loading("Loading all commander winrates...");
        setLoading(true);

        axios.get<CommanderWinRateDTO[]>("/api/stats/commander-winrates", { params: { minGames, groupIds } })
            .then(res => {
                setAllData(res.data);
                toast.update(toasty, {
                    render: "All winrates loaded",
                    type: "success",
                    isLoading: false,
                    autoClose: 2000
                });
            })
            .catch(err => {
                toast.update(toasty, {
                    render: "Error loading winrates",
                    type: "error",
                    isLoading: false
                });
                console.error(err);
            })
            .finally(() => setLoading(false));
    }

    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-xl font-semibold text-purple-800 space-x-6">Winrate by Commander</h3>
            <div className="flex items-center gap-2">
                <label className="text-purple-900 font-bold">Commander</label>
                <input
                    list="commanders"
                    value={commanderName}
                    disabled={commandersLoading}
                    placeholder={commandersLoading ? "Loading commanders…" : "Commander name"}
                    onChange={e => setCommanderName(e.target.value)}
                    className="border rounded px-2 py-1"
                />
                <datalist id="commanders">
                    {allCommanders.map(name => (
                        <option key={name} value={name} />
                    ))}
                </datalist>

                <GroupMultiSelect
                    value={groupIds}
                    onChange={setGroupIds}
                />

                <MinGamesInput
                    value={minGames}
                    onChange={setMinGames}
                />
            </div>

            <div className="flex gap-4 items-center mt-4">
                <button
                    onClick={loadAll}
                    className="px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-800"
                >
                    Show all
                </button>
            </div>

            {!loading && data ?
                <table className="mt-6 w-full border-collapse">
                    <thead>
                    <tr className="border-b">
                        <th className="px-3 py-2 text-left font-semibold">Commander</th>
                        <th className="px-3 py-2 text-left font-semibold">Total Games</th>
                        <th className="px-3 py-2 text-left font-semibold">Wins</th>
                        <th className="px-3 py-2 text-left font-semibold">Winrate</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr className="border-b">
                        <td>{data.commanderName}</td>
                        <td>{data.totalGames}</td>
                        <td>{data.wins}</td>
                        <td>{(data.winRate * 100).toFixed(1)}%</td>
                    </tr>
                    </tbody>
                </table>
            : null}
            <div className="flex items-center gap-2">
                {!loading && allData.length > 0 ?
                    <table className="mt-6 w-full border-collapse">
                        <thead>
                        <tr className="border-b">
                            <th className="px-3 py-2 text-left">#</th>
                            <th className="px-3 py-2 text-left">Commander</th>
                            <th className="px-3 py-2 text-left">Games</th>
                            <th className="px-3 py-2 text-left">Wins</th>
                            <th className="px-3 py-2 text-left">Winrate</th>
                        </tr>
                        </thead>
                        <tbody>
                        {allData.map((c, idx) => (
                            <tr key={c.commanderName} className="border-b">
                                <td>{idx + 1}</td>
                                <td>{c.commanderName}</td>
                                <td>{c.totalGames}</td>
                                <td>{c.wins}</td>
                                <td>{(c.winRate * 100).toFixed(1)}%</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                : null}
            </div>
        </div>

    )
}