// src/pages/Home.tsx
export default function HomePage() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">

            <section className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-purple-800">
                    EDHTrack
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Track, analyze, and improve your Commander (EDH) games with clear statistics
                    and a clean, focused interface.
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-purple-700">
                    What is EDHTrack?
                </h2>
                <p className="text-gray-700 leading-relaxed">
                    EDHTrack is a web application designed to record and analyze Commander games.
                    It helps players and playgroups keep track of games, decks, and results while
                    turning raw game data into meaningful insights.
                </p>
                <p className="text-gray-700 leading-relaxed">
                    Instead of relying on memory or spreadsheets, EDHTrack provides a structured
                    way to understand long-term performance, trends, and patterns in your playgroup.
                </p>
            </section>

            <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-purple-700">
                    Core Features
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                        <h3 className="font-semibold text-purple-800 mb-2">
                            Game Tracking
                        </h3>
                        <p className="text-gray-700 text-sm">
                            Record games with players, decks, winners, dates, and notes.
                            Games can be edited or deleted at any time.
                        </p>
                    </div>

                    <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                        <h3 className="font-semibold text-purple-800 mb-2">
                            Player & Deck Management
                        </h3>
                        <p className="text-gray-700 text-sm">
                            Manage players and their decks, including commanders, colors,
                            deck names, and retired decks.
                        </p>
                    </div>

                    <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                        <h3 className="font-semibold text-purple-800 mb-2">
                            Statistics & Analysis
                        </h3>
                        <p className="text-gray-700 text-sm">
                            View win rates, commander performance, table size statistics,
                            streaks, and player vs. player comparisons.
                        </p>
                    </div>

                    <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                        <h3 className="font-semibold text-purple-800 mb-2">
                            Clean & Responsive UI
                        </h3>
                        <p className="text-gray-700 text-sm">
                            A fast, minimal interface designed for clarity on both desktop
                            and mobile devices.
                        </p>
                    </div>
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-purple-700">
                    Who is EDHTrack for?
                </h2>
                <p className="text-gray-700 leading-relaxed">
                    EDHTrack is built for casual Commander playgroups, competitive players,
                    and anyone who enjoys data-driven insights into their games.
                </p>
                <p className="text-gray-700 leading-relaxed">
                    The focus is on accuracy, clarity, and usefulness — no unnecessary
                    complexity, just meaningful information.
                </p>
            </section>

        </div>
    )
}
