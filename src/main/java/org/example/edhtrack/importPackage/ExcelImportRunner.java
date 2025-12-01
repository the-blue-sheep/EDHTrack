package org.example.edhtrack.importPackage;

import org.apache.poi.ss.usermodel.*;
import org.example.edhtrack.entity.*;
import org.example.edhtrack.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.FileInputStream;
import java.util.*;

@Component
public class ExcelImportRunner implements CommandLineRunner {

    private final PlayerRepository playerRepository;
    private final GameRepository gameRepository;
    private final GameParticipantRepository gameParticipantRepository;
    private final DeckRepository deckRepository;

    public ExcelImportRunner(PlayerRepository playerRepository,
                             GameRepository gameRepository,
                             GameParticipantRepository gameParticipantRepository,
                             DeckRepository deckRepository) {
        this.playerRepository = playerRepository;
        this.gameRepository = gameRepository;
        this.gameParticipantRepository = gameParticipantRepository;
        this.deckRepository = deckRepository;
    }

    private static final Map<String, String> COMMANDER_NAME_MAP = Map.ofEntries(
            Map.entry("10th Doctor + Rose", "the tenth Doctor & Rose"),
            Map.entry("10th Doctor & Rose", "the tenth Doctor & Rose"),
            Map.entry("Aclazotz", "Aclazotz, Deepest Betrayal"),
            Map.entry("Admiral", "Admiral Brass, Unsinkable"),
            Map.entry("Adrix & Nev", "Adrix and Nev, Twincasters"),
            Map.entry("Aegar", "Aegar, the Freezing Flame"),
            Map.entry("Agatha", "Agatha of the Vile Cauldron"),
            Map.entry("Amazing Spiderman", "Peter Parker / Amazing Spider-Man"),
            Map.entry("Anikthea", "Anikthea, Hand of Erebos"),
            Map.entry("Anowon Dieb der Ruinen", "Anowon, the Ruin Thief"),
            Map.entry("Arabella", "Arabella, Abandoned Doll"),
            Map.entry("Aragorn", "Aragorn, the Uniter"),
            Map.entry("Arcades", "Arcades, the Strategist"),
            Map.entry("Ashcoat", "Ashcoat of the Shadow Swarm"),
            Map.entry("Atraxa", "Atraxa, Grand Unifier"),
            Map.entry("Ayula", "Ayula, Queen Among Bears"),
            Map.entry("Baba Lysaga", "Baba Lysaga, Night Witch"),
            Map.entry("Basim", "Basim Ibn Ishaq"),
            Map.entry("Bazim", "Basim Ibn Ishaq"),
            Map.entry("Belakor", "Be'lakor, the Dark Master"),
            Map.entry("Beza", "Beza, the Bounding Spring"),
            Map.entry("Bilbo", "Bilbo, Birthday Celebrant"),
            Map.entry("Black Panther", "Black Panther, Wakandan King"),
            Map.entry("Blood Avatar", "Extus, Oriq Overlord"),
            Map.entry("Breena", "Breena, the Demagogue"),
            Map.entry("Breya", "Breya, Etherium Shaper"),
            Map.entry("Bright-Palm", "Bright-Palm, Soul Awakener"),
            Map.entry("Brimaz", "Brimaz, Blight of Oreskos"),
            Map.entry("Bruenor", "Bruenor Battlehammer"),
            Map.entry("Captain", "Captain N'ghathrod"),
            Map.entry("Cäsar", "Caesar, Legion's Emperor"),
            Map.entry("Cecily", "Cecily, Haunted Mage"),
            Map.entry("Choco", "Choco, Seeker of Paradise"),
            Map.entry("Chun-Li", "Chun-Li, Countless Kicks"),
            Map.entry("Clavileno", "Clavileño, First of the Blessed"),
            Map.entry("Colfenor", "Colfenor, the Last Yew"),
            Map.entry("Council of the Four", "The Council of Four"),
            Map.entry("Daryl", "Daryl, Hunter of Walkers"),
            Map.entry("Davros", "Davros, Dalek Creator"),
            Map.entry("Daxos", "Daxos the Returned"),
            Map.entry("Dhalsim", "Dhalsim, Pliable Pacifist"),
            Map.entry("Dihada", "Dihada, Binder of Wills"),
            Map.entry("Dina", "Dina, Soul Steeper"),
            Map.entry("Disa", "Disa the Restless"),
            Map.entry("Dogmeat", "Dogmeat, Ever Loyal"),
            Map.entry("Don Andres", "Don Andres, the Renegade"),
            Map.entry("Dr. Li", "Dr. Madison Li"),
            Map.entry("Dungeon", "Sefris of the Hidden Ways"),
            Map.entry("Dynaheir", "Dynaheir, Invoker Adept"),
            Map.entry("Edgar", "Edgar Markov"),
            Map.entry("Ellivere", "Ellivere of the Wild Court"),
            Map.entry("Endrek Sahr", "Endrek Sahr, Master Breeder"),
            Map.entry("Falco Spara", "Falco Spara, Pactweaver"),
            Map.entry("Feen", "Alela, Cunning Conqueror"),
            Map.entry("Firkraag", "Firkraag, Cunning Instigator"),
            Map.entry("Galadriel", "Galadriel, Light of Valinor"),
            Map.entry("Garth One Eye", "Garth One-Eye"),
            Map.entry("Gavi", "Gavi, Nest Warden"),
            Map.entry("Ghaltar", "Ghalta, Primal Hunger"),
            Map.entry("Ghired", "Ghired, Conclave Exile"),
            Map.entry("Gishath", "Gishath, Sun's Avatar"),
            Map.entry("Gonti", "Gonti, Night Minister"),
            Map.entry("Gut", "Gut, True Soul Zealot"),
            Map.entry("Haldan & Pako", "Haldan, Avid Arcanist"),
            Map.entry("Hapatra", "Hapatra, Vizier of Poisons"),
            Map.entry("Hazezon", "Hazezon, Shaper of Sand"),
            Map.entry("Heliod", "Heliod, the Radiant Dawn"),
            Map.entry("Heliod, the radiant Dawn", "Heliod, the Radiant Dawn"),
            Map.entry("Hof", "Hofri Ghostforge"),
            Map.entry("Hofir", "Hofri Ghostforge"),
            Map.entry("Hofri", "Hofri Ghostforge"),
            Map.entry("Hylda", "Hylda of the Icy Crown"),
            Map.entry("Ian", "Ian Malcolm, Chaotician"),
            Map.entry("Ian Malcolm", "Ian Malcolm, Chaotician"),
            Map.entry("Icibo", "Kibo, Uktabi Prince"),
            Map.entry("Indoraptor", "Indoraptor, the Perfect Hybrid"),
            Map.entry("Ioras", "Iroas, God of Victory"),
            Map.entry("Isshin", "Isshin, Two Heavens as One"),
            Map.entry("Ivy", "Ivy, Gleeful Spellthief"),
            Map.entry("Ixhel", "Ixhel, Scion of Atraxa"),
            Map.entry("Jarad", "Jarad, Golgari Lich Lord"),
            Map.entry("Jared", "Jared Carthalion"),
            Map.entry("Jared True Heir", "Jared Carthalion, True Heir"),
            Map.entry("Jodah", "Jodah, the Unifier"),
            Map.entry("Jon Irenicus", "Jon Irenicus, Shattered One"),
            Map.entry("K'rrik", "K'rrik, Son of Yawgmoth"),
            Map.entry("Kalemne", "Kalemne, Disciple of Iroas"),
            Map.entry("Kamiz", "Kamiz, Obscura Oculus"),
            Map.entry("Kangee", "Kangee, Aerie Keeper"),
            Map.entry("Karona", "Karona, False God"),
            Map.entry("Kasla", "Kasla, the Broken Halo"),
            Map.entry("Kastral", "Kastral, the Windcrested"),
            Map.entry("Kathril", "Kathril, Aspect Warper"),
            Map.entry("Kaust", "Kaust, Eyes of the Glade"),
            Map.entry("Kenrith Hug", "Kenrith, the Returned King"),
            Map.entry("Kynaios and Tiro", "Kynaios and Tiro of Meletis"),
            Map.entry("Lathril", "Lathril, Blade of the Elves"),
            Map.entry("Leinore", "Leinore, Autumn Sovereign"),
            Map.entry("Licia", "Licia, Sanguine Tribune"),
            Map.entry("Liesa", "Liesa, Forgotten Archangel"),
            Map.entry("Locust God", "The Locust God"),
            Map.entry("Lynde", "Lynde, Cheerful Tormentor"),
            Map.entry("Lyra", "Lyra Dawnbringer"),
            Map.entry("Maarika", "Maarika, Brutal Gladiator"),
            Map.entry("Magnus", "Magnus the Red"),
            Map.entry("Marinda", "Marina Vendrell"),
            Map.entry("Megatron", "Megatron, Tyrant"),
            Map.entry("Meren", "Meren of Clan Nel Toth"),
            Map.entry("Milicent", "Millicent, Restless Revenant"),
            Map.entry("Minn", "Minn, Wily Illusionist"),
            Map.entry("Mirko", "Mirko, Obsessive Theorist"),
            Map.entry("Mishra", "Mishra, Eminent One"),
            Map.entry("Mishra claimed by gix", "Mishra, Claimed by Gix"),
            Map.entry("Mishra Eminent One", "Mishra, Eminent One"),
            Map.entry("Mizzix", "Mizzix of the Izmagnus"),
            Map.entry("Mothman", "The Wise Mothman"),
            Map.entry("Mr. House", "Mr. House, President and CEO"),
            Map.entry("Muldrotha", "Muldrotha, the Gravetide"),
            Map.entry("My Little Pony", "Princess Twilight Sparkle"),
            Map.entry("Myra", "Myra the Magnificent"),
            Map.entry("Myriim", "Miirym, Sentinel Wyrm"),
            Map.entry("Name Unerkenntlich", "Name Unerkenntlich"),
            Map.entry("Necrons", "Imotekh the Stormlord"),
            Map.entry("Nelly Borca", "Nelly Borca, Impulsive Accuser"),
            Map.entry("Neyali", "Neyali, Suns' Vanguard"),
            Map.entry("Niv-Mizzet WUBRG", "Niv-Mizzet, Supreme"),
            Map.entry("Obeka", "Obeka, Splitter of Seconds"),
            Map.entry("Obeka Splitter of Seconds", "Obeka, Splitter of Seconds"),
            Map.entry("Obuun", "Obuun, Mul Daya Ancestor"),
            Map.entry("Okaun & Zndrsplt", "Okaun, Eye of Chaos"),
            Map.entry("Old Stickfinger", "Old Stickfingers"),
            Map.entry("Oloro", "Oloro, Ageless Ascetic"),
            Map.entry("Omo", "Omo, Queen of Vesuva"),
            Map.entry("Orika", "Norika Yamazaki, the Poet"),
            Map.entry("Pantlaza", "Pantlaza, Sun-Favored"),
            Map.entry("Party Time", "Nalia de'Arnise"),
            Map.entry("Piraten", "Admiral Brass, Unsinkable"),
            Map.entry("Pirr & Toothie", "Pir, Imaginative Rascal"),
            Map.entry("Pramikon", "Pramikon, Sky Rampart"),
            Map.entry("Prava & Ikra", "Prava of the Steel Legion"),
            Map.entry("Prosper", "Prosper, Tome-Bound"),
            Map.entry("Ramses", "Ramses, Assassin Lord"),
            Map.entry("Ranar", "Ranar the Ever-Watchful"),
            Map.entry("Rebellen", "Zirda, the Dawnwaker"),
            Map.entry("Reyhan & Esior", "Reyhan & Esior"),
            Map.entry("Reyhan & Keleth", "Reyhan & Keleth"),
            Map.entry("Riku", "Riku of Many Paths"),
            Map.entry("Rilsa Rael", "Rilsa Rael, Kingpin"),
            Map.entry("Rin & Seri", "Rin and Seri, Inseparable"),
            Map.entry("Rin and Seri", "Rin and Seri, Inseparable"),
            Map.entry("Roghrakh & Ardenn", "Roghrakh & Ardenn"),
            Map.entry("Saruman", "Saruman of Many Colors"),
            Map.entry("Satya", "Satya, Aetherflux Genius"),
            Map.entry("Sauron", "Sauron, the Dark Lord"),
            Map.entry("Scarab God", "The Scarab God"),
            Map.entry("Scorpion God", "The Scorpion God"),
            Map.entry("Sefris", "Sefris of the Hidden Ways"),
            Map.entry("Shabraz & Brallin", "Shabraz & Brallin"),
            Map.entry("Shalai & Halar", "Shalai and Hallar"),
            Map.entry("Shorikai", "Shorikai, Genesis Engine"),
            Map.entry("Sidar Jabari", "Sidar Jabari of Zhalfir"),
            Map.entry("Sliver", "The First Sliver"),
            Map.entry("Sonic", "Sonic the Hedgehog"),
            Map.entry("Sophia", "Sophia, Dogged Detective"),
            Map.entry("Stella", "Stella Lee, Wild Card"),
            Map.entry("Strefan", "Strefan, Maurer Progenitor"),
            Map.entry("Sydri", "Sydri, Galvanic Genius"),
            Map.entry("Syr Vandam", "Syr Vondam, Sunstar Exemplar"),
            Map.entry("Sythis", "Sythis, Harvest's Hand"),
            Map.entry("Tannuk", "Tannuk, Steadfast Second"),
            Map.entry("Tatsunari", "Tatsunari, Toad Rider"),
            Map.entry("Tawnos", "Tawnos, the Toymaker"),
            Map.entry("Tayam", "Tayam, Luminous Enigma"),
            Map.entry("Tazri", "Tazri, Stalwart Survivor"),
            Map.entry("Tegwyll", "Tegwyll, Duke of Splendor"),
            Map.entry("tehe", "Name unerkenntlich"),
            Map.entry("Teval", "Teval, the Balanced Scale"),
            Map.entry("Tidus", "Tidus, Yuna's Guardian"),
            Map.entry("Tovolar", "Tovolar, Dire Overlord"),
            Map.entry("Treebeard", "Treebeard, Gracious Host"),
            Map.entry("Tyraniden", "The Swarmlord"),
            Map.entry("Ulalek", "Ulalek, Fused Atrocity"),
            Map.entry("Ureni", "Ureni of the Unwritten"),
            Map.entry("Urtet", "Urtet, Remnant of Memnarch"),
            Map.entry("Urza", "Urza, Chief Artificer"),
            Map.entry("Urza, oberster Handwerker", "Urza, Chief Artificer"),
            Map.entry("Vaati", "Vhati il-Dal"),
            Map.entry("Valgavoth", "Valgavoth, Harrower of Souls"),
            Map.entry("Varolz", "Varolz, the Scar-Striped"),
            Map.entry("Voja", "Voja, Jaws of the Conclave"),
            Map.entry("Volo + Background", "Volo, Itinerant Scholar"),
            Map.entry("Volrath", "Volrath, the Shapestealer"),
            Map.entry("Vraska", "Vraska, the Silencer"),
            Map.entry("Wayta", "Wayta, Trainer Prodigy"),
            Map.entry("Wilhelt", "Wilhelt, the Rotcleaver"),
            Map.entry("WUBRG Dungeons", "Tazri, Stalwart Survivor"),
            Map.entry("Wulfgar", "Wulfgar of Icewind Dale"),
            Map.entry("Xyris", "Xyris, the Writhing Storm"),
            Map.entry("Y'shtola", "Y'shtola, Night's Blessed"),
            Map.entry("Yedora", "Yedora, Grave Gardener"),
            Map.entry("Zalto", "Zalto, Fire Giant Duke"),
            Map.entry("Zhulodok", "Zhulodok, Void Gorger"),
            Map.entry("Zimone", "Zimone, Mystery Unraveler")
    );

