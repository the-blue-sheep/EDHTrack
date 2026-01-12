package org.example.edhtrack.service;

import org.example.edhtrack.dto.GameParticipantDTO;
import org.example.edhtrack.dto.GameParticipantOverviewDTO;
import org.example.edhtrack.dto.game.CreateGameDTO;
import org.example.edhtrack.dto.game.CreateGameResponseDTO;
import org.example.edhtrack.dto.game.GameEditDTO;
import org.example.edhtrack.dto.game.GameOverviewDTO;
import org.example.edhtrack.dto.player.PlayerResultDTO;
import org.example.edhtrack.Utils;
import org.example.edhtrack.entity.Deck;
import org.example.edhtrack.entity.Game;
import org.example.edhtrack.entity.GameParticipant;
import org.example.edhtrack.entity.Player;
import org.example.edhtrack.repository.DeckRepository;
import org.example.edhtrack.repository.GameParticipantRepository;
import org.example.edhtrack.repository.GameRepository;
import org.example.edhtrack.repository.PlayerRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    private GameOverviewDTO mapToOverviewDTO(Game game) {
        return new GameOverviewDTO(
                game.getId(),
                game.getDate(),
                game.getNotes(),
                game.getPlayers().stream()
                        .map(p -> new GameParticipantOverviewDTO(
                                p.getPlayer().getId(),
                                p.getPlayer().getName(),
                                p.getDeck().getDeckId(),
                                p.getDeck().getDeckName(),
                                p.isWinner()
                        ))
                        .toList()
        );
    }

    public Page<GameOverviewDTO> getGames(
            int page,
            int size,
            Integer playerId,
            String commander
    ) {
        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "id")
        );

        return gameRepository
                .findByFilters(playerId, commander, pageable)
                .map(this::mapToOverviewDTO);
    }



    public GameOverviewDTO getGameById(int id) {
        return gameRepository.findById(id).map(this::mapToOverviewDTO).orElse(null);
    }

    public void deleteGameById(int id) {
        gameRepository.deleteById(id);
    }

    @Transactional
    public void updateGame(int gameId, GameEditDTO dto) throws Exception {

        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found"));

        game.setDate(dto.date());
        game.setNotes(dto.notes());

        game.getPlayers().clear();

        for (GameParticipantDTO p : dto.participants()) {

            Player player = playerRepository.findById(p.playerId())
                    .orElseThrow(() -> new Exception("Player not found with id: " + p.playerId()));

            Deck deck = deckRepository.findById(p.deckId())
                    .orElseThrow(() -> new Exception("Deck not found with id: " + p.deckId()));

            GameParticipant gp = new GameParticipant();
            gp.setGame(game);
            gp.setPlayer(player);
            gp.setDeck(deck);
            gp.setWinner(p.isWinner());

            game.getPlayers().add(gp);
        }

        gameRepository.save(game);
    }



}
