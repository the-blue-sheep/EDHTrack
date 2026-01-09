package org.example.edhtrack.repository;

import org.example.edhtrack.entity.Deck;
import org.example.edhtrack.entity.GameParticipant;
import org.example.edhtrack.entity.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GameParticipantRepository extends JpaRepository<GameParticipant,Integer> {
    List<GameParticipant> findByPlayer(Player player);

    List<GameParticipant> findByDeck_ColorsContaining(String colors);

    List<GameParticipant> findByDeck_Commanders_NameIgnoreCase(String commanderName);

    int countByPlayer(Player player);

    List<GameParticipant> findByPlayerAndDeck(Player player, Deck deck);
}
