package org.example.edhtrack.repository;

import org.example.edhtrack.entity.Commander;
import org.example.edhtrack.entity.Deck;
import org.example.edhtrack.entity.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeckRepository extends JpaRepository<Deck, Integer> {
    List<Deck> findByPlayer_Id(int playerId);
    Optional<Deck> findByPlayerAndCommanders(Player player, List<Commander> commanders);
    List<Deck> findByCommanders(List<Commander> commanders);
    List<Deck> findByCommanders_NameIgnoreCase(String commanderName);
    Optional<Deck> findByPlayer_IdAndDeckName(int playerId, String deckName);
}
