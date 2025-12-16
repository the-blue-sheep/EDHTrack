package org.example.edhtrack.controller;

import org.example.edhtrack.dto.deck.CreateDeckDTO;
import org.example.edhtrack.dto.deck.DeckDTO;
import org.example.edhtrack.dto.deck.RetireDeckDTO;
import org.example.edhtrack.service.DeckService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/decks")
public class DeckController {
    private final DeckService deckService;

    public DeckController( DeckService deckService) {
        this.deckService = deckService;
    }

    @PostMapping
    public DeckDTO createDeck(@RequestBody CreateDeckDTO createDeckDTO) {
        return deckService.createDeck(createDeckDTO);
    }

    @PostMapping("/retire")
    public DeckDTO setRetiredDeckStatus(@RequestBody RetireDeckDTO retireDeckDTO) {
        return deckService.setRetiredDeckStatus(retireDeckDTO);
    }

    @PutMapping("/{id}")
    public DeckDTO updateDeck(@PathVariable int id, @RequestBody DeckDTO dto) {
        return deckService.updateDeck(id, dto);
    }


}
