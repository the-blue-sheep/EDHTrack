package org.example.edhtrack.repository;

import org.example.edhtrack.entity.Deck;
import org.example.edhtrack.entity.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeckRepository extends JpaRepository<Deck, Integer> {
    List<Deck> findByPlayer_Id(int playerId);
    Optional<Deck> findByPlayerAndCommander(Player player, String commander);
    List<Deck> findByCommander(String commander);
}
