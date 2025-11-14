package org.example.edhtrack.controller;

import org.example.edhtrack.entity.Deck;
import org.example.edhtrack.entity.Player;
import org.example.edhtrack.service.DeckService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/decks")
public class DeckController {
    private final DeckService deckService;

    public DeckController( DeckService deckService) {
        this.deckService = deckService;
    }

    @PostMapping
    public Deck createDeck(@RequestBody Player player, Deck deck) {
        return deckService.createDeck(player, deck);
    }

    @GetMapping
    public List<Deck> getDecks(int playerId) {
        return deckService.getDecksByPlayerId(playerId);
    }

    @PostMapping("/retire")
    public Deck setRetiredDeckStatus(@RequestBody Deck deck, boolean isRetired) {
        return deckService.setRetiredDeckStatus(deck, isRetired);
    }


}
