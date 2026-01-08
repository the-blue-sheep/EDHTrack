
export interface PlayerOption {
    id: number;
    name: string;
}

interface PlayerSelectProps {
    players: PlayerOption[];
    value?: number;
    onChange: (playerId?: number) => void;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
}

export default function PlayerSelect({
                                         players,
                                         value,
                                         onChange,
                                         label = "Select Player",
                                         placeholder = "-- Select --",
                                         disabled = false
                                     }: PlayerSelectProps) {
    return (
        <div>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                </label>
            )}

            <select
                value={value ?? ""}
                disabled={disabled}
                onChange={e => {
                    const v = e.target.value;
                    onChange(v ? Number(v) : undefined);
                }}
                className="min-w-[320px] max-w-2xl border border-gray-300 px-3 py-2 rounded-md
                           focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
                <option value="">{placeholder}</option>

                {players.map(player => (
                    <option key={player.id} value={player.id}>
                        {player.name}
                    </option>
                ))}
            </select>
        </div>
    );
}