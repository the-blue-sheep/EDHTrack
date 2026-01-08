import PlayerSelect from "../../components/PlayerSelect.tsx";
import {useEffect, useState} from "react";
import axios from "axios";

interface Player {
    id: number;
    name: string;
    isRetired: boolean;
}

interface TableSizeWinrateDTO {
    tableSize: number;
    games: number;
    wins: number;
    winRate: number;
}
interface TableSizeWinrateResponseDTO {
    playerId: number;
    playerName: string;
    stats: TableSizeWinrateDTO[];
}

export default function TableSizeWinrate() {
    const [players, setPlayers] = useState<Player[]>([]);
    const [selectedPlayerId, setSelectedPlayerId] = useState<number | undefined>(undefined);
    const [tableSizeWinrate, setTableSizeWinrate] = useState<TableSizeWinrateResponseDTO | undefined>(undefined);

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
        if (!selectedPlayerId) return;

        axios.get<TableSizeWinrateResponseDTO>(`/api/stats/players/${selectedPlayerId}/table-size-winrate`)
            .then(res => {
                setTableSizeWinrate(res.data)
            });
    }, [selectedPlayerId]);

    function onChangeHandlerPlayer(playerId?: number) {
        setSelectedPlayerId(playerId);
    }

    return (

        <div className="p-6">
            <h3 className="text-xl font-semibold text-purple-800 space-x-6">Table size winrate</h3>
            <div className="mb-6">
                <PlayerSelect
                    players={players}
                    value={selectedPlayerId}
                    onChange={onChangeHandlerPlayer}
                />
            </div>
            <div className="grid grid-cols-1 gap-6">
                {tableSizeWinrate?.stats?.length ?
                    <table className="w-full table-auto border-collapse text-sm">
                        <thead>
                        <tr className="border-b bg-gray-100">
                            <th className="px-4 py-2 text-left w-1/2">Table size / Players</th>
                            <th className="px-4 py-2 text-center w-1/6">Games</th>
                            <th className="px-4 py-2 text-center w-1/6">Wins</th>
                            <th className="px-4 py-2 text-center w-1/6">Winrate</th>
                        </tr>
                        </thead>
                        <tbody>
                        {tableSizeWinrate.stats.map(ts => (
                            <tr
                                key={ts.tableSize}
                                className="border-b last:border-b-0 hover:bg-purple-50"
                            >
                                <td className="px-4 py-2 font-medium">{ts.tableSize}</td>
                                <td className="px-4 py-2 text-center">{ts.games}</td>
                                <td className="px-4 py-2 text-center">{ts.wins}</td>
                                <td className="px-4 py-2 text-center">
                                    {(ts.winRate * 100).toFixed(1)}%
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                :null}
            </div>
        </div>
    )
}