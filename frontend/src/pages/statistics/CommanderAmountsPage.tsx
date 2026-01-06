import { useEffect, useState } from "react";

interface CommanderAmountStatDTO {
    commander: string;
    count: number;
}

export default function CommanderAmountsPage() {
    const [data, setData] = useState<CommanderAmountStatDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        load();
    }, []);

    async function load() {
        setLoading(true);
        const res = await fetch("/api/stats/commander-amounts");
        setData(await res.json());
        setLoading(false);
    }

    return (
        <div className="p-8">
            <h3 className="text-xl font-semibold text-purple-800 space-x-6">
                Commander amounts
            </h3>

            {loading ? <p>Lade...</p> : null}

            {!loading && data.length > 0 ?
                <table className="w-full border-collapse">
                    <thead className="bg-purple-100">
                    <tr className="border-b">
                        <th className="px-3 py-2 text-left font-semibold">
                            Commander
                        </th>
                        <th className="px-3 py-2 text-left font-semibold">
                            Players who played the commander
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.map(entry => (
                        <tr
                            key={entry.commander}
                            className="border-b odd:bg-purple-50 hover:bg-purple-100 transition last:border-b-0"
                        >
                            <td className="px-3 py-2 text-center">
                                {entry.commander}
                            </td>
                            <td className="px-3 py-2 text-center">
                                {entry.count}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            : null}

            {!loading && data.length === 0 ?
                <p>No Data</p>
            : null}
        </div>
    );
}
