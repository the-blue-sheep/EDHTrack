package org.example.edhtrack.repository;

import org.example.edhtrack.entity.Deck;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DeckRepository extends JpaRepository<Deck,Integer> {
}
