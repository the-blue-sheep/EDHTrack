package org.example.edhtrack.service;

import org.example.edhtrack.dto.CreateGameDTO;
import org.example.edhtrack.entity.Game;
import org.example.edhtrack.entity.GameParticipant;
import org.example.edhtrack.repository.DeckRepository;
import org.example.edhtrack.repository.GameParticipantRepository;
import org.example.edhtrack.repository.GameRepository;
import org.example.edhtrack.repository.PlayerRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class GameService {
    private final GameRepository gameRepository;
    private final GameParticipantRepository gameParticipantRepository;
    private final PlayerRepository playerRepository;
    private final DeckRepository deckRepository;

    public GameService(GameRepository gameRepository, GameParticipantRepository gameParticipantRepository, PlayerRepository playerRepository, DeckRepository deckRepository) {
        this.gameRepository = gameRepository;
        this.gameParticipantRepository = gameParticipantRepository;
        this.playerRepository = playerRepository;
        this.deckRepository = deckRepository;
    }

    public Game createGame(CreateGameDTO dto) {
        Game game = new Game();
        game.setDate(dto.date()==null ? LocalDate.now() : dto.date());
        game.setNotes(dto.notes());
        game.setWinner(playerRepository.findById(dto.winnerId()).orElse(null));

        Game savedGame = gameRepository.save(game);

        List<GameParticipant> gameParticipants = dto.participants().stream()
                .map(g -> {
                    GameParticipant gp = new GameParticipant();
                    gp.setGame(savedGame);
                    gp.setPlayer(playerRepository.findById(g.playerId()).orElseThrow());
                    gp.setDeckId(deckRepository.findById(g.deckId()).orElseThrow());
                    return gp;
                }).toList();

        gameParticipantRepository.saveAll(gameParticipants);

        savedGame.setParticipants(gameParticipants);

        return savedGame;
    }
}
