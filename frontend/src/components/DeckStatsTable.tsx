

interface DeckStatDTO {
    deckId: number;
    deckName: string;
    totalGames: number;
    wins: number;
    winRate: number;
    isRetired: boolean;
}

export default function DeckStatsTable({ decks }: { decks: DeckStatDTO[] }) {
    if (!decks || decks.length === 0) {
        return <p className="text-gray-500 italic">No data</p>;
    }

    return (
        <table className="w-full table-auto border-collapse text-sm">
            <thead>
            <tr className="border-b bg-gray-100">
                <th className="px-4 py-2 text-left w-1/2">Deck</th>
                <th className="px-4 py-2 text-center w-1/6">Games</th>
                <th className="px-4 py-2 text-center w-1/6">Wins</th>
                <th className="px-4 py-2 text-center w-1/6">Winrate</th>
            </tr>
            </thead>
            <tbody>
            {decks.map(deck => (
                <tr
                    key={deck.deckId}
                    className="border-b last:border-b-0 hover:bg-purple-50"
                >
                    <td className="px-4 py-2 font-medium">{deck.deckName}</td>
                    <td className="px-4 py-2 text-center">{deck.totalGames}</td>
                    <td className="px-4 py-2 text-center">{deck.wins}</td>
                    <td className="px-4 py-2 text-center">
                        {(deck.winRate * 100).toFixed(1)}%
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}