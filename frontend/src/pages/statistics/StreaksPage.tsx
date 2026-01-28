import {useState} from "react";
import axios from "axios";
import {toast} from "react-toastify";
import PlayerSelect from "../../components/PlayerSelect.tsx";
import {usePlayers} from "../../hooks/usePlayers.ts";

interface StreakDTO {
    playerName: string;
    streaks: number[];
}

export default function StreaksPage() {
    const { players } = usePlayers();
    const [selectedPlayerId, setSelectedPlayerId] = useState<number | undefined>(undefined);
    const [data, setData] = useState<StreakDTO | null>(null);
    const [loading] = useState(false);

    function onChangeHandlerPlayer(playerId?: number) {
        const val = playerId;

        if (!val) {
            setSelectedPlayerId(undefined);
            setData(null);
            return;
        }

        const id = Number(val);
        setSelectedPlayerId(id);

        const toastId = toast.loading("Loading streaks...");

        axios.get<StreakDTO>(`/api/stats/streaks?playerId=${id}`)
            .then(response => {
                setData(response.data);

                toast.update(toastId, {
                    render: "Streaks loaded",
                    type: "success",
                    isLoading: false,
                    autoClose: 2000
                });
            })
            .catch(err => {
                console.error(err);
                setData(null);

                toast.update(toastId, {
                    render: "Error loading streaks",
                    type: "error",
                    isLoading: false,
                    autoClose: 3000
                });
            });
    }

    return (
        <div className="p-8">
            <h3 className="text-xl font-semibold text-purple-800 space-x-6">Streaks</h3>

            <div className="flex items-center gap-3 mb-6">
                <div className="mb-6">
                    <PlayerSelect
                        players={players}
                        value={selectedPlayerId}
                        onChange={onChangeHandlerPlayer}
                    />
                </div>
            </div>

            {loading ? <p>Loading...</p> : null}

            {data ?
                <div>
                    <h2 className="text-xl font-semibold mb-4">
                        {data.playerName}
                    </h2>

                    <div className="flex flex-wrap gap-2">
                        {data.streaks.map((streak, index) => (
                            <div
                                key={index}
                                className={`
                  px-3 py-1 rounded text-white font-semibold
                  ${streak > 0
                                    ? "bg-green-600"
                                    : "bg-red-600"}
                `}
                            >
                                {streak > 0
                                    ? `+${streak} Wins`
                                    : `${Math.abs(streak)} Losses`}
                            </div>
                        ))}
                    </div>
                </div>
            :null}
        </div>
    );
}
