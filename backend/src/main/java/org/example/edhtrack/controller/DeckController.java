package org.example.edhtrack.controller;

import org.example.edhtrack.Utils;
import org.example.edhtrack.dto.deck.CreateDeckDTO;
import org.example.edhtrack.dto.deck.DeckDTO;
import org.example.edhtrack.dto.deck.RetireDeckDTO;
import org.example.edhtrack.service.DeckService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/decks")
public class DeckController {
    private final DeckService deckService;

    public DeckController(DeckService deckService) {
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

    @GetMapping("/commanders")
    public List<String> getAllCommanderNames() {
        return deckService.getAllCommanderNames();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteDeck(@PathVariable int id) {
        try {
            deckService.deleteDeck(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }

    @GetMapping("/brackets")
    public List<Map<String, String>> getAllBracketNames() {
        return Arrays.stream(Utils.Bracket.values())
                .map(b -> Map.of(
                        "name", b.name(),
                        "displayName", b.getDisplayName()
                ))
                .toList();
    }
}
