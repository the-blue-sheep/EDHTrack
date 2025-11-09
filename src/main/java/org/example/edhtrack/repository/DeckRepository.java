package org.example.edhtrack.repository;

import org.example.edhtrack.entity.Deck;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeckRepository extends JpaRepository<Deck, Integer> {
    List<Deck> findByPlayer_PlayerId(int playerId);
}