    @Override
    public void run(String... args) throws Exception {
        if (args.length == 0 || !args[0].equalsIgnoreCase("--import")) {
            System.out.println("Import skipped (use --import to run)");
            return;
        }

        importGames();
    }


    @Transactional
    public void importGames() throws Exception {
        String filePath = "src/main/resources/spiele.xlsx";
        System.out.println("📄 Importing games from: " + filePath);


        try (FileInputStream fis = new FileInputStream(filePath);
             Workbook workbook = WorkbookFactory.create(fis)) {

            Sheet sheet = workbook.getSheetAt(0);
            Row headerRow = sheet.getRow(0);
            if (headerRow == null) {
                System.out.println("❌ Header row missing!");
                return;
            }

            List<String> playerNames = new ArrayList<>();
            for (Cell cell : headerRow) {
                playerNames.add(cell.getStringCellValue().trim());
            }

            int importedGames = 0;

            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;

                Game game = new Game();
                List<GameParticipant> participants = new ArrayList<>();
                Player winner = null;

                for (int j = 0; j < playerNames.size(); j++) {
                    Cell cell = row.getCell(j);
                    if (cell == null || cell.getCellType() == CellType.BLANK) continue;

                    String playerName = playerNames.get(j).trim();
                    Player player = playerRepository.findByName(playerName)
                            .orElseGet(() -> playerRepository.save(new Player(playerName)));

                    String commanderName = cell.getStringCellValue().trim();
                    String mappedCommander = COMMANDER_NAME_MAP.getOrDefault(commanderName, commanderName);

                    if (commanderName.isEmpty()) continue;

                    Deck deck = deckRepository.findByPlayerAndCommander(player, mappedCommander)
                            .orElseGet(() -> {
                                Deck newDeck = new Deck();
                                newDeck.setPlayer(player);
                                newDeck.setCommander(mappedCommander);
                                newDeck.setDeckName(mappedCommander);
                                return deckRepository.save(newDeck);
                            });

                    GameParticipant participant = new GameParticipant();
                    participant.setPlayer(player);
                    participant.setDeck(deck);
                    participant.setGame(game);

                    CellStyle style = cell.getCellStyle();
                    Font font = workbook.getFontAt(style.getFontIndexAsInt());
                    if (font.getBold()) {
                        winner = player;
                    }

                    participants.add(participant);
                }

                if (!participants.isEmpty()) {
                    game.setPlayers(participants);
                    game.setWinner(winner);
                    gameRepository.save(game);
                    importedGames++;
                }
            }

            System.out.println("✅ Import finished successfully!");
            System.out.println("Imported " + importedGames + " games.");
        }
    }
}
