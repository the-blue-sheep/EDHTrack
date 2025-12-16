package org.example.edhtrack.service;

import org.example.edhtrack.Utils;
import org.example.edhtrack.dto.deck.CreateDeckDTO;
import org.example.edhtrack.dto.deck.DeckDTO;
import org.example.edhtrack.dto.deck.RetireDeckDTO;
import org.example.edhtrack.dto.stats.CommanderAmountStatDTO;
import org.example.edhtrack.entity.Commander;
import org.example.edhtrack.entity.Deck;
import org.example.edhtrack.entity.Player;
import org.example.edhtrack.repository.CommanderRepository;
import org.example.edhtrack.repository.DeckRepository;
import org.example.edhtrack.repository.PlayerRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class DeckService {
    private final DeckRepository deckRepository;
    private final CommanderRepository commanderRepository;
    private final PlayerRepository playerRepository;

    public DeckService(DeckRepository deckRepository, CommanderRepository commanderRepository, PlayerRepository playerRepository) {
        this.deckRepository = deckRepository;
        this.commanderRepository = commanderRepository;
        this.playerRepository = playerRepository;
    }

    public Set<DeckDTO> getDecksByPlayerId(int playerId) {
        return deckRepository.findByPlayer_Id(playerId)
                .stream()
                .map(deck -> new DeckDTO(
                        deck.getDeckId(),
                        deck.getCommanders()
                                .stream()
                                .map(Commander::getName)
                                .collect(Collectors.toSet()),
                        deck.getDeckName(),
                        deck.getColors(),
                        deck.isRetired()
                ))
                .collect(Collectors.toSet());
    }


    public DeckDTO createDeck(CreateDeckDTO createDeckDTO) {
        Player player = playerRepository.findById(createDeckDTO.playerId())
                .orElseThrow( () -> new RuntimeException("Player not found"));

        Deck deck = new Deck();
        deck.setPlayer(player);
        deck.setDeckName(createDeckDTO.deckName());
        deck.setColors(createDeckDTO.colors());

        Set<Commander> commanders = createDeckDTO.commanders().stream()
                .map(name -> commanderRepository.findByNameIgnoreCase(name)
                        .orElseGet( () -> commanderRepository.save(new Commander(name))))
                        .collect(Collectors.toSet());
        deck.setCommanders(commanders);

        Deck saved = deckRepository.save(deck);
        return Utils.toDTO(saved);
    }

    public List<CommanderAmountStatDTO> getCommanderAmounts() {
        return deckRepository.findAll()
                .stream()
                .collect(Collectors.groupingBy(
                        deck -> deck.getCommanders()
                                .stream()
                                .map(Commander::getName)
                                .sorted()
                                .collect(Collectors.joining(", ")),
                        Collectors.counting()
                ))
                .entrySet()
                .stream()
                .sorted(Comparator.comparing(Map.Entry<String, Long>::getValue).reversed())
                .map(entry -> new CommanderAmountStatDTO(entry.getKey(), entry.getValue()))
                .toList();
    }


    public Deck getDeckByCommanderName(String commanderName) {
        return deckRepository.findAll()
                .stream()
                .filter(deck -> deck.getCommanders() != null)
                .filter(deck -> deck.getCommanders().stream()
                        .anyMatch(c -> c.getName().equalsIgnoreCase(commanderName)))
                .findFirst()
                .orElse(null);
    }

    public DeckDTO setRetiredDeckStatus(RetireDeckDTO retireDeckDTO) {
        Deck deck = deckRepository.findById(retireDeckDTO.deckId())
                .orElseThrow(() -> new RuntimeException("Deck not found"));

        deck.setRetired(!deck.isRetired);

        Deck saved = deckRepository.save(deck);
        return Utils.toDTO(saved);
    }

    public DeckDTO updateDeck(int id, DeckDTO dto) {
        Deck deck = deckRepository.findById(dto.deckId())
                .orElseThrow(() -> new RuntimeException("Deck not found with id: " + id));

        deck.setDeckName(dto.deckName());
        deck.setColors(dto.colors());
        deck.setRetired(dto.retired());

        Set<String> commanderNames = dto.commanders();
        Set<Commander> commanders = commanderNames.stream()
                .map(name -> commanderRepository
                        .findByNameIgnoreCase(name)
                        .orElseGet(() -> commanderRepository.save(new Commander(name)))
                ).collect(Collectors.toSet());

        deck.setCommanders(commanders);

        Deck saved = deckRepository.save(deck);

        return Utils.toDTO(saved);
    }

}
