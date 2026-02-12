import {type ChangeEvent, type FormEvent, useState} from "react";
import api from "@/api/axiosConfig";
import {toast} from "react-toastify";

interface PlayerCreateDTO {
    name: string;
}

export default function addPlayerPage() {
    const [formData, setFormData] = useState<PlayerCreateDTO>({
        name: ""
    })

    function onChangeHandler(e: ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }
    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const toasty = toast.loading("Please wait...");
        const playerCreateDTO: PlayerCreateDTO = {
            name: formData.name
        };
        api.post("/api/players", playerCreateDTO)
            .then(() => {toast.update(toasty, {render: "All is good", type: "success", isLoading: false, autoClose: 3000 })
                setFormData({
                    name: ""
                })
            })
            .catch(() => {toast.update(toasty, {render: "Error", type: "error", isLoading: false})});
    }

    return (
        <div className="p-6">
            <h3 className="text-xl font-semibold text-purple-800 space-x-6">
                Add Player
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Player
                    </label>
                    <input
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={onChangeHandler}
                        placeholder="New Player Name"
                        className="min-w-[320px] max-w-2xl border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                    <button
                        type="submit"
                        className="px-6 py-2 bg-purple-700 text-white font-semibold rounded-md hover:bg-purple-800 focus:ring-2 focus:ring-green-400"
                    >
                        Add Player
                    </button>
                </div>
            </form>
        </div>
    )
}
