import axios from "axios";

const WUBRG = ["W", "U", "B", "R", "G"];

export async function getColorsForCommander(name: string): Promise<string> {
    if (name === "") return "";
    try {
        const resp = await axios.get(`https://api.scryfall.com/cards/named`, {
            params: { exact: name },
            headers: {
                "Accept": "application/json",
                "User-Agent": "EDHTrack/0.4"
            }
        });
        const card = resp.data;
        const identity: string[] = card.color_identity || [];
        const unique = Array.from(new Set(identity));
        unique.sort((a, b) => WUBRG.indexOf(a) - WUBRG.indexOf(b));
        return unique.join("");
    } catch (error) {
        console.error("Error fetching commander colors: ", error);
        return "";
    }
}

export async function computeColorsFromCommanders(commanderNames: string[]): Promise<string> {
    const allColors = await Promise.all(
        commanderNames.map(name => getColorsForCommander(name))
    );
    const unique = [...new Set(allColors.join("").split(""))];
    unique.sort((a, b) => WUBRG.indexOf(a) - WUBRG.indexOf(b));
    return unique.join("");
}
