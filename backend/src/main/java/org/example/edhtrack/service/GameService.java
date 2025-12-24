package org.example.edhtrack.service;

import org.example.edhtrack.dto.GameParticipantOverviewDTO;
import org.example.edhtrack.dto.game.CreateGameDTO;
import org.example.edhtrack.dto.game.CreateGameResponseDTO;
import org.example.edhtrack.dto.game.GameOverviewDTO;
import org.example.edhtrack.dto.player.PlayerResultDTO;
import org.example.edhtrack.Utils;
import org.example.edhtrack.entity.Game;
import org.example.edhtrack.entity.GameParticipant;
import org.example.edhtrack.repository.DeckRepository;
import org.example.edhtrack.repository.GameParticipantRepository;
import org.example.edhtrack.repository.GameRepository;
import org.example.edhtrack.repository.PlayerRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

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

    public CreateGameResponseDTO createGame(CreateGameDTO dto) {

        Game game = new Game();
        game.setDate(dto.date() == null ? LocalDate.now() : dto.date());
        game.setNotes(dto.notes());

        Game savedGame = gameRepository.save(game);

        List<GameParticipant> gameParticipants = dto.participants().stream()
                .map(p -> {
                    GameParticipant gp = new GameParticipant();
                    gp.setGame(savedGame);
                    gp.setPlayer(playerRepository.findById(p.playerId()).orElseThrow());
                    gp.setDeck(deckRepository.findById(p.deckId()).orElseThrow());
                    gp.setWinner(p.isWinner());
                    return gp;
                })
                .toList();

        gameParticipantRepository.saveAll(gameParticipants);

        savedGame.setPlayers(gameParticipants);

        List<PlayerResultDTO> playerResults = savedGame.getPlayers()
                .stream()
                .map(Utils::mapToPlayerResult)
                .toList();


        return new CreateGameResponseDTO(
                savedGame.getId(),
                savedGame.getDate(),
                playerResults
        );
    }

    public List<GameOverviewDTO> getAllGames() {
        return gameRepository.findAll().stream()
                .map(game -> new GameOverviewDTO(
                        game.getId(),
                        game.getDate(),
                        game.getNotes(),
                        game.getPlayers().stream()
                                .map(gp -> new GameParticipantOverviewDTO(
                                        gp.getPlayer().getId(),
                                        gp.getPlayer().getName(),
                                        gp.getDeck().getDeckId(),
                                        gp.getDeck().getDeckName(),
                                        gp.isWinner()
                                ))
                                .collect(Collectors.toList())
                ))
                .collect(Collectors.toList());
    }

}
