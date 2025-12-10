import {type ChangeEvent, useEffect, useState} from "react";
import axios from "axios";
import {toast} from "react-toastify";

interface Player {
    id: number;
    name: string;
    isRetired: boolean;
}

interface PlayerUpdateDTO {
    id: number;
    newName: string;
    isRetired: boolean;
}

export default function UpdatePlayerPage() {
    const [players, setPlayers] = useState<Player[]>([]);
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
    const [newName, setNewName] = useState("");

    useEffect(() => {
        axios.get<Player[]>("/api/players")
            .then(response => {
                setPlayers(Array.isArray(response.data) ? response.data : []);
            })
            .catch(error => {
                console.error("Error while loading players:", error);
            });
    }, []);

    function onChangeHandlerPlayer(e: ChangeEvent<HTMLSelectElement>) {
        const val = e.target.value;
        if (!val) {
            setSelectedPlayer(null);
            return;
        }
        const id = val ? Number(val) : undefined;
        if (id == null) {
            setSelectedPlayer(null);
            return;
        }

        const toasty = toast.loading("Please wait...");

        axios.get(`/api/players/${id}`)
            .then(response => {
                toast.update(toasty, {
                    render: "Player loaded",
                    type: "success",
                    isLoading: false,
                    autoClose: 3000
                });
                const dto: Player = {
                    id: response.data.id,
                    name: response.data.name,
                    isRetired: response.data.isRetired
                };
                setSelectedPlayer(dto);
            })
            .catch(() => {
                toast.update(toasty, {
                    render: "Error",
                    type: "error",
                    isLoading: false,
                    autoClose: 3000
                });
            });
    }

    function updatePlayer(newName: string) {
        if(selectedPlayer != null) {
            const playerUpdateDTO: PlayerUpdateDTO = {
                id: selectedPlayer.id,
                newName: newName,
                isRetired: selectedPlayer.isRetired
            }
            console.log(playerUpdateDTO);
            const toasty = toast.loading("Please wait...");
            axios.post('/api/players/update', playerUpdateDTO)
                .then((response) => {
                    toast.update(toasty, {
                        render: "Updating player",
                        type: "success",
                        isLoading: false,
                        autoClose: 3000
                    });
                    const updatedPlayer: Player = response.data;
                    setPlayers(prev =>
                        prev.map(p => p.id === updatedPlayer.id ? updatedPlayer : p)
                    );

                    setSelectedPlayer({
                        id: updatedPlayer.id,
                        name: updatedPlayer.name,
                        isRetired: updatedPlayer.isRetired
                    });
                    setNewName("");
                })
                .catch(() => {
                    toast.update(toasty, {
                        render: "Error",
                        type: "error",
                        isLoading: false,
                        autoClose: 3000
                    });
                });
        }
    }

    return (
        <div className="space-x-6">
            <h1>Change player name</h1>
            <div>
                You misspelled a name during creation? No Problem.
            </div>

            <div className="space-x-6">
                <label className="block text-sm font-medium text-gray-700 space-x-2">
                    Select Player
                </label>
                <select
                    name="id"
                    id="player-select"
                    value={selectedPlayer?.id ?? ""}
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
            <form onSubmit={(e) => {
                e.preventDefault();
                updatePlayer(newName)
                }}>

                <label>New name: </label>
                <input
                    id="newName"
                    value={newName}
                    className="p-2 border-2 border-purple-500 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    onChange={(e) => setNewName(e.target.value)}
                />
                <br/>
                <button
                    type="submit"
                    className="mt-4 px-6 py-2 bg-purple-700 text-white font-semibold rounded-md hover:bg-purple-800 focus:ring-2 focus:ring-green-400">
                    Update player name
                </button>
            </form>

        </div>
    )
}