import { useAutocomplete } from "../hooks/useAutocomplete";

interface AutocompleteInputProps {
    value: string;
    onChange: (val: string) => void;
    className?: string;
}

export function AutocompleteInput({ value, onChange, className = "" }: AutocompleteInputProps) {
    const { results, clearResults, reopenResults } = useAutocomplete(value);

    return (
        <div className={`relative ${className}`}>
            <input
                type="text"
                value={value}
                onChange={e => onChange(e.target.value)}
                onFocus={reopenResults}
                onBlur={clearResults}
                placeholder="Search commander..."
                className="min-w-[200px] border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
            {results.length > 0 && (
                <ul className="absolute z-10 bg-lime-300 border rounded mt-1 min-w-[200px] max-h-40 overflow-y-auto">
                    {results.map(name => (
                        <li
                            key={name}
                            onMouseDown={() => {
                                onChange(name);
                                clearResults();
                            }}
                            className="px-3 py-2 hover:bg-purple-100 cursor-pointer"
                        >
                            {name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
