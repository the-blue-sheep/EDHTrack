package org.example.edhtrack.service;

import org.example.edhtrack.dto.deck.CreateDeckDTO;
import org.example.edhtrack.dto.deck.DeckDTO;
import org.example.edhtrack.dto.deck.RetireDeckDTO;
import org.example.edhtrack.entity.Commander;
import org.example.edhtrack.entity.Deck;
import org.example.edhtrack.entity.Player;
import org.example.edhtrack.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;



class DeckServiceTest {

    @Mock
    DeckRepository deckRepository;
    @Mock
    CommanderRepository commanderRepository;
    @Mock
    PlayerRepository playerRepository;
    @Mock
    GameParticipantRepository gameParticipantRepository;

    DeckService deckService;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
        deckService = new DeckService(deckRepository, commanderRepository, playerRepository, gameParticipantRepository);
    }


    @Test
    void getDecksByPlayerId_returnsDeckDTOs() {
        Player player = new Player("Alice");
        player.setPlayerId(1);

        Deck deck = new Deck();
        deck.setDeckId(10);
        deck.setPlayer(player);

        Commander c1 = new Commander("Delney");
        deck.setCommanders(Set.of(c1));
        deck.setDeckName("Apparently Hares");
        deck.setColors("W");
        deck.setRetired(false);

        when(deckRepository.findByPlayer_Id(1)).thenReturn(List.of(deck));

        Set<DeckDTO> result = deckService.getDecksByPlayerId(1);

        assertThat(result).hasSize(1);
        DeckDTO dto = result.iterator().next();
        assertThat(dto.deckId()).isEqualTo(10);
        assertThat(dto.commanders()).contains("Delney");
        assertThat(dto.deckName()).isEqualTo("Apparently Hares");
        assertThat(dto.colors()).isEqualTo("W");
        assertThat(dto.retired()).isFalse();
    }

    @Test
    void createDeck_savesAndReturnsDeckDTO() {
        Player player = new Player("Bob");
        player.setPlayerId(2);

        when(playerRepository.findById(2)).thenReturn(Optional.of(player));

        when(commanderRepository.findByNameIgnoreCase(anyString()))
                .thenAnswer(invocation ->
                        Optional.of(new Commander(invocation.getArgument(0)))
                );

        when(deckRepository.save(any(Deck.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        CreateDeckDTO createDTO = new CreateDeckDTO(
                2,
                Set.of("Hylda", "Zethi"),
                "Ice Ice Baby",
                "WU"
        );

        DeckDTO result = deckService.createDeck(createDTO);

        assertThat(result.deckName()).isEqualTo("Ice Ice Baby");
        assertThat(result.commanders()).containsExactlyInAnyOrder("Hylda", "Zethi");
        assertThat(result.colors()).isEqualTo("WU");

        verify(commanderRepository, times(2)).findByNameIgnoreCase(anyString());
        verify(deckRepository).save(any(Deck.class));
    }


    @Test
    void getCommanderAmounts_countsCorrectly() {
        Deck d1 = new Deck();
        d1.setCommanders(Set.of(new Commander("X")));

        Deck d2 = new Deck();
        d2.setCommanders(Set.of(new Commander("X")));

        when(deckRepository.findAll()).thenReturn(List.of(d1, d2));

        var stats = deckService.getCommanderAmounts();

        assertThat(stats).hasSize(1);
        assertThat(stats.getFirst().commander()).isEqualTo("X");
    }

    @Test
    void getDeckByCommanderName_findsFirstMatch() {
        Commander cA = new Commander("Squee, Dubious Monarch");
        Deck deck = new Deck();
        deck.setCommanders(Set.of(cA));

        Deck deck2 = new Deck();
        deck2.setCommanders(Set.of(new Commander("Nope")));

        when(deckRepository.findAll()).thenReturn(List.of(deck2, deck));

        Deck found = deckService.getDeckByCommanderName("Squee, Dubious Monarch");

        assertThat(found).isEqualTo(deck);
    }

    @Test
    void getDeckByCommanderName_returnsNullIfNone() {
        when(deckRepository.findAll()).thenReturn(Collections.emptyList());
        assertThat(deckService.getDeckByCommanderName("Hazezon Tamar")).isNull();
    }


    @Test
    void setRetiredDeckStatus_flipsRetiredStatus() {
        Deck deck = new Deck();
        deck.setDeckId(5);
        deck.setCommanders(new HashSet<>());
        deck.setRetired(false);

        when(deckRepository.findById(5)).thenReturn(Optional.of(deck));
        when(deckRepository.save(any(Deck.class))).thenAnswer(i -> i.getArgument(0));

        RetireDeckDTO retireDTO = new RetireDeckDTO(5, true);

        DeckDTO result = deckService.setRetiredDeckStatus(retireDTO);

        assertThat(result.deckId()).isEqualTo(5);
        assertThat(result.retired()).isTrue();
        verify(deckRepository).save(deck);
    }

    @Test
    void updateDeck_updatesFieldsAndCommanders() {
        Deck existing = new Deck();
        existing.setDeckId(9);
        existing.setCommanders(Set.of(new Commander("Colfenor")));
        existing.setDeckName("Weird Recursion");
        existing.setColors("WBG");
        existing.setRetired(false);

        when(deckRepository.findById(9)).thenReturn(Optional.of(existing));
        when(commanderRepository.save(any(Commander.class)))
                .thenAnswer(i -> i.getArgument(0));
        when(deckRepository.save(existing)).thenAnswer(i -> i.getArgument(0));

        DeckDTO dto = new DeckDTO(
                9,
                Set.of("Reyhan"),
                "+1/+1 counter",
                "BG",
                true
        );

        DeckDTO updated = deckService.updateDeck(9, dto);

        assertThat(updated.deckName()).isEqualTo("+1/+1 counter");
        assertThat(updated.colors()).isEqualTo("BG");
        assertThat(updated.retired()).isTrue();
        assertThat(updated.commanders()).contains("Reyhan");

        verify(commanderRepository).findByNameIgnoreCase("Reyhan");
        verify(deckRepository).save(existing);
    }

    @Test
    void getAllCommanderNames_shouldReturnAllCommanderNames() {
        // given
        Commander atraxa = new Commander("Atraxa");
        Commander edgar = new Commander("Edgar Markov");
        Commander yuriko = new Commander("Yuriko");

        Deck deck1 = new Deck();
        deck1.setCommanders(Set.of(atraxa, edgar));

        Deck deck2 = new Deck();
        deck2.setCommanders(Set.of(atraxa, yuriko));

        when(deckRepository.findAll()).thenReturn(List.of(deck1, deck2));

        // when
        List<String> result = deckService.getAllCommanderNames();

        // then
        assertThat(result)
                .containsExactly(
                        "Atraxa",
                        "Edgar Markov",
                        "Yuriko"
                );

    }
}