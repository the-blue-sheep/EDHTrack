import api from "@/api/axiosConfig";
import {useState, useEffect} from "react";

export function useAutocomplete(input: string) {
    const [debouncedInput, setDebouncedInput] = useState(input);
    const [results, setResults] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedInput(input.trim());
        }, 100);
        return () => clearTimeout(handler);
    }, [input]);

    useEffect(() => {
        if (!debouncedInput || !isOpen) {
            setResults([]);
            return;
        }
        api.get("https://api.scryfall.com/cards/autocomplete", {
            params: { q: debouncedInput },
            headers: { Accept: "*/*", "User-Agent": "EDHTrack/0.4" }
        })
            .then(resp => setResults(resp.data.data || []))
            .catch(() => setResults([]));
    }, [debouncedInput, isOpen]);

    const clearResults = () => {
        setResults([]);
        setIsOpen(false);
    };
    const reopenResults = () => setIsOpen(true);

    return {results, clearResults, reopenResults};
}