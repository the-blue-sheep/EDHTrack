import { useEffect, useState } from "react";
import api from "@/api/axiosConfig";
import { toast } from "react-toastify";

export function useCommanders() {
    const [commanders, setCommanders] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const toasty = toast.loading("Loading commanders...");

        api.get<string[]>("/api/decks/commanders")
            .then(res => {
                setCommanders(res.data);
                toast.update(toasty, {
                    render: "Commanders loaded",
                    type: "success",
                    isLoading: false,
                    autoClose: 2000
                });
            })
            .catch(err => {
                console.error("Failed to load commanders", err);
                toast.update(toasty, {
                    render: "Error loading commanders",
                    type: "error",
                    isLoading: false,
                    autoClose: 3000
                });
            })
            .finally(() => setLoading(false));
    }, []);

    return { commanders, loading };
}
