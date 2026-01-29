import { useEffect, useState } from "react";
import axios from "axios";
import * as React from "react";

interface PlayerGroupDTO {
    id: number;
    name: string;
}

interface Props {
    value: number[];
    onChange: (ids: number[]) => void;
}

export default function GroupMultiSelect({ value, onChange }: Props) {

    const [groups, setGroups] = useState<PlayerGroupDTO[]>([]);

    useEffect(() => {
        axios.get<PlayerGroupDTO[]>("/api/groups")
            .then(res => setGroups(res.data))
            .catch(() => console.error("Failed to load groups"));
    }, []);

    function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const selected = Array.from(e.target.selectedOptions)
            .map(o => Number(o.value));

        onChange(selected);
    }

    return (
        <div>
            <label className="text-purple-900 font-bold block mb-1">
                Player Groups
                <button
                    onClick={() => onChange([])}
                    className="px-3 py-1 rounded bg-gray-300 text-sm font-semibold"
                >
                    All Groups
                </button>
            </label>

            <select
                multiple
                value={value.map(String)}
                onChange={handleChange}
                className="border rounded px-2 py-2 min-w-[200px] h-[120px]"
            >
                {groups.map(g => (
                    <option key={g.id} value={g.id}>
                        {g.name}
                    </option>
                ))}
            </select>
        </div>
    );
}
