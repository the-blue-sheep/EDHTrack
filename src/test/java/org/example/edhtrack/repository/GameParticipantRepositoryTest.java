package org.example.edhtrack.repository;

import org.example.edhtrack.entity.Deck;
import org.example.edhtrack.entity.GameParticipant;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.util.List;

import static org.assertj.core.api.AssertionsForInterfaceTypes.assertThat;

@DataJpaTest
class GameParticipantRepositoryTest {

    @Autowired
    private GameParticipantRepository gameParticipantRepository;

    @Autowired
    private TestEntityManager entityManager;

    @Test
    void findByDeck_ColorsContaining_shouldReturnCorrectEntries() {
        Deck deck = new Deck();
        deck.setCommander("Atraxa");
        deck.setColors("WUBG");
        entityManager.persist(deck);

        GameParticipant participant = new GameParticipant();
        participant.setDeck(deck);
        entityManager.persist(participant);

        List<GameParticipant> result = gameParticipantRepository.findByDeck_ColorsContaining("WUBG");
        assertThat(result).hasSize(1);
    }
}
