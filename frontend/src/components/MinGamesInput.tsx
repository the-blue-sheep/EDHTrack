interface MinGamesInputProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    label?: string;
}

interface MinGamesInputProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    label?: string;
}

export default function MinGamesInput({
                                          value,
                                          onChange,
                                          min = 0,
                                          label = "Minimum Games"
                                      }: MinGamesInputProps) {
    return (
        <div className="flex items-center gap-2">
            <label className="text-purple-900 font-bold">
                {label}
            </label>
            <input
                type="number"
                min={min}
                value={value}
                onChange={e => onChange(Number(e.target.value))}
                className="border rounded px-2 py-1 w-24"
            />
        </div>
    );
}
