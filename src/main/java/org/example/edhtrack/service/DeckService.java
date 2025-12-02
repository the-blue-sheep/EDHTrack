package org.example.edhtrack.service;

import org.example.edhtrack.dto.DeckDTO;
import org.example.edhtrack.dto.stats.CommanderAmountStatDTO;
import org.example.edhtrack.entity.Commander;
import org.example.edhtrack.entity.Deck;
import org.example.edhtrack.entity.Player;
import org.example.edhtrack.repository.DeckRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DeckService {
    private final DeckRepository deckRepository;

    public DeckService(DeckRepository deckRepository) {
        this.deckRepository = deckRepository;
    }

    public List<DeckDTO> getDecksByPlayerId(int playerId) {
        return deckRepository.findByPlayer_Id(playerId)
                .stream()
                .map(deck -> new DeckDTO(
                        deck.getDeckId(),
                        deck.getCommanders()
                                .stream()
                                .map(Commander::getName)
                                .toList(),
                        deck.getDeckName(),
                        deck.getColors(),
                        deck.isRetired()
                ))
                .toList();
    }


    public Deck createDeck(Player player, Deck deck) {
        deck.setPlayer(player);
        return deckRepository.save(deck);
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

    public Deck setRetiredDeckStatus(Deck deck, boolean isRetired) {
        deck.setRetired(isRetired);
        return deckRepository.save(deck);

    }
}
