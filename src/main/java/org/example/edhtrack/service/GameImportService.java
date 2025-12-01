package org.example.edhtrack.service;

import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.example.edhtrack.entity.Game;
import org.example.edhtrack.entity.GameParticipant;
import org.example.edhtrack.entity.Player;
import org.example.edhtrack.repository.GameRepository;
import org.example.edhtrack.repository.PlayerRepository;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.*;

@Service
@RequiredArgsConstructor
public class GameImportService {

    private final PlayerRepository playerRepository;
    private final GameRepository gameRepository;

    public void importGames(File excelFile) throws Exception {
        try (Workbook workbook = WorkbookFactory.create(excelFile)) {
            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rowIterator = sheet.iterator();

            Row header = rowIterator.next();
            List<String> playerNames = new ArrayList<>();
            header.forEach(cell -> playerNames.add(cell.getStringCellValue().trim()));

            while (rowIterator.hasNext()) {
                Row row = rowIterator.next();
                Game game = new Game();
                List<GameParticipant> participants = new ArrayList<>();

                for (int i = 0; i < playerNames.size(); i++) {
                    Cell cell = row.getCell(i);
                    if (cell == null || cell.getCellType() == CellType.BLANK) continue;

                    String playerName = playerNames.get(i);
                    Player player = playerRepository.findByName(playerName)
                            .orElseGet(() -> playerRepository.save(new Player(playerName)));

                    GameParticipant gp = new GameParticipant();
                    gp.setGame(game);
                    gp.setPlayer(player);

                    CellStyle style = cell.getCellStyle();
                    Font font = workbook.getFontAt(style.getFontIndexAsInt());
                    gp.setWinner(font.getBold());

                    participants.add(gp);
                }

                game.setPlayers(participants);
                gameRepository.save(game);
            }
        }
    }

}
