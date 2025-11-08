package org.example.edhtrack.service;

import org.example.edhtrack.entity.Deck;
import org.example.edhtrack.repository.DeckRepository;

import java.util.List;

public class DeckService {
    private final DeckRepository deckRepository;

    public DeckService(DeckRepository deckRepository) {
        this.deckRepository = deckRepository;
    }

    public List<Deck> getDecksByPlayerId(int playerId) {
        return deckRepository.findPlayerByPlayerId(playerId);
    }
}
