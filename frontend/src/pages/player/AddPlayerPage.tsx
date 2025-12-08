import {type ChangeEvent, type FormEvent, useState} from "react";
import axios from "axios";

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
        axios.post("/api/players", formData.name)
            .then(response => {console.log (response.data);})
            .catch(error => {console.log("Error during create Deck: ", error)});
    }

    return (
        <div >
            <h3 className="text-xl font-semibold text-purple-800 mb-4">
                Add Player
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Player
                    </label>
                    <input
                        name="addPlayer"
                        type="text"
                        value={formData.name}
                        onChange={onChangeHandler}
                        placeholder="New Player Name"
                        className="min-w-[320px] max-w-2xl border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                    <button
                        type="button"
                        className="px-6 py-2 bg-purple-700 text-white font-semibold rounded-md hover:bg-purple-800 focus:ring-2 focus:ring-green-400"
                    >
                        Add Player
                    </button>
                </div>
            </form>
        </div>
    )
}
