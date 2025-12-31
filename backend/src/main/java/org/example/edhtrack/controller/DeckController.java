package org.example.edhtrack.controller;

import org.example.edhtrack.dto.deck.CreateDeckDTO;
import org.example.edhtrack.dto.deck.DeckDTO;
import org.example.edhtrack.dto.deck.RetireDeckDTO;
import org.example.edhtrack.dto.stats.CommanderWinRateDTO;
import org.example.edhtrack.service.DeckService;
import org.example.edhtrack.service.StatisticService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/decks")
public class DeckController {
    private final DeckService deckService;
    private final StatisticService statisticService;

    public DeckController(DeckService deckService, StatisticService statisticService) {
        this.deckService = deckService;
        this.statisticService = statisticService;
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

    @GetMapping("/commander-winrates")
    public List<CommanderWinRateDTO> getAllCommanderWinrates() {
        return statisticService.getWinRatesForAllCommanders();
    }

}
