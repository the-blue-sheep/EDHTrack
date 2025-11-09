package org.example.edhtrack.service;

import org.example.edhtrack.dto.stats.CommanderAmountStatDTO;
import org.example.edhtrack.entity.Deck;
import org.example.edhtrack.entity.Player;
import org.example.edhtrack.repository.DeckRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DeckService {
    private final DeckRepository deckRepository;

    public DeckService(DeckRepository deckRepository) {
        this.deckRepository = deckRepository;
    }

    public List<Deck> getDecksByPlayerId(int playerId) {
        return deckRepository.findByPlayer_PlayerId(playerId);
    }

    public Deck createDeck(Player player, Deck deck) {
        deck.setPlayer(player);
        return deckRepository.save(deck);
    }

    public List<CommanderAmountStatDTO> getCommanderAmounts() {
        return deckRepository.findAll()
                .stream()
                .collect(Collectors.groupingBy(Deck::getCommander, Collectors.counting()))
                .entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .map(entry -> new CommanderAmountStatDTO(entry.getKey(), entry.getValue()))
                .toList();

    }

    public Deck getDeckByCommanderName(String commanderName) {
        return deckRepository.findAll()
                .stream()
                .filter(deck -> deck.getCommander().equals(commanderName))
                .findFirst()
                .orElse(null);
    }
}
