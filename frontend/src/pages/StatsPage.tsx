import { STATISTICS } from "./statistics/statisticsConfig";
import { useNavigate } from "react-router-dom";

export default function StatisticsOverview() {
    const navigate = useNavigate();

    return (
        <div className="p-6">
            <h3 className="text-xl font-semibold text-purple-800 space-x-6">Statistics</h3>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: "1.5rem",
                    marginTop: "2rem",
                }}
            >
                {STATISTICS.map(stat => (
                    <div
                        key={stat.id}
                        style={{cursor: "pointer"}}
                        onClick={() => navigate(stat.route)}
                        className="border border-gray-300 px-4 py-2"
                    >
                        <h3 className="text-purple-900 font-bold">{stat.title}</h3>
                        <p>{stat.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
