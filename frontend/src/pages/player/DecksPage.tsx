import {type ChangeEvent, useState} from "react";

interface Player {
    id: number;
    name: string;
    isRetired: boolean;
}

export default function decksPage() {
    const [players] = useState<Player[]>([]);
    const [selectedPlayerId, setSelectedPlayerId] = useState<number | undefined>(undefined);

    function onChangeHandlerPlayer(e: ChangeEvent<HTMLSelectElement>) {
        const val = e.target.value;
        setSelectedPlayerId(val ? Number(val) : undefined);
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Player
                </label>
                <select
                    name="id"
                    id="player-select"
                    value={selectedPlayerId ?? ""}
                    onChange={onChangeHandlerPlayer}
                    className="min-w-[320px] max-w-2xl border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                    <option value="">-- Select --</option>
                    {players.map(player => (
                        <option key={player.id} value={player.id}>
                            {player.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Decks the selected Player has played</label>
            </div>
        </div>
    )
}