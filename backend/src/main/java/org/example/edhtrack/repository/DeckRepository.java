package org.example.edhtrack.repository;

import org.example.edhtrack.entity.Commander;
import org.example.edhtrack.entity.Deck;
import org.example.edhtrack.entity.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface DeckRepository extends JpaRepository<Deck, Integer> {
    List<Deck> findByPlayer_Id(int playerId);
    Optional<Deck> findByPlayerAndCommanders(Player player, Set<Commander> commanders);
    List<Deck> findByCommanders(Set<Commander> commanders);
    List<Deck> findByCommanders_NameIgnoreCase(String commanderName);
    Optional<Deck> findByPlayer_IdAndDeckName(int playerId, String deckName);
    //Nur Relevant für den Import meiner Dateien. Bitte ignorieren
    @Query("SELECT d FROM Deck d LEFT JOIN FETCH d.commanders WHERE d.player.id = :playerId")
    List<Deck> findByPlayer_IdWithCommanders(@Param("playerId") int playerId);
}
